import { useState, useEffect } from 'react';
import { TwitchChatService } from '../../services/TwitchChatService';

interface Viewer {
  username: string;
  displayName: string;
  isMod: boolean;
  isVip: boolean;
  isSubscriber: boolean;
  lastSeen: Date;
}

export default function TileViewerList() {
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [filter, setFilter] = useState<'all' | 'mods' | 'vips' | 'subs'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const chatService = TwitchChatService.getInstance();
    
    // Tracke Viewer aus Chat-Nachrichten
    const trackViewer = (username: string, tags: any) => {
      setViewers(prev => {
        const existing = prev.find(v => v.username === username);
        
        const viewer: Viewer = {
          username,
          displayName: tags['display-name'] || username,
          isMod: tags.mod === '1' || tags.badges?.includes('moderator'),
          isVip: tags.badges?.includes('vip') || false,
          isSubscriber: tags.subscriber === '1' || tags.badges?.includes('subscriber'),
          lastSeen: new Date()
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
        
        if (user) {
          const response = await fetch(
            `https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${user.id}&moderator_id=${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${user.access_token}`,
                'Client-Id': (await import('../../config/twitch.config')).TWITCH_CONFIG.CLIENT_ID
              }
            }
          );

          console.log('📡 Chatters API Response Status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Chatters geladen:', data.data?.length || 0, data);
            
            // Füge Chatters zur Liste hinzu
            if (data.data && Array.isArray(data.data)) {
              data.data.forEach((chatter: any) => {
                trackViewer(chatter.user_login, {
                  'display-name': chatter.user_name,
                  'mod': '0',
                  'subscriber': '0',
                  'badges': ''
                });
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

    // Lade Chatters initial und alle 60 Sekunden
    loadChatters();
    const chattersInterval = setInterval(loadChatters, 60000);

    // Cleanup: Entferne Viewer die länger als 5 Minuten inaktiv sind
    const cleanupInterval = setInterval(() => {
      setViewers(prev => 
        prev.filter(v => Date.now() - v.lastSeen.getTime() < 300000)
      );
    }, 60000);

    return () => {
      clearInterval(chattersInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  const filteredViewers = viewers.filter(viewer => {
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
        <input
          type="text"
          placeholder="Suche Viewer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 theme-input rounded text-sm mb-2"
        />
        
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
