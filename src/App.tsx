import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import Tutorial from './components/Tutorial';
import Settings from './components/Settings';
import EventCelebration from './components/EventCelebration';
import { TwitchService } from './services/TwitchService';
import StreamQualityService from './services/StreamQualityService';
import EventTracker from './services/EventTracker';
import StreamSessionTracker from './services/StreamSessionTracker';
import { getTheme, applyTheme } from './styles/themes';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Definiere alle verfügbaren Kacheln mit Defaults
  const defaultTiles = [
    { id: 'chat', name: 'Chat', enabled: true },
    { id: 'activity', name: 'Aktivitätsfeed', enabled: true },
    { id: 'stream-info', name: 'Stream-Info', enabled: true },
    { id: 'stream-preview', name: 'Stream-Vorschau', enabled: true },
    { id: 'followers', name: 'Follower', enabled: true },
    { id: 'alerts', name: 'Alerts & Benachrichtigungen', enabled: true },
    { id: 'viewer-stats', name: 'Viewer-Statistiken', enabled: true },
    { id: 'quick-actions', name: 'Quick Actions', enabled: true },
    { id: 'viewer-list', name: 'Live Viewer', enabled: true },
    { id: 'subs', name: 'Abonnenten', enabled: false },
    { id: 'bits', name: 'Einnahmen-Übersicht', enabled: true },
    { id: 'channel-points', name: 'Rewards Queue', enabled: false },
    { id: 'hype-train', name: 'Hype Train', enabled: false },
    { id: 'stream-settings', name: 'Stream-Einstellungen', enabled: false },
    { id: 'raid-targets', name: 'Raid-Ziele', enabled: true }
  ];
  
  const [availableTiles, setAvailableTiles] = useState(() => {
    const saved = localStorage.getItem('tiles-order');
    
    if (saved) {
      const savedTiles = JSON.parse(saved);
      const savedIds = new Set(savedTiles.map((t: any) => t.id));
      
      // Finde neue Kacheln, die im Code hinzugefügt wurden
      const newTiles = defaultTiles.filter(dt => !savedIds.has(dt.id));
      
      if (newTiles.length > 0) {
        console.log('🆕 Neue Kacheln gefunden:', newTiles.map(t => t.name).join(', '));
        // Füge neue Kacheln am Ende hinzu
        const mergedTiles = [...savedTiles, ...newTiles];
        localStorage.setItem('tiles-order', JSON.stringify(mergedTiles));
        return mergedTiles;
      }
      
      return savedTiles;
    }
    
    return defaultTiles;
  });

  const [connectionStatus, setConnectionStatus] = useState({
    api: 'connected',
    websocket: 'connected',
    tokenValid: true
  });

  const [streamBitrate, setStreamBitrate] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [testModeActive, setTestModeActive] = useState(() => {
    return localStorage.getItem('test-mode-active') === 'true';
  });

  // Update-Listener
  useEffect(() => {
    if (window.electron?.onUpdateAvailable) {
      window.electron.onUpdateAvailable((info) => {
        // Prüfe ob Update bereits abgelehnt wurde
        const dismissedUpdate = localStorage.getItem('dismissed-update-version');
        if (dismissedUpdate !== info.version) {
          setUpdateAvailable(true);
          console.log('Update verfügbar:', info.version);
        }
      });
    }
  }, []);

  // Test-Mode Listener
  useEffect(() => {
    const handleTestModeChange = (event: CustomEvent<boolean>) => {
      setTestModeActive(event.detail);
    };

    window.addEventListener('test-mode-change' as any, handleTestModeChange);

    return () => {
      window.removeEventListener('test-mode-change' as any, handleTestModeChange);
    };
  }, []);

  useEffect(() => {
    const token = TwitchService.getStoredToken();
    if (token) {
      // Validiere Token beim Start
      TwitchService.validateToken().then(isValid => {
        if (isValid) {
          setIsAuthenticated(true);
          // Lade Benutzerdaten und initialisiere Stream Quality Service
          TwitchService.getUserInfo().then(userInfo => {
            if (userInfo) {
              const qualityService = StreamQualityService.getInstance();
              qualityService.initialize(
                TwitchService.getStoredToken() || '',
                TwitchService.getClientId(),
                userInfo.id
              );
              
              // Starte Monitoring
              qualityService.startMonitoring((quality) => {
                setStreamBitrate(quality.bitrate);
              });

              // Starte Event-Tracking für Notifications
              const eventTracker = EventTracker.getInstance();
              eventTracker.startTracking(userInfo.id);

              // Prüfe ob Stream live ist und starte Session-Tracking
              TwitchService.getStreamInfo(userInfo.id).then(streamInfo => {
                const sessionTracker = StreamSessionTracker.getInstance();
                if (streamInfo) {
                  // Stream ist live - starte oder aktualisiere Session
                  const existingStats = sessionTracker.getStats();
                  if (!existingStats || !existingStats.isLive) {
                    sessionTracker.startSession(userInfo.id);
                  } else {
                    sessionTracker.updateCurrentStats(userInfo.id);
                  }
                } else {
                  // Stream ist offline - beende Session
                  sessionTracker.endSession();
                }
              });
            }
          }).catch(console.error);
        } else {
          // Token ungültig, logout
          TwitchService.clearToken();
          setConnectionStatus(prev => ({ ...prev, tokenValid: false }));
        }
      });
    }

    return () => {
      // Cleanup: Stoppe Monitoring beim Unmount
      StreamQualityService.getInstance().stopMonitoring();
      EventTracker.getInstance().stopTracking();
    };
  }, []);

  const handleLogin = async (token: string) => {
    TwitchService.setToken(token);
    
    // Lade User-Info sofort nach Login
    try {
      const userInfo = await TwitchService.getUserInfo();
      if (userInfo) {
        // Initialisiere Services
        const qualityService = StreamQualityService.getInstance();
        qualityService.initialize(
          token,
          TwitchService.getClientId(),
          userInfo.id
        );
        
        qualityService.startMonitoring((quality) => {
          setStreamBitrate(quality.bitrate);
        });

        const eventTracker = EventTracker.getInstance();
        eventTracker.startTracking(userInfo.id);
      }
    } catch (error) {
      console.error('Fehler beim Laden der User-Info:', error);
    }
    
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    TwitchService.clearToken();
    setIsAuthenticated(false);
  };

  const toggleTile = (tileId: string) => {
    setAvailableTiles((tiles: typeof defaultTiles) =>
      tiles.map((tile: typeof defaultTiles[0]) =>
        tile.id === tileId ? { ...tile, enabled: !tile.enabled } : tile
      )
    );
  };

  const reorderTiles = (newTiles: typeof availableTiles) => {
    setAvailableTiles(newTiles);
    localStorage.setItem('tiles-order', JSON.stringify(newTiles));
  };

  // Lade Theme beim Start
  useEffect(() => {
    const settings = localStorage.getItem('app-settings');
    let themeId = 'twitch-dark'; // Default
    
    if (settings) {
      const parsed = JSON.parse(settings);
      themeId = parsed.themeId || 'twitch-dark';
    }
    
    const theme = getTheme(themeId);
    applyTheme(theme);
    console.log('Theme loaded:', themeId, theme);
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Tutorial />
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <EventCelebration />
      
      {/* Update-Banner - wird nicht mehr oben angezeigt, nur im Footer */}

      {/* Test-Mode Banner */}
      {testModeActive && (
        <div className="fixed top-0 left-0 right-0 z-50 p-3 text-center bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg animate-pulse">
          ⚠️ TEST-MODUS AKTIV - Events werden simuliert
          <button 
            onClick={() => {
              localStorage.setItem('test-mode-active', 'false');
              setTestModeActive(false);
              const event = new CustomEvent('test-mode-change', { detail: false });
              window.dispatchEvent(event);
            }}
            className="ml-4 px-3 py-1 rounded bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            Test-Modus beenden
          </button>
        </div>
      )}

      <Sidebar
        tiles={availableTiles}
        onToggleTile={toggleTile}
        onReorderTiles={reorderTiles}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <Dashboard 
          tiles={availableTiles.filter((t: typeof defaultTiles[0]) => t.enabled)} 
          onCloseTile={toggleTile}
        />
        <Footer status={connectionStatus} />
      </div>
    </div>
  );
}

export default App;
