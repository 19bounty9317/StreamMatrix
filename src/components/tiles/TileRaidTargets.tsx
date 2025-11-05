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

      // Kombiniere Daten
      const channelsWithStatus: Channel[] = followedChannels.map((c: any) => {
        const streamInfo = liveStreams.get(c.broadcaster_id);
        return {
          id: c.broadcaster_id,
          login: c.broadcaster_login,
          display_name: c.broadcaster_name,
          profile_image_url: `https://static-cdn.jtvnw.net/jtv_user_pictures/${c.broadcaster_login}-profile_image-70x70.png`,
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

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 pb-2 border-b theme-border">
        <div className="flex items-center justify-between">
          <span className="text-sm theme-text font-semibold">Raid-Ziele</span>
          <span className="text-xs theme-text-secondary">
            {channels.filter(c => c.is_live).length} live
          </span>
        </div>
        <div className="text-xs theme-text-secondary mt-1">
          Klick 1x = Auswählen, 2x = Raiden
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {channels.length === 0 ? (
          <div className="text-center theme-text-secondary py-8">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-sm">Keine gefolgten Kanäle</div>
          </div>
        ) : (
          channels.map(channel => (
            <div
              key={channel.id}
              onClick={() => handleRaidClick(channel)}
              className={`p-3 rounded theme-button cursor-pointer transition-all ${
                selectedChannel === channel.login
                  ? 'ring-2 ring-purple-500 bg-purple-500/20'
                  : 'hover:bg-opacity-80'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={channel.profile_image_url}
                  alt={channel.display_name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="theme-text font-semibold truncate">
                      {channel.display_name}
                    </span>
                    {channel.is_live && (
                      <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                      </span>
                    )}
                  </div>
                  {channel.is_live && (
                    <div className="text-xs theme-text-secondary mt-1">
                      {channel.game_name} • {channel.viewer_count?.toLocaleString()} Zuschauer
                    </div>
                  )}
                  {!channel.is_live && (
                    <div className="text-xs theme-text-secondary mt-1">
                      Offline
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {selectedChannel === channel.login ? (
                    <button
                      disabled={isRaiding}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold text-sm transition-colors disabled:opacity-50"
                    >
                      {isRaiding ? '⏳' : '🚀 Raiden!'}
                    </button>
                  ) : (
                    <button className="theme-button px-3 py-2 rounded text-sm theme-text">
                      Auswählen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
