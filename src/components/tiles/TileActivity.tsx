import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

interface Activity {
  id: string;
  type: 'follow' | 'sub' | 'bits' | 'raid' | 'cheer' | 'donation' | 'hypetrain';
  username: string;
  message?: string;
  amount?: number;
  timestamp: Date;
  recipients?: string[]; // Für Gift Sub Recipients
  hypeTrainData?: {
    level: number;
    totalSubs: number;
    totalBits: number;
  };
}

export default function TileActivity() {
  const [activities, setActivities] = useState<Activity[]>(() => {
    // Lade gespeicherte Aktivitäten
    const saved = localStorage.getItem('activity-feed');
    if (saved) {
      const parsed = JSON.parse(saved);
      const activities = parsed.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) }));
      // Sortiere nach Timestamp (neueste zuerst)
      return activities.sort((a: Activity, b: Activity) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    return [];
  });

  // State für Gift Sub Tracking (gruppiert mehrere Subs vom gleichen User)
  const [, setGiftSubTracking] = useState<Map<string, { recipients: string[], timeout: NodeJS.Timeout }>>(new Map());

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
          const updated = [...newActivities, ...prev];
          // Sortiere nach Timestamp (neueste zuerst)
          return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);
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
      // Füge neue Activity hinzu und sortiere nach Timestamp (neueste zuerst)
      const updated = [activity, ...prev];
      return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);
    });
  };

  // Listener für Test-Events
  useEffect(() => {
    const handleTestEvent = (event: CustomEvent) => {
      const data = event.detail;
      console.log('🧪 Test Event empfangen:', data);
      
      const activity: Activity = {
        id: `test-${data.type}-${Date.now()}`,
        type: data.type === 'gift-sub' ? 'sub' : data.type,
        username: data.username,
        message: getTestMessage(data),
        amount: data.amount,
        timestamp: new Date()
      };
      
      addActivity(activity);
    };

    const getTestMessage = (data: any) => {
      switch (data.type) {
        case 'sub':
          return 'hat subscribed!';
        case 'gift-sub':
          return `hat ${data.amount || 1} Sub${(data.amount || 1) > 1 ? 's' : ''} verschenkt!`;
        case 'bits':
          return `hat ${data.amount || 0} Bits gecheert!`;
        case 'follow':
          return 'hat dir gefolgt';
        case 'raid':
          return `raidet mit ${data.amount || 0} Zuschauern!`;
        case 'donation':
          return `hat ${data.amount || 0}€ gespendet!`;
        default:
          return data.message || 'Event';
      }
    };

    window.addEventListener('test-event-trigger' as any, handleTestEvent);

    // Listener für Tile-Reload (beim Verlassen des Test-Modus)
    const handleReload = () => {
      // Entferne alle Test-Activities
      setActivities(prev => prev.filter(a => !a.id.startsWith('test-')));
    };
    window.addEventListener('reload-tiles' as any, handleReload);

    return () => {
      window.removeEventListener('test-event-trigger' as any, handleTestEvent);
      window.removeEventListener('reload-tiles' as any, handleReload);
    };
  }, []);

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

        // Trigger Celebration Event
        const celebrationEvent = new CustomEvent('stream-celebration', {
          detail: {
            type: 'bits',
            username: data.username,
            amount: parseInt(data.bits)
          }
        });
        window.dispatchEvent(celebrationEvent);
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

          // Trigger Celebration Event
          const celebrationEvent = new CustomEvent('stream-celebration', {
            detail: {
              type: 'sub',
              username: data.username
            }
          });
          window.dispatchEvent(celebrationEvent);
        }
        
        // Gift Subs - Gruppiere mehrere Subs vom gleichen User
        if (msgId === 'subgift') {
          console.log('🎁 Gift Sub erkannt von', data.username);
          const recipient = data.tags['msg-param-recipient-display-name'] || 'Jemand';
          
          setGiftSubTracking(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(data.username);
            
            if (existing) {
              // Füge Recipient hinzu und reset Timeout
              clearTimeout(existing.timeout);
              existing.recipients.push(recipient);
              
              // Neuer Timeout: Nach 3 Sekunden ohne neue Subs → Activity erstellen
              existing.timeout = setTimeout(() => {
                const recipients = existing.recipients;
                const count = recipients.length;
                
                if (count >= 5) {
                  // 5+ Subs: Zeige zusammengefasst
                  const activity: Activity = {
                    id: `subgift-${data.username}-${Date.now()}`,
                    type: 'sub',
                    username: data.username,
                    message: `hat ${count} Subs verschenkt!`,
                    amount: count,
                    recipients: recipients,
                    timestamp: new Date()
                  };
                  addActivity(activity);
                } else {
                  // Weniger als 5: Zeige einzeln
                  recipients.forEach(rec => {
                    const activity: Activity = {
                      id: `subgift-${data.username}-${rec}-${Date.now()}`,
                      type: 'sub',
                      username: data.username,
                      message: `hat ${rec} ein Sub geschenkt!`,
                      timestamp: new Date()
                    };
                    addActivity(activity);
                  });
                }
                
                // Entferne aus Tracking
                setGiftSubTracking(m => {
                  const newM = new Map(m);
                  newM.delete(data.username);
                  return newM;
                });
              }, 3000);
              
              newMap.set(data.username, existing);
            } else {
              // Erster Gift Sub von diesem User
              const timeout = setTimeout(() => {
                // Nach 3 Sekunden: Nur 1 Sub → Zeige einzeln
                const activity: Activity = {
                  id: `subgift-${data.username}-${recipient}-${Date.now()}`,
                  type: 'sub',
                  username: data.username,
                  message: `hat ${recipient} ein Sub geschenkt!`,
                  timestamp: new Date()
                };
                addActivity(activity);
                
                setGiftSubTracking(m => {
                  const newM = new Map(m);
                  newM.delete(data.username);
                  return newM;
                });
              }, 3000);
              
              newMap.set(data.username, { recipients: [recipient], timeout });
            }
            
            return newMap;
          });
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

          // Trigger Celebration Event
          const celebrationEvent = new CustomEvent('stream-celebration', {
            detail: {
              type: 'raid',
              username: data.username,
              amount: viewerCount
            }
          });
          window.dispatchEvent(celebrationEvent);
        }
      }
    };

    // Registriere Chat-Listener
    import('../../services/TwitchChatService').then(({ TwitchChatService }) => {
      const chatService = TwitchChatService.getInstance();
      chatService.onMessage(handleChatMessage);
    });
  }, []);

  // Listener für Hype Train Ende
  useEffect(() => {
    const handleHypeTrainEnd = (event: CustomEvent) => {
      const data = event.detail;
      console.log('🚂 Hype Train beendet:', data);
      
      const activity: Activity = {
        id: `hypetrain-${Date.now()}`,
        type: 'hypetrain',
        username: 'Community',
        message: `Hype Train Level ${data.level} beendet!`,
        amount: data.level,
        timestamp: new Date(),
        hypeTrainData: {
          level: data.level,
          totalSubs: data.totalSubs,
          totalBits: data.totalBits
        }
      };
      
      addActivity(activity);
    };

    window.addEventListener('hypetrain-ended' as any, handleHypeTrainEnd);

    return () => {
      window.removeEventListener('hypetrain-ended' as any, handleHypeTrainEnd);
    };
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
      case 'donation': return '💵';
      case 'hypetrain': return '🚂';
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
      case 'donation': return 'text-green-400';
      case 'hypetrain': return 'text-orange-400';
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
            {activity.amount && !activity.hypeTrainData && (
              <p className={`text-sm font-semibold mt-1 ${getColor(activity.type)}`}>
                {activity.type === 'raid' ? `${activity.amount} Zuschauer` : 
                 activity.type === 'bits' ? `${activity.amount} Bits` :
                 activity.type === 'sub' && activity.recipients ? `${activity.amount} Subs` : 
                 `${activity.amount}`}
              </p>
            )}
            {activity.hypeTrainData && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-purple-400">⭐ {activity.hypeTrainData.totalSubs} Subs</span>
                  <span className="text-yellow-400">💎 {activity.hypeTrainData.totalBits} Bits</span>
                </div>
              </div>
            )}
            {activity.recipients && activity.recipients.length > 0 && (
              <div className="mt-2 text-xs theme-text-secondary">
                <div className="font-semibold mb-1">Recipients:</div>
                <div className="flex flex-wrap gap-1">
                  {activity.recipients.map((recipient, idx) => (
                    <span key={idx} className="bg-purple-600/20 px-2 py-0.5 rounded">
                      {recipient}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
