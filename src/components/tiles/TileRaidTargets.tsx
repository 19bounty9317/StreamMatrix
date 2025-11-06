import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

interface Channel {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  is_live: boolean;
  viewer_count?: number;
  game_name?: string;
}

export default function TileRaidTargets() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isRaiding, setIsRaiding] = useState(false);
  const [showOnlyLive, setShowOnlyLive] = useState(() => {
    const saved = localStorage.getItem('raid-targets-show-only-live');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    loadFollowedChannels();
    
    // Aktualisiere alle 60 Sekunden
    const interval = setInterval(loadFollowedChannels, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadFollowedChannels = async () => {
    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) return;

      // Hole gefolgte Kanäle
      const response = await fetch(
        `https://api.twitch.tv/helix/channels/followed?user_id=${user.id}&first=100`,
        {
          headers: {
            'Authorization': `Bearer ${TwitchService.getStoredToken()}`,
            'Client-Id': TwitchService.getClientId()
          }
        }
      );

      if (!response.ok) {
        console.error('Fehler beim Laden der gefolgten Kanäle:', response.status);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const followedChannels = data.data || [];

      // Hole Stream-Infos für alle Kanäle
      const channelIds = followedChannels.map((c: any) => c.broadcaster_id).join('&id=');
      const streamsResponse = await fetch(
        `https://api.twitch.tv/helix/streams?user_id=${channelIds}`,
        {
          headers: {
            'Authorization': `Bearer ${TwitchService.getStoredToken()}`,
            'Client-Id': TwitchService.getClientId()
          }
        }
      );

      const streamsData = await streamsResponse.json();
      const liveStreams = new Map<string, { viewer_count: number; game_name: string }>(
        (streamsData.data || []).map((s: any) => [
          s.user_id,
          { viewer_count: s.viewer_count, game_name: s.game_name }
        ])
      );

      // Hole User-Infos für Profilbilder
      const usersResponse = await fetch(
        `https://api.twitch.tv/helix/users?id=${channelIds}`,
        {
          headers: {
            'Authorization': `Bearer ${TwitchService.getStoredToken()}`,
            'Client-Id': TwitchService.getClientId()
          }
        }
      );

      const usersData = await usersResponse.json();
      const userProfiles = new Map<string, string>(
        (usersData.data || []).map((u: any) => [u.id, u.profile_image_url])
      );

      // Kombiniere Daten
      const channelsWithStatus: Channel[] = followedChannels.map((c: any) => {
        const streamInfo = liveStreams.get(c.broadcaster_id);
        const profileImage = userProfiles.get(c.broadcaster_id) || 
          `https://static-cdn.jtvnw.net/user-default-pictures-uv/75305d54-c7cc-40d1-bb9c-91fbe85943c7-profile_image-70x70.png`;
        
        return {
          id: c.broadcaster_id,
          login: c.broadcaster_login,
          display_name: c.broadcaster_name,
          profile_image_url: profileImage,
          is_live: !!streamInfo,
          viewer_count: streamInfo?.viewer_count || 0,
          game_name: streamInfo?.game_name || ''
        };
      });

      // Sortiere: Live zuerst, dann alphabetisch
      channelsWithStatus.sort((a, b) => {
        if (a.is_live && !b.is_live) return -1;
        if (!a.is_live && b.is_live) return 1;
        return a.display_name.localeCompare(b.display_name);
      });

      setChannels(channelsWithStatus);
      setIsLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Kanäle:', error);
      setIsLoading(false);
    }
  };

  const handleRaidClick = (channel: Channel) => {
    if (selectedChannel === channel.login) {
      // Zweiter Klick: Raid ausführen
      executeRaid(channel);
    } else {
      // Erster Klick: Kanal auswählen
      setSelectedChannel(channel.login);
    }
  };

  const executeRaid = async (channel: Channel) => {
    setIsRaiding(true);
    
    try {
      // Sende Raid-Command
      const { twitchChat } = await import('../../services/TwitchChatService');
      twitchChat.sendMessage(`/raid ${channel.login}`);
      
      // Zeige Bestätigung
      console.log(`✅ Raid zu ${channel.display_name} gestartet!`);
      
      // Reset nach 2 Sekunden
      setTimeout(() => {
        setSelectedChannel(null);
        setIsRaiding(false);
      }, 2000);
    } catch (error) {
      console.error('Fehler beim Raiden:', error);
      setIsRaiding(false);
      setSelectedChannel(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-t-transparent rounded-full" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  const filteredChannels = showOnlyLive ? channels.filter(c => c.is_live) : channels;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 pb-2 border-b theme-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm theme-text font-semibold">Raid-Ziele</span>
          <span className="text-xs theme-text-secondary">
            {channels.filter(c => c.is_live).length} live / {channels.length} total
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs theme-text-secondary">
            Klick 1x = Auswählen, 2x = Raiden
          </div>
          <button
            onClick={() => {
              const newValue = !showOnlyLive;
              setShowOnlyLive(newValue);
              localStorage.setItem('raid-targets-show-only-live', JSON.stringify(newValue));
            }}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              showOnlyLive 
                ? 'bg-red-600/30 text-red-300 border border-red-500/50' 
                : 'bg-gray-600/30 text-gray-300 border border-gray-500/50'
            }`}
          >
            {showOnlyLive ? '🔴 Nur Live' : '📺 Alle'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredChannels.length === 0 ? (
          <div className="text-center theme-text-secondary py-8">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-sm">
              {showOnlyLive ? 'Keine Live-Streams' : 'Keine gefolgten Kanäle'}
            </div>
          </div>
        ) : (
          filteredChannels.map(channel => (
            <div
              key={channel.id}
              onClick={() => handleRaidClick(channel)}
              className={`rounded-lg cursor-pointer transition-all duration-200 border-2 shadow-md hover:shadow-xl ${
                selectedChannel === channel.login
                  ? 'border-purple-500 bg-gradient-to-r from-purple-500/30 to-purple-600/30 shadow-purple-500/50 scale-[1.02] transform'
                  : channel.is_live
                    ? 'border-red-500/40 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:border-red-500/60 hover:from-red-500/20 hover:to-red-600/20'
                    : 'border-gray-600/30 theme-tile-content-bg hover:border-gray-500/50 hover:bg-gray-700/30'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={channel.profile_image_url}
                      alt={channel.display_name}
                      className={`w-14 h-14 rounded-full transition-all ${
                        channel.is_live ? 'ring-4 ring-red-500 shadow-lg shadow-red-500/50' : 'ring-2 ring-gray-600'
                      }`}
                    />
                    {channel.is_live && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full border-2 border-white animate-pulse shadow-lg"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`font-bold text-base truncate ${
                        channel.is_live ? 'text-red-300' : 'theme-text'
                      }`}>
                        {channel.display_name}
                      </span>
                      {channel.is_live && (
                        <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">
                          ● LIVE
                        </span>
                      )}
                    </div>
                    
                    {channel.is_live ? (
                      <div className="space-y-1">
                        <div className="text-sm theme-text font-medium truncate">
                          🎮 {channel.game_name}
                        </div>
                        <div className="text-sm text-red-300 font-semibold">
                          👥 {channel.viewer_count?.toLocaleString()} Zuschauer
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm theme-text-secondary font-medium">
                        ⚫ Offline
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    {selectedChannel === channel.login ? (
                      <button
                        disabled={isRaiding}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50 animate-pulse"
                      >
                        {isRaiding ? '⏳ Raiding...' : '🚀 RAIDEN!'}
                      </button>
                    ) : (
                      <button className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md ${
                        channel.is_live
                          ? 'bg-red-600/30 text-red-300 hover:bg-red-600/50 border border-red-500/50 hover:border-red-500'
                          : 'theme-button theme-text border border-gray-600/50 hover:border-gray-500'
                      }`}>
                        {channel.is_live ? '🎯 Raid' : '📡 Raid'}
                      </button>
                    )}
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
