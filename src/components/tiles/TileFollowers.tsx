import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

export default function TileFollowers() {
  const [followerCount, setFollowerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFollowers = async () => {
      try {
        const user = TwitchService.getUserFromStorage();
        if (user) {
          const count = await TwitchService.getFollowerCount(user.id);
          setFollowerCount(count);
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

    return () => {
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
        <div className="text-3xl font-bold theme-text">{followerCount.toLocaleString()}</div>
        <div className="text-sm theme-text-secondary">Follower</div>
      </div>
    </div>
  );
}
