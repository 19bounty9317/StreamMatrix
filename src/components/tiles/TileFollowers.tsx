import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';
import StreamSessionTracker from '../../services/StreamSessionTracker';

export default function TileFollowers() {
  const [followerCount, setFollowerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionDiff, setSessionDiff] = useState(0);

  useEffect(() => {
    const loadFollowers = async () => {
      try {
        const user = TwitchService.getUserFromStorage();
        if (user) {
          const count = await TwitchService.getFollowerCount(user.id);
          setFollowerCount(count);
          
          // Hole Session-Differenz
          const tracker = StreamSessionTracker.getInstance();
          const stats = tracker.getStats();
          if (stats && stats.isLive) {
            setSessionDiff(stats.currentFollowers - stats.startFollowers);
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Follower:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFollowers();
    
    // Registriere für automatische Aktualisierung
    import('../../services/RefreshService').then(({ default: RefreshService }) => {
      const refreshService = RefreshService.getInstance();
      refreshService.register('tile-followers', loadFollowers);
    });

    // Listener für Session-Updates
    const tracker = StreamSessionTracker.getInstance();
    tracker.onStatsUpdate((stats) => {
      if (stats.isLive) {
        setFollowerCount(stats.currentFollowers);
        setSessionDiff(stats.currentFollowers - stats.startFollowers);
      }
    });

    // Listener für Tile-Reload (beim Verlassen des Test-Modus)
    const handleReload = () => {
      setSessionDiff(0);
      loadFollowers();
    };
    window.addEventListener('reload-tiles' as any, handleReload);

    // Aktualisiere alle 5 Sekunden
    const interval = setInterval(() => {
      const stats = tracker.getStats();
      if (stats && stats.isLive) {
        setFollowerCount(stats.currentFollowers);
        setSessionDiff(stats.currentFollowers - stats.startFollowers);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('reload-tiles' as any, handleReload);
      import('../../services/RefreshService').then(({ default: RefreshService }) => {
        const refreshService = RefreshService.getInstance();
        refreshService.unregister('tile-followers');
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-t-transparent rounded-full" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center gap-4">
      <div className="text-4xl">👥</div>
      <div className="flex-1">
        <div className="text-3xl font-bold theme-text">
          {followerCount.toLocaleString()}
          {sessionDiff !== 0 && (
            <span className={`ml-2 text-xl ${sessionDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {sessionDiff > 0 ? '+' : ''}{sessionDiff}
            </span>
          )}
        </div>
        <div className="text-sm theme-text-secondary">Follower</div>
      </div>
    </div>
  );
}
