import { useState, useEffect } from 'react';
import { TwitchChatService } from '../../services/TwitchChatService';

interface Viewer {
  username: string;
  displayName: string;
  isMod: boolean;
  isVip: boolean;
  isSubscriber: boolean;
  lastSeen: Date;
  lastMessage?: Date; // Letzte Chat-Nachricht (für "Aktiv" Filter)
}

export default function TileViewerList() {
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [filter, setFilter] = useState<'all' | 'mods' | 'vips' | 'subs'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(() => {
    const saved = localStorage.getItem('viewer-list-show-only-active');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const chatService = TwitchChatService.getInstance();
    
    // Tracke Viewer aus Chat-Nachrichten
    const trackViewer = (username: string, tags: any) => {
      setViewers(prev => {
        const existing = prev.find(v => v.username === username);
        const now = new Date();
        
        const viewer: Viewer = {
          username,
          displayName: tags['display-name'] || username,
          isMod: tags.mod === '1' || tags.badges?.includes('moderator'),
          isVip: tags.badges?.includes('vip') || false,
          isSubscriber: tags.subscriber === '1' || tags.badges?.includes('subscriber'),
          lastSeen: now,
          lastMessage: now // Markiere als aktiv (hat Nachricht geschrieben)
        };

        if (existing) {
          return prev.map(v => v.username === username ? viewer : v);
        } else {
          return [...prev, viewer].sort((a, b) => 
            a.displayName.localeCompare(b.displayName)
          );
        }
      });
    };

    // Listener für Chat-Nachrichten
    const handleMessage = (data: any) => {
      if (data.username && data.tags) {
        trackViewer(data.username, data.tags);
      }
    };

    // Registriere Listener
    chatService.onMessage(handleMessage);

    // Lade initiale Viewer-Liste von Twitch API
    const loadChatters = async () => {
      try {
        const TwitchService = (await import('../../services/TwitchService')).TwitchService;
        const user = TwitchService.getUserFromStorage();
        const token = TwitchService.getStoredToken();
        
        if (user && token) {
          const response = await fetch(
            `https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${user.id}&moderator_id=${user.id}&first=1000`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': TwitchService.getClientId()
              }
            }
          );

          console.log('📡 Chatters API Response Status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Chatters geladen:', data.data?.length || 0);
            
            // Ersetze die komplette Liste (nicht nur hinzufügen)
            if (data.data && Array.isArray(data.data)) {
              const now = new Date();
              const newViewers: Viewer[] = data.data.map((chatter: any) => ({
                username: chatter.user_login,
                displayName: chatter.user_name,
                isMod: false, // Wird durch Chat-Nachrichten aktualisiert
                isVip: false,
                isSubscriber: false,
                lastSeen: now // Alle Chatters sind "aktiv" da sie von der API kommen
              }));
              
              setViewers(prev => {
                // Merge: Behalte Badge-Infos von existierenden Viewern, aber aktualisiere lastSeen
                const merged = newViewers.map(newViewer => {
                  const existing = prev.find(v => v.username === newViewer.username);
                  return existing 
                    ? { ...newViewer, isMod: existing.isMod, isVip: existing.isVip, isSubscriber: existing.isSubscriber, lastSeen: now } 
                    : newViewer;
                });
                
                return merged.sort((a, b) => a.displayName.localeCompare(b.displayName));
              });
            }
          } else {
            console.error('❌ Chatters API Fehler:', response.status, response.statusText);
            const errorData = await response.text();
            console.error('Error Details:', errorData);
          }
        }
      } catch (error) {
        console.error('❌ Fehler beim Laden der Chatters:', error);
      }
    };

    // Lade Chatters initial und alle 30 Sekunden (häufiger für Live-Updates)
    loadChatters();
    const chattersInterval = setInterval(loadChatters, 30000);

    return () => {
      clearInterval(chattersInterval);
    };
  }, []);

  const filteredViewers = viewers.filter(viewer => {
    // Filter nach Aktivität (hat in letzten 5 Minuten geschrieben)
    if (showOnlyActive) {
      if (!viewer.lastMessage) {
        return false; // Keine Nachricht = nicht aktiv
      }
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (viewer.lastMessage < fiveMinutesAgo) {
        return false;
      }
    }
    
    if (searchTerm && !viewer.displayName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    switch (filter) {
      case 'mods': return viewer.isMod;
      case 'vips': return viewer.isVip;
      case 'subs': return viewer.isSubscriber;
      default: return true;
    }
  });

  const activeViewers = viewers.filter(v => {
    if (!v.lastMessage) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return v.lastMessage >= fiveMinutesAgo;
  });

  const getBadges = (viewer: Viewer) => {
    const badges = [];
    if (viewer.isMod) badges.push('🛡️');
    if (viewer.isVip) badges.push('💎');
    if (viewer.isSubscriber) badges.push('⭐');
    return badges;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            placeholder="Suche Viewer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 theme-input rounded text-sm mr-2"
          />
          <button
            onClick={() => {
              const newValue = !showOnlyActive;
              setShowOnlyActive(newValue);
              localStorage.setItem('viewer-list-show-only-active', JSON.stringify(newValue));
            }}
            className={`px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
              showOnlyActive 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {showOnlyActive ? '🟢 Aktiv' : '📺 Alle'}
          </button>
        </div>
        <div className="text-xs theme-text-secondary mb-2">
          {showOnlyActive 
            ? `${activeViewers.length} aktive Viewer (letzte 5 Min)` 
            : `${viewers.length} Viewer gesamt`}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className="flex-1 px-2 py-1 rounded text-xs font-semibold"
            style={{ 
              backgroundColor: filter === 'all' ? 'var(--color-accent)' : 'var(--color-tile-content)', 
              color: filter === 'all' ? '#FFFFFF' : '#9147FF'
            }}
          >
            Alle ({viewers.length})
          </button>
          <button
            onClick={() => setFilter('mods')}
            className="flex-1 px-2 py-1 rounded text-xs font-semibold"
            style={{ 
              backgroundColor: filter === 'mods' ? '#3B82F6' : 'var(--color-tile-content)', 
              color: filter === 'mods' ? '#FFFFFF' : '#3B82F6'
            }}
          >
            🛡️ Mods ({viewers.filter(v => v.isMod).length})
          </button>
          <button
            onClick={() => setFilter('vips')}
            className="flex-1 px-2 py-1 rounded text-xs font-semibold"
            style={{ 
              backgroundColor: filter === 'vips' ? '#22C55E' : 'var(--color-tile-content)', 
              color: filter === 'vips' ? '#FFFFFF' : '#22C55E'
            }}
          >
            💎 VIPs ({viewers.filter(v => v.isVip).length})
          </button>
          <button
            onClick={() => setFilter('subs')}
            className="flex-1 px-2 py-1 rounded text-xs font-semibold"
            style={{ 
              backgroundColor: filter === 'subs' ? '#F97316' : 'var(--color-tile-content)', 
              color: filter === 'subs' ? '#FFFFFF' : '#F97316'
            }}
          >
            ⭐ Subs ({viewers.filter(v => v.isSubscriber).length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {filteredViewers.length === 0 ? (
          <div className="text-center theme-text-secondary py-8">
            {searchTerm ? 'Keine Viewer gefunden' : 'Noch keine Viewer aktiv'}
          </div>
        ) : (
          filteredViewers.map((viewer) => (
            <div
              key={viewer.username}
              className="theme-tile-content-bg p-2 rounded flex items-center justify-between theme-button transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}>
                  {viewer.displayName[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-sm theme-text">{viewer.displayName}</div>
                  <div className="text-xs theme-text-secondary">
                    {getBadges(viewer).join(' ')}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
