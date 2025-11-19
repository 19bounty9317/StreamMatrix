import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import Tutorial from './components/Tutorial';
import Settings from './components/Settings';
import EventCelebration from './components/EventCelebration';
import AnalyticsConsent from './components/AnalyticsConsent';
import { TwitchService } from './services/TwitchService';
import StreamQualityService from './services/StreamQualityService';
import EventTracker from './services/EventTracker';
import StreamSessionTracker from './services/StreamSessionTracker';
import AnalyticsService from './services/AnalyticsService';
import { StreamerDirectoryService } from './services/StreamerDirectoryService';
import { getTheme, applyTheme } from './styles/themes';
import WindowManager from './services/WindowManager';

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
    { id: 'channel-points', name: 'Channel Points', enabled: true },
    { id: 'rewards-queue', name: 'Rewards Queue', enabled: true },
    { id: 'hype-train', name: 'Hype Train', enabled: false },
    { id: 'stream-settings', name: 'Stream-Einstellungen', enabled: false },
    { id: 'raid-targets', name: 'Raid-Ziele', enabled: true },
    { id: 'stream-history', name: 'Stream-Historie', enabled: true }
  ];
  
  const [availableTiles, setAvailableTiles] = useState(() => {
    const saved = localStorage.getItem('tiles-order');
    
    if (saved) {
      try {
        const savedTiles = JSON.parse(saved);
        
        // Prüfe ob das Format gültig ist
        if (!Array.isArray(savedTiles) || savedTiles.length === 0) {
          console.warn('⚠️ Ungültiges tiles-order Format, verwende Defaults');
          return defaultTiles;
        }
        
        // Prüfe ob alle Tiles das richtige Format haben
        const hasValidFormat = savedTiles.every((t: any) => 
          t && typeof t === 'object' && 'id' in t && 'enabled' in t
        );
        
        if (!hasValidFormat) {
          console.warn('⚠️ Tiles haben ungültiges Format, verwende Defaults');
          return defaultTiles;
        }
        
        const defaultTilesMap = new Map(defaultTiles.map(t => [t.id, t]));
        const savedIds = new Set(savedTiles.map((t: any) => t.id));
        
        // 1. Aktualisiere bestehende Kacheln (Namen könnten sich geändert haben)
        // und behalte die enabled-Einstellung des Users
        const updatedTiles = savedTiles
          .filter((t: any) => defaultTilesMap.has(t.id)) // Entferne gelöschte Kacheln
          .map((t: any) => {
            const defaultTile = defaultTilesMap.get(t.id)!; // ! weil wir oben geprüft haben dass es existiert
            return {
              id: defaultTile.id,
              name: defaultTile.name, // Aktualisierter Name
              enabled: t.enabled !== undefined ? t.enabled : defaultTile.enabled // User-Einstellung beibehalten
            };
          });
        
        // 2. Finde neue Kacheln, die im Code hinzugefügt wurden
        const newTiles = defaultTiles.filter(dt => !savedIds.has(dt.id));
        
        // 3. Merge: Bestehende Kacheln + neue Kacheln
        const mergedTiles = [...updatedTiles, ...newTiles];
        
        // 4. Prüfe ob wir genug Kacheln haben (mindestens 5)
        const enabledCount = mergedTiles.filter(t => t.enabled).length;
        if (enabledCount < 3) {
          console.warn('⚠️ Zu wenige aktivierte Kacheln gefunden, aktiviere Standard-Kacheln');
          // Aktiviere die wichtigsten Kacheln
          mergedTiles.forEach(t => {
            if (['chat', 'activity', 'stream-info', 'followers', 'alerts'].includes(t.id)) {
              t.enabled = true;
            }
          });
        }
        
        // 5. Speichere nur wenn sich etwas geändert hat
        const hasChanges = newTiles.length > 0 || updatedTiles.length !== savedTiles.length || enabledCount < 3;
        if (hasChanges) {
          console.log('🔄 Kachel-Migration durchgeführt:');
          console.log('  📊 Gespeicherte Kacheln:', savedTiles.length);
          console.log('  ✅ Gültige Kacheln:', updatedTiles.length);
          if (newTiles.length > 0) {
            console.log('  🆕 Neue Kacheln:', newTiles.map(t => t.name).join(', '));
          }
          if (updatedTiles.length !== savedTiles.length) {
            console.log('  🗑️ Entfernte Kacheln:', savedTiles.length - updatedTiles.length);
          }
          console.log('  🎯 Aktivierte Kacheln:', mergedTiles.filter(t => t.enabled).length);
          localStorage.setItem('tiles-order', JSON.stringify(mergedTiles));
        }
        
        return mergedTiles;
      } catch (error) {
        console.error('❌ Fehler beim Laden der Kacheln:', error);
        console.log('🔄 Verwende Default-Kacheln');
        return defaultTiles;
      }
    }
    
    // Kein gespeichertes Layout gefunden - erste Installation oder v1.3.8 Migration
    console.log('🆕 Keine gespeicherten Kacheln gefunden, verwende Defaults');
    // Speichere die Defaults im localStorage für zukünftige Verwendung
    localStorage.setItem('tiles-order', JSON.stringify(defaultTiles));
    console.log('💾 Default-Kacheln im localStorage gespeichert');
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
  const [visibleTiles, setVisibleTiles] = useState<typeof defaultTiles>(() => {
    // Initial alle aktivierten Kacheln anzeigen
    return availableTiles.filter(t => t.enabled);
  });

  // Update-Listener
  useEffect(() => {
    if (window.electron?.onUpdateAvailable) {
      window.electron.onUpdateAvailable((info) => {
        // Prüfe ob User bereits "Später" geklickt hat
        const dismissedPopup = localStorage.getItem('dismissed-update-popup');
        if (dismissedPopup !== info.version) {
          // Nur wenn noch nicht dismissed, zeige Popup
          setUpdateAvailable(true);
          console.log('Update verfügbar:', info.version);
        } else {
          console.log('Update-Popup für v' + info.version + ' wurde bereits dismissed - nur Banner wird angezeigt');
        }
      });
    }

    // Menü-Event-Listener
    if (window.electron?.onOpenSettings) {
      window.electron.onOpenSettings(() => {
        setShowSettings(true);
      });
    }

    if (window.electron?.onShowTutorial) {
      window.electron.onShowTutorial(() => {
        const event = new CustomEvent('show-tutorial');
        window.dispatchEvent(event);
      });
    }
  }, []);

  // Cleanup: Entferne Test-Daten beim Start (einmalig)
  useEffect(() => {
    const cleanupDone = localStorage.getItem('cleanup-v1.4.4-done');
    if (!cleanupDone) {
      console.log('🧹 Cleanup: Entferne alte Test-Daten...');
      
      // Deaktiviere Test-Modus falls aktiv
      localStorage.removeItem('test-mode-active');
      
      // Bereinige Stream-Historie: Behalte nur echte Streams (mit Dauer > 5 Minuten)
      const history = localStorage.getItem('stream-history');
      if (history) {
        try {
          const sessions = JSON.parse(history);
          // Filtere Test-Daten: Behalte nur Sessions mit realistischer Dauer (> 5 Min)
          // und nicht zu viele Sessions am gleichen Tag
          const filtered = sessions.filter((s: any) => {
            return s.duration > 5; // Mindestens 5 Minuten
          });
          
          // Entferne Duplikate vom gleichen Tag (behalte nur die längste Session)
          const uniqueByDate = filtered.reduce((acc: any[], curr: any) => {
            const existing = acc.find(s => s.date === curr.date);
            if (!existing) {
              acc.push(curr);
            } else if (curr.duration > existing.duration) {
              // Ersetze mit längerer Session
              const index = acc.indexOf(existing);
              acc[index] = curr;
            }
            return acc;
          }, []);
          
          localStorage.setItem('stream-history', JSON.stringify(uniqueByDate));
          console.log(`🧹 Stream-Historie bereinigt: ${sessions.length} → ${uniqueByDate.length} Sessions`);
        } catch (e) {
          console.error('Fehler beim Bereinigen der Historie:', e);
        }
      }
      
      localStorage.setItem('cleanup-v1.4.4-done', 'true');
      console.log('✅ Cleanup abgeschlossen');
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

  // Filtere Kacheln basierend auf Fenster-Zuordnung
  useEffect(() => {
    const updateVisibleTiles = () => {
      const manager = WindowManager.getInstance();
      const enabledTiles = availableTiles.filter(t => t.enabled);
      const allTileIds = enabledTiles.map(t => t.id);
      const mainTileIds = manager.getMainWindowTiles(allTileIds);
      const visible = enabledTiles.filter(t => mainTileIds.includes(t.id));
      setVisibleTiles(visible);
    };

    updateVisibleTiles();

    // Aktualisiere bei Änderungen
    const manager = WindowManager.getInstance();
    const unsubscribe = manager.onConfigChange(updateVisibleTiles);

    return () => {
      unsubscribe();
    };
  }, [availableTiles]);

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

              // Prüfe Ban-Status BEVOR Analytics gestartet wird
              const analyticsService = AnalyticsService.getInstance();
              analyticsService.checkBanStatus().then(isBanned => {
                if (!isBanned && !analyticsService.needsConsent()) {
                  // Nur starten wenn nicht gebannt
                  analyticsService.startHeartbeat();
                }
              });

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

              // Initialisiere Streamer Directory Service
              const streamerDirectoryService = StreamerDirectoryService.getInstance();
              streamerDirectoryService.initialize();
              console.log('✅ Streamer Directory Service initialisiert');
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
        // Prüfe SOFORT ob User gebannt ist
        const analyticsService = AnalyticsService.getInstance();
        const isBanned = await analyticsService.checkBanStatus();
        
        if (isBanned) {
          // User ist gebannt - Login abbrechen
          TwitchService.clearToken();
          return; // handleBan() macht bereits Logout
        }
        
        // User ist nicht gebannt - initialisiere Services
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
      <AnalyticsConsent />
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
          tiles={visibleTiles} 
          onCloseTile={toggleTile}
        />
        <Footer status={connectionStatus} />
      </div>
    </div>
  );
}

export default App;
