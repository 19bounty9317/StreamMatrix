import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';
import StreamSessionTracker from '../../services/StreamSessionTracker';

export default function TileSubs() {
  const [subCount, setSubCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionDiff, setSessionDiff] = useState(0);

  useEffect(() => {
    const loadSubs = async () => {
      try {
        const user = TwitchService.getUserFromStorage();
        if (user) {
          const count = await TwitchService.getSubscriberCount(user.id);
          setSubCount(count);
          
          // Hole Session-Differenz
          const tracker = StreamSessionTracker.getInstance();
          const stats = tracker.getStats();
          if (stats && stats.isLive) {
            setSessionDiff(stats.currentSubs - stats.startSubs);
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Subs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubs();
    
    // Registriere für automatische Aktualisierung
    import('../../services/RefreshService').then(({ default: RefreshService }) => {
      const refreshService = RefreshService.getInstance();
      refreshService.register('tile-subs', loadSubs);
    });

    // Listener für Session-Updates
    const tracker = StreamSessionTracker.getInstance();
    tracker.onStatsUpdate((stats) => {
      if (stats.isLive) {
        setSubCount(stats.currentSubs);
        setSessionDiff(stats.currentSubs - stats.startSubs);
      }
    });

    // Aktualisiere alle 5 Sekunden
    const interval = setInterval(() => {
      const stats = tracker.getStats();
      if (stats && stats.isLive) {
        setSubCount(stats.currentSubs);
        setSessionDiff(stats.currentSubs - stats.startSubs);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      import('../../services/RefreshService').then(({ default: RefreshService }) => {
        const refreshService = RefreshService.getInstance();
        refreshService.unregister('tile-subs');
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
      <div className="text-4xl">⭐</div>
      <div className="flex-1">
        <div className="text-3xl font-bold theme-text">
          {subCount.toLocaleString()}
          {sessionDiff !== 0 && (
            <span className={`ml-2 text-xl ${sessionDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {sessionDiff > 0 ? '+' : ''}{sessionDiff}
            </span>
          )}
        </div>
        <div className="text-sm theme-text-secondary">Subs</div>
      </div>
    </div>
  );
}
