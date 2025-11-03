import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

export default function TileStreamInfo() {
  const [streamInfo, setStreamInfo] = useState<any>(null);
  const [channelInfo, setChannelInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uptime, setUptime] = useState('');
  const [streamQuality, setStreamQuality] = useState<any>(null);

  useEffect(() => {
    const loadStreamInfo = async () => {
      try {
        const user = TwitchService.getUserFromStorage();
        if (user) {
          const [stream, channel] = await Promise.all([
            TwitchService.getStreamInfo(user.id),
            TwitchService.getChannelInfo(user.id)
          ]);
          setStreamInfo(stream);
          setChannelInfo(channel);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Stream-Info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStreamInfo();
    
    // Registriere für automatische Aktualisierung
    import('../../services/RefreshService').then(({ default: RefreshService }) => {
      const refreshService = RefreshService.getInstance();
      refreshService.register('tile-stream-info', loadStreamInfo);
    });

    return () => {
      import('../../services/RefreshService').then(({ default: RefreshService }) => {
        const refreshService = RefreshService.getInstance();
        refreshService.unregister('tile-stream-info');
      });
    };
  }, []);

  // Berechne Uptime
  useEffect(() => {
    if (!streamInfo?.started_at) return;

    const updateUptime = () => {
      const start = new Date(streamInfo.started_at);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setUptime(`${hours}h ${minutes}m`);
    };

    updateUptime();
    const interval = setInterval(updateUptime, 60000);
    return () => clearInterval(interval);
  }, [streamInfo]);

  // Lade Stream-Qualitätsdaten (Bitrate, Dropped Frames)
  useEffect(() => {
    if (!streamInfo) return;

    const loadQuality = async () => {
      try {
        const StreamQualityService = (await import('../../services/StreamQualityService')).default;
        const qualityService = StreamQualityService.getInstance();
        
        // Hole aktuelle Qualitätsdaten
        const quality = qualityService.getCurrentQuality();
        setStreamQuality(quality);
      } catch (error) {
        console.error('Fehler beim Laden der Stream-Qualität:', error);
      }
    };

    loadQuality();
    const interval = setInterval(loadQuality, 5000); // Alle 5 Sekunden aktualisieren
    return () => clearInterval(interval);
  }, [streamInfo]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-t-transparent rounded-full" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  const isLive = !!streamInfo;

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="theme-text-secondary">Status:</span>
        <span className={`font-semibold flex items-center gap-2 ${isLive ? 'text-green-400' : 'theme-text-secondary'}`}>
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
          {isLive ? 'Live' : 'Offline'}
        </span>
      </div>
      
      {isLive && (
        <>
          <div className="flex items-center justify-between">
            <span className="theme-text-secondary">Zuschauer:</span>
            <span className="theme-text font-bold text-xl">{streamInfo.viewer_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="theme-text-secondary">Uptime:</span>
            <span className="theme-text font-semibold">{uptime}</span>
          </div>
          
        </>
      )}
      
      {/* Bitrate und Frames - Immer anzeigen wenn Daten vorhanden */}
      {streamQuality && streamQuality.bitrate > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="theme-text-secondary">Bitrate:</span>
            <span className={`font-semibold ${
              streamQuality.bitrate >= 4000000 ? 'text-green-400' : 
              streamQuality.bitrate >= 2500000 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {(streamQuality.bitrate / 1000).toFixed(1)} Kbps
            </span>
          </div>
          
          {/* Dropped Frames Anzeige */}
          <div className="flex items-center justify-between">
            <span className="theme-text-secondary">Dropped Frames:</span>
            <span className={`font-semibold ${
              streamQuality.droppedFrames === 0 ? 'text-green-400' : 
              streamQuality.droppedFrames < 100 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {streamQuality.droppedFrames} ({streamQuality.droppedFramesPercent?.toFixed(2) || '0.00'}%)
            </span>
          </div>
        </>
      )}
      

      
      <div className="flex items-center justify-between">
        <span className="theme-text-secondary">Kategorie:</span>
        <span className="theme-text text-sm">{channelInfo?.game_name || 'Keine'}</span>
      </div>
      
      {channelInfo?.title && (
        <div className="pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
          <span className="theme-text-secondary text-xs block mb-1">Titel:</span>
          <span className="theme-text text-sm">{channelInfo.title}</span>
        </div>
      )}
    </div>
  );
}
