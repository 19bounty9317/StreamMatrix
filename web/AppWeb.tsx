import { useState, useEffect } from 'react';
import Sidebar from '../src/components/Sidebar';
import Dashboard from '../src/components/Dashboard';
import Footer from '../src/components/Footer';
import LoginScreenWeb from './components/LoginScreenWeb';
import Tutorial from '../src/components/Tutorial';
import SettingsWeb from './components/SettingsWeb';
import EventCelebration from '../src/components/EventCelebration';
import { TwitchService } from '../src/services/TwitchService';
import StreamQualityService from '../src/services/StreamQualityService';
import EventTracker from '../src/services/EventTracker';
import StreamSessionTracker from '../src/services/StreamSessionTracker';
import { getTheme, applyTheme } from '../src/styles/themes';

function AppWeb() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
    { id: 'raid-targets', name: 'Raid-Ziele', enabled: true },
    { id: 'stream-history', name: 'Stream-Historie', enabled: true }
  ];
  
  const [availableTiles, setAvailableTiles] = useState(() => {
    const saved = localStorage.getItem('tiles-order-web');
    if (saved) {
      try {
        const savedTiles = JSON.parse(saved);
        if (!Array.isArray(savedTiles) || savedTiles.length === 0) {
          return defaultTiles;
        }
        
        const defaultTilesMap = new Map(defaultTiles.map(t => [t.id, t]));
        const savedIds = new Set(savedTiles.map((t: any) => t.id));
        
        const updatedTiles = savedTiles
          .filter((t: any) => defaultTilesMap.has(t.id))
          .map((t: any) => {
            const defaultTile = defaultTilesMap.get(t.id)!;
            return {
              id: defaultTile.id,
              name: defaultTile.name,
              enabled: t.enabled !== undefined ? t.enabled : defaultTile.enabled
            };
          });
        
        const newTiles = defaultTiles.filter(dt => !savedIds.has(dt.id));
        const mergedTiles = [...updatedTiles, ...newTiles];
        
        const enabledCount = mergedTiles.filter(t => t.enabled).length;
        if (enabledCount < 3) {
          mergedTiles.forEach(t => {
            if (['chat', 'activity', 'stream-info', 'followers', 'alerts'].includes(t.id)) {
              t.enabled = true;
            }
          });
        }
        
        if (newTiles.length > 0 || updatedTiles.length !== savedTiles.length || enabledCount < 3) {
          localStorage.setItem('tiles-order-web', JSON.stringify(mergedTiles));
        }
        
        return mergedTiles;
      } catch (error) {
        console.error('Fehler beim Laden der Kacheln:', error);
        return defaultTiles;
      }
    }
    
    localStorage.setItem('tiles-order-web', JSON.stringify(defaultTiles));
    return defaultTiles;
  });

  const [connectionStatus, setConnectionStatus] = useState({
    api: 'connected',
    websocket: 'connected',
    tokenValid: true
  });

  const [streamBitrate, setStreamBitrate] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [testModeActive, setTestModeActive] = useState(() => {
    return localStorage.getItem('test-mode-active') === 'true';
  });

  useEffect(() => {
    const cleanupDone = localStorage.getItem('cleanup-web-done');
    if (!cleanupDone) {
      localStorage.removeItem('test-mode-active');
      
      const history = localStorage.getItem('stream-history');
      if (history) {
        try {
          const sessions = JSON.parse(history);
          const filtered = sessions.filter((s: any) => s.duration > 5);
          
          const uniqueByDate = filtered.reduce((acc: any[], curr: any) => {
            const existing = acc.find(s => s.date === curr.date);
            if (!existing) {
              acc.push(curr);
            } else if (curr.duration > existing.duration) {
              const index = acc.indexOf(existing);
              acc[index] = curr;
            }
            return acc;
          }, []);
          
          localStorage.setItem('stream-history', JSON.stringify(uniqueByDate));
        } catch (e) {
          console.error('Fehler beim Bereinigen der Historie:', e);
        }
      }
      
      localStorage.setItem('cleanup-web-done', 'true');
    }
  }, []);

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
      TwitchService.validateToken().then(isValid => {
        if (isValid) {
          setIsAuthenticated(true);
          TwitchService.getUserInfo().then(userInfo => {
            if (userInfo) {
              const qualityService = StreamQualityService.getInstance();
              qualityService.initialize(
                TwitchService.getStoredToken() || '',
                TwitchService.getClientId(),
                userInfo.id
              );
              
              qualityService.startMonitoring((quality) => {
                setStreamBitrate(quality.bitrate);
              });

              const eventTracker = EventTracker.getInstance();
              eventTracker.startTracking(userInfo.id);

              TwitchService.getStreamInfo(userInfo.id).then(streamInfo => {
                const sessionTracker = StreamSessionTracker.getInstance();
                if (streamInfo) {
                  const existingStats = sessionTracker.getStats();
                  if (!existingStats || !existingStats.isLive) {
                    sessionTracker.startSession(userInfo.id);
                  } else {
                    sessionTracker.updateCurrentStats(userInfo.id);
                  }
                } else {
                  sessionTracker.endSession();
                }
              });
            }
          }).catch(console.error);
        } else {
          TwitchService.clearToken();
          setConnectionStatus(prev => ({ ...prev, tokenValid: false }));
        }
      });
    }

    return () => {
      StreamQualityService.getInstance().stopMonitoring();
      EventTracker.getInstance().stopTracking();
    };
  }, []);

  const handleLogin = async (token: string) => {
    TwitchService.setToken(token);
    
    try {
      const userInfo = await TwitchService.getUserInfo();
      if (userInfo) {
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
    localStorage.setItem('tiles-order-web', JSON.stringify(newTiles));
  };

  useEffect(() => {
    const settings = localStorage.getItem('app-settings');
    let themeId = 'twitch-dark';
    
    if (settings) {
      const parsed = JSON.parse(settings);
      themeId = parsed.themeId || 'twitch-dark';
    }
    
    const theme = getTheme(themeId);
    applyTheme(theme);
  }, []);

  if (!isAuthenticated) {
    return <LoginScreenWeb onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Tutorial />
      <SettingsWeb isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <EventCelebration />
      
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
          tiles={availableTiles.filter(t => t.enabled)} 
          onCloseTile={toggleTile}
        />
        <Footer status={connectionStatus} />
      </div>
    </div>
  );
}

export default AppWeb;
