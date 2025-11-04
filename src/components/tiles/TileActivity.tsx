import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

interface Activity {
  id: string;
  type: 'follow' | 'sub' | 'bits' | 'raid' | 'cheer';
  username: string;
  message?: string;
  amount?: number;
  timestamp: Date;
}

export default function TileActivity() {
  const [activities, setActivities] = useState<Activity[]>(() => {
    // Lade gespeicherte Aktivitäten
    const saved = localStorage.getItem('activity-feed');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) }));
    }
    return [];
  });

  // Speichere Aktivitäten
  useEffect(() => {
    localStorage.setItem('activity-feed', JSON.stringify(activities));
  }, [activities]);

  // Lade initiale Follower und starte Event-Tracking
  useEffect(() => {
    loadRecentFollowers();
    
    // Starte Event-Tracking
    const user = TwitchService.getUserFromStorage();
    if (user) {
      import('../../services/EventTracker').then(({ default: EventTracker }) => {
        const tracker = EventTracker.getInstance();
        tracker.startTracking(user.id);
      });
    }
    
    // Polling für neue Follower alle 30 Sekunden
    const followerInterval = setInterval(loadRecentFollowers, 30000);
    
    return () => {
      clearInterval(followerInterval);
    };
  }, []);

  const loadRecentFollowers = async () => {
    try {
      const user = TwitchService.getUserFromStorage();
      if (user) {
        const followers = await TwitchService.getRecentFollowers(user.id, 5);
        const followerActivities: Activity[] = followers.map((f: any) => ({
          id: `follow-${f.user_id}-${f.followed_at}`,
          type: 'follow' as const,
          username: f.user_name,
          message: 'hat dir gefolgt',
          timestamp: new Date(f.followed_at)
        }));
        
        // Füge nur neue hinzu
        setActivities(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const newActivities = followerActivities.filter(a => !existingIds.has(a.id));
          return [...newActivities, ...prev].slice(0, 50); // Max 50 Aktivitäten
        });
      }
    } catch (error) {
      console.error('Fehler beim Laden der Follower:', error);
    }
  };

  const addActivity = (activity: Activity) => {
    setActivities(prev => {
      // Verhindere Duplikate
      if (prev.some(a => a.id === activity.id)) {
        return prev;
      }
      return [activity, ...prev].slice(0, 50);
    });
  };

  // Listener für Chat-Events (Bits, Subs, Raids)
  useEffect(() => {
    const handleChatMessage = (data: any) => {
      console.log('🎯 Activity Feed - Message empfangen:', data);
      console.log('🎯 Tags:', data.tags);
      console.log('🎯 msg-id:', data.tags?.['msg-id']);
      
      // Bits/Cheers (aus normalen PRIVMSG)
      if (data.bits && parseInt(data.bits) > 0) {
        console.log('💎 Bits erkannt:', data.bits);
        const activity: Activity = {
          id: `bits-${data.username}-${Date.now()}`,
          type: 'bits',
          username: data.username,
          message: `hat ${data.bits} Bits gecheert!`,
          amount: parseInt(data.bits),
          timestamp: new Date()
        };
        addActivity(activity);
      }

      // USERNOTICE Events (Subs, Raids, etc.)
      if (data.tags && data.tags['msg-id']) {
        const msgId = data.tags['msg-id'];
        console.log('📋 USERNOTICE msg-id erkannt:', msgId);
        
        // Subs & Resubs
        if (msgId === 'sub' || msgId === 'resub') {
          console.log('⭐ Sub erkannt:', msgId, 'von', data.username);
          const months = data.tags['msg-param-cumulative-months'] || '1';
          const activity: Activity = {
            id: `sub-${data.username}-${Date.now()}`,
            type: 'sub',
            username: data.username,
            message: msgId === 'resub' 
              ? `hat für ${months} Monat(e) resubscribed!` 
              : 'hat subscribed!',
            timestamp: new Date()
          };
          addActivity(activity);
        }
        
        // Gift Subs
        if (msgId === 'subgift') {
          console.log('🎁 Gift Sub erkannt von', data.username);
          const recipient = data.tags['msg-param-recipient-display-name'] || 'Jemand';
          const activity: Activity = {
            id: `subgift-${data.username}-${Date.now()}`,
            type: 'sub',
            username: data.username,
            message: `hat ${recipient} ein Sub geschenkt!`,
            timestamp: new Date()
          };
          addActivity(activity);
        }

        // Mystery Gift Subs (Masse)
        if (msgId === 'submysterygift') {
          console.log('🎁 Mystery Gift Subs erkannt von', data.username);
          const count = data.tags['msg-param-mass-gift-count'] || '1';
          const activity: Activity = {
            id: `mysterygift-${data.username}-${Date.now()}`,
            type: 'sub',
            username: data.username,
            message: `hat ${count} Subs verschenkt!`,
            amount: parseInt(count),
            timestamp: new Date()
          };
          addActivity(activity);
        }

        // Raids
        if (msgId === 'raid') {
          console.log('🚀 Raid erkannt von', data.username);
          const viewerCount = parseInt(data.tags['msg-param-viewerCount'] || '0');
          const activity: Activity = {
            id: `raid-${data.username}-${Date.now()}`,
            type: 'raid',
            username: data.username,
            message: 'hat geraidet!',
            amount: viewerCount,
            timestamp: new Date()
          };
          addActivity(activity);
        }
      }
    };

    // Registriere Chat-Listener
    import('../../services/TwitchChatService').then(({ TwitchChatService }) => {
      const chatService = TwitchChatService.getInstance();
      chatService.onMessage(handleChatMessage);
    });
  }, []);

  const clearActivities = () => {
    setActivities([]);
    localStorage.removeItem('activity-feed');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'follow': return '👤';
      case 'sub': return '⭐';
      case 'bits': return '💎';
      case 'cheer': return '💎';
      case 'raid': return '🚀';
      default: return '📢';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'follow': return 'text-blue-400';
      case 'sub': return 'text-purple-400';
      case 'bits': return 'text-yellow-400';
      case 'cheer': return 'text-yellow-400';
      case 'raid': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Gerade eben';
    if (minutes < 60) return `vor ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `vor ${hours}h`;
    return date.toLocaleDateString('de-DE');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-twitch-lightgray">
        <span className="text-xs text-gray-400">{activities.length} Aktivitäten</span>
        {activities.length > 0 && (
          <button
            onClick={clearActivities}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Löschen
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2">
      {activities.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <div className="text-4xl mb-2">📢</div>
          <div className="text-sm theme-text">Warte auf Aktivitäten...</div>
          <div className="text-xs mt-2 theme-text-secondary">Follower, Subs, Bits werden hier angezeigt</div>
        </div>
      )}
      {activities.map(activity => (
        <div key={activity.id} className="flex items-start gap-3 p-3 theme-tile-content-bg rounded border theme-border transition-colors" style={{ borderColor: 'var(--color-border)' }}>
          <span className={`text-2xl ${getColor(activity.type)}`}>{getIcon(activity.type)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="theme-text font-semibold truncate">{activity.username}</p>
              <span className="text-xs theme-text-secondary flex-shrink-0">{formatTime(activity.timestamp)}</span>
            </div>
            <p className="theme-text-secondary text-sm">{activity.message}</p>
            {activity.amount && (
              <p className={`text-sm font-semibold mt-1 ${getColor(activity.type)}`}>
                {activity.type === 'raid' ? `${activity.amount} Zuschauer` : `${activity.amount} Bits`}
              </p>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
