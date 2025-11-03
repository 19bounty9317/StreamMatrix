import { useState, useEffect, useRef } from 'react';
import { TwitchService } from '../../services/TwitchService';

type PreviewMode = 'twitch' | 'obs';

export default function TileStreamPreview() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(50);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('twitch');
  const [obsConnected, setObsConnected] = useState(false);
  const [obsScreenshot, setObsScreenshot] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const user = TwitchService.getUserFromStorage();
        if (user) {
          setUserInfo(user);
        }
      } catch (error) {
        console.error('Fehler beim Laden der User-Info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // OBS Connection Check
  useEffect(() => {
    console.log('🎥 TileStreamPreview: OBS Connection Check wird initialisiert');
    
    const checkOBSConnection = async () => {
      try {
        const OBSService = (await import('../../services/OBSService')).default;
        const obsService = OBSService.getInstance();
        const connected = obsService.isConnectedToOBS();
        console.log('🎥 OBS Connection Status:', connected);
        setObsConnected(connected);
      } catch (error) {
        console.error('❌ Fehler beim Prüfen der OBS-Verbindung:', error);
      }
    };
    
    // Sofort prüfen
    checkOBSConnection();
    
    // Alle 2 Sekunden prüfen (häufiger für schnellere Updates)
    const interval = setInterval(checkOBSConnection, 2000);
    
    // Event-Listener für OBS-Verbindungsänderungen
    const handleOBSConnected = () => {
      console.log('OBS Connected Event empfangen');
      checkOBSConnection();
    };
    const handleOBSDisconnected = () => {
      console.log('OBS Disconnected Event empfangen');
      setObsConnected(false);
    };
    
    window.addEventListener('obs-connected', handleOBSConnected);
    window.addEventListener('obs-disconnected', handleOBSDisconnected);
    window.addEventListener('storage', checkOBSConnection);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('obs-connected', handleOBSConnected);
      window.removeEventListener('obs-disconnected', handleOBSDisconnected);
      window.removeEventListener('storage', checkOBSConnection);
    };
  }, []);

  // OBS Screenshot Update
  useEffect(() => {
    if (previewMode === 'obs' && obsConnected) {
      const updateScreenshot = async () => {
        try {
          const OBSService = (await import('../../services/OBSService')).default;
          const obsService = OBSService.getInstance();
          const screenshot = await obsService.getSourceScreenshot();
          if (screenshot) {
            setObsScreenshot(screenshot);
          }
        } catch (error) {
          console.error('Fehler beim Laden des OBS-Screenshots:', error);
        }
      };
      
      updateScreenshot();
      const interval = setInterval(updateScreenshot, 1000);
      return () => clearInterval(interval);
    }
  }, [previewMode, obsConnected]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-t-transparent rounded-full" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="h-full flex items-center justify-center theme-text-secondary">
        <div className="text-center">
          <div className="text-4xl mb-2">📺</div>
          <div className="text-sm">Keine Benutzer-Info verfügbar</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setPreviewMode('twitch')}
              className={`px-2 py-1 rounded text-xs transition-all ${previewMode === 'twitch' ? 'theme-text' : 'theme-text-secondary'}`}
              style={{ 
                backgroundColor: previewMode === 'twitch' ? 'var(--color-accent)' : 'var(--color-tile-content)', 
                color: previewMode === 'twitch' ? '#FFFFFF' : 'var(--color-text-secondary)' 
              }}
              title="Twitch Stream (10-20s Verzögerung)"
            >
              📺 Twitch
            </button>
            <button
              onClick={() => setPreviewMode('obs')}
              className={`px-2 py-1 rounded text-xs transition-all ${previewMode === 'obs' ? 'theme-text' : 'theme-text-secondary'}`}
              style={{ 
                backgroundColor: previewMode === 'obs' ? 'var(--color-accent)' : 'var(--color-tile-content)', 
                color: previewMode === 'obs' ? '#FFFFFF' : 'var(--color-text-secondary)',
                opacity: obsConnected ? 1 : 0.5
              }}
              title={obsConnected ? "OBS Live (Keine Verzögerung)" : "OBS nicht verbunden"}
              disabled={!obsConnected}
            >
              🎥 OBS {obsConnected ? '✓' : '✗'}
            </button>
          </div>
          
          {/* Audio Controls (nur für Twitch) */}
          {previewMode === 'twitch' && (
            <>
              <button
                onClick={toggleMute}
                className="theme-button px-2 py-1 rounded text-xs"
                title={isMuted ? 'Ton einschalten' : 'Ton ausschalten'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16"
                title="Lautstärke"
              />
              <span className="theme-text-secondary text-xs">{volume}%</span>
            </>
          )}
        </div>
        <div className="theme-text-secondary text-xs">
          {previewMode === 'twitch' ? 'Twitch (~15s)' : obsConnected ? 'OBS Live' : 'OBS Offline'}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative theme-tile-content-bg rounded overflow-hidden">
        {previewMode === 'twitch' ? (
          // Twitch Embed Player
          <iframe
            ref={iframeRef}
            src={`https://player.twitch.tv/?channel=${userInfo.login}&parent=localhost&muted=${isMuted}&volume=${volume / 100}`}
            height="100%"
            width="100%"
            allowFullScreen
            style={{ border: 'none' }}
            title="Twitch Stream Preview"
          ></iframe>
        ) : obsConnected && obsScreenshot ? (
          // OBS Live Screenshot
          <img
            src={obsScreenshot}
            alt="OBS Live Preview"
            className="w-full h-full object-cover"
            style={{ imageRendering: 'auto' }}
          />
        ) : (
          // OBS Not Connected
          <div className="h-full flex items-center justify-center theme-text-secondary">
            <div className="text-center">
              <div className="text-4xl mb-2">🎥</div>
              <div className="text-sm">OBS nicht verbunden</div>
              <div className="text-xs mt-1">Konfiguriere OBS in den Einstellungen</div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2 text-xs theme-text-secondary text-center">
        {previewMode === 'twitch' 
          ? 'Twitch Stream mit ~10-20 Sekunden Verzögerung'
          : obsConnected 
            ? 'OBS Live-Vorschau ohne Verzögerung (1s Refresh)'
            : 'OBS WebSocket Verbindung erforderlich'
        }
      </div>
    </div>
  );
}
