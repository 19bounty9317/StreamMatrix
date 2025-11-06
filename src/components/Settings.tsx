import { useState, useEffect } from 'react';
import { themes, getTheme, applyTheme } from '../styles/themes';
import { triggerCelebration } from './EventCelebration';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsData {
  notifications: boolean;
  notificationSound: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  themeId: string;
  language: 'de' | 'en';
  showAvatar: boolean;
  compactMode: boolean;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsData>(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved) : {
      notifications: true,
      notificationSound: true,
      autoRefresh: true,
      refreshInterval: 30,
      themeId: 'twitch-dark',
      language: 'de',
      showAvatar: true,
      compactMode: false
    };
  });

  const [obsHost, setObsHost] = useState('localhost');
  const [obsPort, setObsPort] = useState('4455');
  const [obsPassword, setObsPassword] = useState('');
  const [obsConnected, setObsConnected] = useState(false);
  const [obsConnecting, setObsConnecting] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');

  useEffect(() => {
    const theme = getTheme(settings.themeId);
    applyTheme(theme);
  }, [settings.themeId]);

  // Höre auf Update-Status-Events
  useEffect(() => {
    if (window.electron?.onUpdateStatus) {
      window.electron.onUpdateStatus((status) => {
        console.log('Update-Status:', status);
        
        if (status.status === 'not-available') {
          setUpdateStatus('✅ ' + status.message);
        } else if (status.status === 'available') {
          setUpdateStatus('🎉 ' + status.message);
        } else if (status.status === 'downloading') {
          setUpdateStatus('📥 ' + status.message);
        } else if (status.status === 'downloaded') {
          setUpdateStatus('✅ ' + status.message);
        } else if (status.status === 'error') {
          setUpdateStatus('❌ ' + status.message);
        }
        
        // Reset nach 8 Sekunden (außer bei Download)
        if (status.status !== 'downloading') {
          setTimeout(() => setUpdateStatus(''), 8000);
        }
      });
    }
  }, []);

  useEffect(() => {
    // Lade OBS-Einstellungen
    const savedObs = localStorage.getItem('obs-settings');
    if (savedObs) {
      const obs = JSON.parse(savedObs);
      setObsHost(obs.host || 'localhost');
      setObsPort(obs.port || '4455');
      setObsPassword(obs.password || '');
    }

    // Prüfe OBS-Verbindung
    const checkOBSConnection = async () => {
      try {
        const OBSService = (await import('../services/OBSService')).default;
        const obsService = OBSService.getInstance();
        setObsConnected(obsService.isConnectedToOBS());
      } catch (error) {
        console.error('Fehler beim Prüfen der OBS-Verbindung:', error);
      }
    };
    checkOBSConnection();
  }, []);

  const saveSettings = (newSettings: SettingsData) => {
    setSettings(newSettings);
    localStorage.setItem('app-settings', JSON.stringify(newSettings));
    
    // Aktualisiere RefreshService wenn Auto-Refresh Einstellungen geändert wurden
    import('../services/RefreshService').then(({ default: RefreshService }) => {
      const refreshService = RefreshService.getInstance();
      refreshService.updateSettings(newSettings.autoRefresh, newSettings.refreshInterval);
    });
    
    // Triggere Storage Event für andere Komponenten
    window.dispatchEvent(new Event('storage'));
  };

  const handleChange = (key: keyof SettingsData, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleReset = () => {
    if (confirm('Alle Einstellungen zurücksetzen?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleOBSConnect = async () => {
    setObsConnecting(true);
    try {
      const OBSService = (await import('../services/OBSService')).default;
      const obsService = OBSService.getInstance();
      
      // Speichere Einstellungen
      const obsSettings = {
        host: obsHost,
        port: obsPort,
        password: obsPassword
      };
      localStorage.setItem('obs-settings', JSON.stringify(obsSettings));

      // Verbinde mit OBS
      const connected = await obsService.connect(obsHost, parseInt(obsPort), obsPassword);
      
      if (connected) {
        setObsConnected(true);
        // Triggere Event für andere Komponenten
        window.dispatchEvent(new CustomEvent('obs-connected'));
        alert('✅ Erfolgreich mit OBS verbunden!');
      } else {
        setObsConnected(false);
        alert(
          '❌ Verbindung fehlgeschlagen!\n\n' +
          'Mögliche Ursachen:\n' +
          '• OBS ist nicht geöffnet\n' +
          '• WebSocket Server ist nicht aktiviert\n' +
          '• Falscher Port oder Passwort\n' +
          '• Firewall blockiert die Verbindung\n\n' +
          'Prüfe: Tools → WebSocket Server Settings in OBS'
        );
      }
    } catch (error: any) {
      console.error('OBS Verbindungsfehler:', error);
      setObsConnected(false);
      alert(
        '❌ Verbindung fehlgeschlagen!\n\n' +
        `Fehler: ${error.message || 'Unbekannter Fehler'}\n\n` +
        'Stelle sicher dass:\n' +
        '• OBS läuft\n' +
        '• WebSocket aktiviert ist\n' +
        '• Port und Passwort korrekt sind'
      );
    } finally {
      setObsConnecting(false);
    }
  };

  const handleOBSDisconnect = async () => {
    try {
      const OBSService = (await import('../services/OBSService')).default;
      const obsService = OBSService.getInstance();
      obsService.disconnect();
      setObsConnected(false);
      // Triggere Event für andere Komponenten
      window.dispatchEvent(new CustomEvent('obs-disconnected'));
    } catch (error) {
      console.error('OBS Disconnect Fehler:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: 'var(--color-tile)', border: '3px solid var(--color-accent)' }}>
        {/* Header */}
        <div className="sticky top-0 p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--color-tile-header)', borderBottom: '2px solid var(--color-accent)' }}>
          <h2 className="text-xl font-bold theme-text">⚙️ Einstellungen</h2>
          <button
            onClick={onClose}
            className="theme-text-secondary text-2xl"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Aktualisierung */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold theme-text">🔄 Aktualisierung</h3>
            
            <label className="flex items-center justify-between p-3 theme-tile-content-bg rounded theme-button cursor-pointer">
              <span className="theme-text">Automatische Aktualisierung</span>
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                className="w-5 h-5"
              />
            </label>

            <div className="p-3 theme-tile-content-bg rounded">
              <label className="block theme-text mb-2">
                Aktualisierungs-Intervall (Sekunden)
              </label>
              <input
                type="range"
                min="1"
                max="75"
                step="1"
                value={settings.refreshInterval}
                onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
                className="w-full"
                disabled={!settings.autoRefresh}
              />
              <div className="theme-text-secondary text-sm mt-1">
                {settings.refreshInterval} Sekunden
              </div>
            </div>
          </div>

          {/* Design/Theme */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold theme-text">🎨 Design</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleChange('themeId', theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.themeId === theme.id
                      ? 'border-twitch-purple bg-twitch-purple bg-opacity-20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{
                    backgroundColor: theme.colors.tile,
                    borderColor: settings.themeId === theme.id ? theme.colors.tileBorder : theme.colors.border
                  }}
                >
                  <div className="text-3xl mb-2">{theme.emoji}</div>
                  <div className="font-semibold" style={{ color: theme.colors.text }}>
                    {theme.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                    {theme.id.includes('light') ? 'Hell' : 'Dunkel'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Darstellung */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold theme-text">⚙️ Darstellung</h3>
            
            <label className="flex items-center justify-between p-3 theme-tile-content-bg rounded theme-button cursor-pointer">
              <span className="theme-text">Avatar in Sidebar anzeigen</span>
              <input
                type="checkbox"
                checked={settings.showAvatar}
                onChange={(e) => handleChange('showAvatar', e.target.checked)}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between p-3 theme-tile-content-bg rounded theme-button cursor-pointer">
              <span className="theme-text">Kompakt-Modus</span>
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => handleChange('compactMode', e.target.checked)}
                className="w-5 h-5"
              />
            </label>
          </div>

          {/* Event Celebrations */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold theme-text">🎉 Event-Effekte</h3>
            
            <div className="p-3 theme-tile-content-bg rounded">
              <label className="block theme-text mb-2">
                Anzeigedauer der Effekte
              </label>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={(() => {
                  const saved = localStorage.getItem('celebration-duration');
                  return saved ? parseInt(saved) : 5;
                })()}
                onChange={(e) => {
                  const duration = parseInt(e.target.value);
                  localStorage.setItem('celebration-duration', duration.toString());
                  // Trigger Event für EventCelebration
                  const event = new CustomEvent('celebration-duration-change', { detail: duration });
                  window.dispatchEvent(event);
                  // Force re-render
                  setSettings({...settings});
                }}
                className="w-full"
              />
              <div className="theme-text-secondary text-sm mt-1">
                {(() => {
                  const saved = localStorage.getItem('celebration-duration');
                  return saved ? parseInt(saved) : 5;
                })()} Sekunden
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold theme-text">Test-Modus</div>
                  <div className="text-xs theme-text-secondary mt-1">
                    Aktiviere den Test-Modus um Events in allen Kacheln zu simulieren
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(() => {
                      return localStorage.getItem('test-mode-active') === 'true';
                    })()}
                    onChange={async (e) => {
                      const isActive = e.target.checked;
                      localStorage.setItem('test-mode-active', isActive.toString());
                      
                      if (isActive) {
                        // Test-Modus aktivieren - starte Test-Session
                        const StreamSessionTracker = (await import('../services/StreamSessionTracker')).default;
                        const tracker = StreamSessionTracker.getInstance();
                        const existingStats = tracker.getStats();
                        
                        if (!existingStats || !existingStats.isLive) {
                          const { TwitchService } = await import('../services/TwitchService');
                          const user = TwitchService.getUserFromStorage();
                          if (user) {
                            await tracker.startSession(user.id);
                          }
                        }
                      } else {
                        // Test-Modus deaktivieren - lösche alle Test-Daten
                        
                        // 1. Lösche Activity Feed Test-Daten
                        const activityFeed = localStorage.getItem('activity-feed');
                        if (activityFeed) {
                          const activities = JSON.parse(activityFeed);
                          const cleanedActivities = activities.filter((a: any) => !a.id.startsWith('test-'));
                          localStorage.setItem('activity-feed', JSON.stringify(cleanedActivities));
                        }
                        
                        // 2. Trigger Event zum Neuladen aller Kacheln
                        const reloadEvent = new CustomEvent('reload-tiles');
                        window.dispatchEvent(reloadEvent);
                        
                        // 3. Lade echte Daten neu
                        const { TwitchService } = await import('../services/TwitchService');
                        const user = TwitchService.getUserFromStorage();
                        if (user) {
                          // Prüfe ob Stream live ist
                          const streamInfo = await TwitchService.getStreamInfo(user.id);
                          const StreamSessionTracker = (await import('../services/StreamSessionTracker')).default;
                          const tracker = StreamSessionTracker.getInstance();
                          
                          if (streamInfo) {
                            // Stream ist live - aktualisiere Session
                            await tracker.updateCurrentStats(user.id);
                          } else {
                            // Stream ist offline - beende Session
                            tracker.endSession();
                          }
                        }
                      }
                      
                      // Trigger Event für alle Komponenten
                      const event = new CustomEvent('test-mode-change', { detail: isActive });
                      window.dispatchEvent(event);
                      // Force re-render
                      setSettings({...settings});
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {localStorage.getItem('test-mode-active') === 'true' && (
                <>
                  <div className="mb-3 p-2 bg-orange-500/20 border border-orange-500/50 rounded text-xs theme-text">
                    ⚠️ Test-Modus aktiv - Events werden in allen Kacheln simuliert
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => triggerCelebration({ type: 'sub', username: 'TestUser' })}
                      className="px-3 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
                    >
                      ⭐ Sub
                    </button>
                    <button
                      onClick={() => triggerCelebration({ type: 'bits', username: 'TestUser', amount: 1000 })}
                      className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                    >
                      💎 Bits
                    </button>
                    <button
                      onClick={() => triggerCelebration({ type: 'follow', username: 'NewFollower' })}
                      className="px-3 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
                    >
                      👤 Follow
                    </button>
                    <button
                      onClick={() => triggerCelebration({ type: 'raid', username: 'Raider', amount: 250 })}
                      className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
                    >
                      🚀 Raid
                    </button>
                    <button
                      onClick={() => triggerCelebration({ type: 'donation', username: 'Donor', amount: 10 })}
                      className="px-3 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold transition-colors"
                    >
                      💵 Dono
                    </button>
                    <button
                      onClick={() => triggerCelebration({ type: 'gift-sub', username: 'Gifter', amount: 5 })}
                      className="px-3 py-2 rounded bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold transition-colors"
                    >
                      ⭐ Gift
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* OBS Integration */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold theme-text">🎥 OBS Integration</h3>
            <div className="p-3 theme-tile-content-bg rounded space-y-3">
              <div>
                <label className="block theme-text text-sm mb-1">OBS WebSocket Host:</label>
                <input
                  type="text"
                  value={obsHost}
                  onChange={(e) => setObsHost(e.target.value)}
                  placeholder="localhost"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: 'var(--color-tile)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                  disabled={obsConnected}
                />
              </div>
              <div>
                <label className="block theme-text text-sm mb-1">Port:</label>
                <input
                  type="number"
                  value={obsPort}
                  onChange={(e) => setObsPort(e.target.value)}
                  placeholder="4455"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: 'var(--color-tile)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                  disabled={obsConnected}
                />
              </div>
              <div>
                <label className="block theme-text text-sm mb-1">Passwort (optional):</label>
                <input
                  type="password"
                  value={obsPassword}
                  onChange={(e) => setObsPassword(e.target.value)}
                  placeholder="OBS WebSocket Passwort"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: 'var(--color-tile)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                  disabled={obsConnected}
                />
              </div>
              
              {obsConnected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: 'var(--color-success)', color: '#FFFFFF' }}>
                    <span>✓</span>
                    <span className="text-sm font-medium">Mit OBS verbunden</span>
                  </div>
                  <button
                    onClick={handleOBSDisconnect}
                    className="w-full px-4 py-2 rounded text-sm font-medium"
                    style={{ backgroundColor: 'var(--color-error)', color: '#FFFFFF' }}
                  >
                    🔌 Verbindung trennen
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOBSConnect}
                  disabled={obsConnecting}
                  className="w-full px-4 py-2 rounded text-sm font-medium"
                  style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF', opacity: obsConnecting ? 0.6 : 1 }}
                >
                  {obsConnecting ? '⏳ Verbinde...' : '🔗 Mit OBS verbinden'}
                </button>
              )}
              
              <div className="text-xs theme-text-secondary space-y-1">
                <div>💡 <strong>OBS WebSocket aktivieren:</strong></div>
                <div className="ml-4">1. OBS öffnen</div>
                <div className="ml-4">2. Tools → WebSocket Server Settings</div>
                <div className="ml-4">3. "Enable WebSocket server" aktivieren</div>
                <div className="ml-4">4. Port und Passwort notieren</div>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold theme-text">🔄 Updates</h3>
            
            <div className="p-3 theme-tile-content-bg rounded space-y-3">
              <div className="text-sm theme-text-secondary">
                StreamMatrix sucht automatisch nach Updates. Du kannst auch manuell prüfen:
              </div>
              
              <button
                onClick={() => {
                  if (window.electron?.checkForUpdates) {
                    setUpdateStatus('🔍 Suche nach Updates...');
                    window.electron.checkForUpdates();
                  } else {
                    setUpdateStatus('❌ Update-Funktion nicht verfügbar');
                    setTimeout(() => setUpdateStatus(''), 3000);
                  }
                }}
                className="w-full px-4 py-2 rounded font-semibold transition-all"
                style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                disabled={updateStatus !== '' && !updateStatus.includes('✅')}
              >
                🔍 Nach Updates suchen
              </button>
              
              {updateStatus && (
                <div className="p-2 rounded text-sm font-semibold text-center"
                     style={{ 
                       backgroundColor: updateStatus.includes('❌') ? 'var(--color-error)' : 
                                       updateStatus.includes('✅') ? '#10b981' : 
                                       'var(--color-accent)',
                       color: '#FFFFFF'
                     }}>
                  {updateStatus}
                </div>
              )}
              
              <div className="text-xs theme-text-secondary">
                💡 Updates werden automatisch heruntergeladen und beim nächsten Start installiert.
              </div>
            </div>
          </div>

          {/* App-Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold theme-text">ℹ️ App-Informationen</h3>
            
            <div className="p-3 theme-tile-content-bg rounded space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="theme-text-secondary">Version:</span>
                <span className="theme-text">1.3.4</span>
              </div>
              <div className="flex justify-between">
                <span className="theme-text-secondary">Name:</span>
                <span className="theme-text">StreamMatrix</span>
              </div>
              <div className="flex justify-between">
                <span className="theme-text-secondary">Plattform:</span>
                <span className="theme-text">Windows</span>
              </div>
              <div className="flex justify-between">
                <span className="theme-text-secondary">Autor:</span>
                <span className="theme-text">Michael Mader</span>
              </div>
              <div className="flex justify-between">
                <span className="theme-text-secondary">Kontakt:</span>
                <a 
                  href="mailto:StreamMatrix@web.de"
                  className="theme-text hover:underline"
                  style={{ color: 'var(--color-accent)' }}
                >
                  StreamMatrix@web.de
                </a>
              </div>
              <div className="flex justify-between">
                <span className="theme-text-secondary">GitHub:</span>
                <a 
                  href="https://github.com/19bounty9317/StreamMatrix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-text hover:underline"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Repository
                </a>
              </div>
              <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="text-xs theme-text-secondary text-center">
                  © 2025 Michael Mader. Alle Rechte vorbehalten.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 flex gap-3" style={{ backgroundColor: 'var(--color-tile-header)', borderTop: '2px solid var(--color-accent)' }}>
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 rounded font-semibold transition-all"
            style={{ backgroundColor: 'var(--color-error)', color: '#FFFFFF' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            🔄 Zurücksetzen
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded font-semibold transition-all"
            style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            ✓ Fertig
          </button>
        </div>
      </div>
    </div>
  );
}
