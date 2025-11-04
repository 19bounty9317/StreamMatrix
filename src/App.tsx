import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import Tutorial from './components/Tutorial';
import Settings from './components/Settings';
import { TwitchService } from './services/TwitchService';
import StreamQualityService from './services/StreamQualityService';
import EventTracker from './services/EventTracker';
import { getTheme, applyTheme } from './styles/themes';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableTiles, setAvailableTiles] = useState(() => {
    const saved = localStorage.getItem('tiles-order');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
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
      { id: 'stream-settings', name: 'Stream-Einstellungen', enabled: false }
    ];
  });

  const [connectionStatus, setConnectionStatus] = useState({
    api: 'connected',
    websocket: 'connected',
    tokenValid: true
  });

  const [streamBitrate, setStreamBitrate] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Update-Listener
  useEffect(() => {
    if (window.electron?.onUpdateAvailable) {
      window.electron.onUpdateAvailable((info) => {
        setUpdateAvailable(true);
        console.log('Update verfügbar:', info.version);
      });
    }
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
    setAvailableTiles(tiles =>
      tiles.map(tile =>
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
      
      {/* Update-Banner */}
      {updateAvailable && (
        <div className="fixed top-0 left-0 right-0 z-50 p-3 text-center text-white font-semibold shadow-lg"
             style={{ backgroundColor: 'var(--color-accent)' }}>
          🎉 Neues Update verfügbar! Wird beim nächsten Start installiert.
          <button 
            onClick={() => setUpdateAvailable(false)}
            className="ml-4 px-3 py-1 rounded bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            ✕
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

export default App;
