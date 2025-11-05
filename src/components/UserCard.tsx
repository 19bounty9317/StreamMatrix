import { useState, useEffect } from 'react';

interface UserCardProps {
  username: string;
  userId?: string;
  color: string;
  badges?: string;
  onClose: () => void;
  position: { x: number; y: number };
}

interface UserInfo {
  id: string;
  login: string;
  display_name: string;
  description: string;
  profile_image_url: string;
  created_at: string;
  follower_count?: number;
  is_following?: boolean;
}

export default function UserCard({ username, color, badges, onClose, position }: UserCardProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, [username]);

  const loadUserInfo = async () => {
    try {
      const { TwitchService } = await import('../services/TwitchService');
      const info = await TwitchService.getUserInfo(username);
      setUserInfo(info);
    } catch (error) {
      console.error('Fehler beim Laden der User-Info:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseBadges = (badgeString: string): string[] => {
    if (!badgeString) return [];
    return badgeString.split(',').map(b => b.split('/')[0]);
  };

  const getBadgeLabel = (badge: string): string => {
    const labels: Record<string, string> = {
      'moderator': 'MOD',
      'vip': 'VIP',
      'subscriber': 'SUB',
      'founder': 'FOUNDER',
      'broadcaster': 'STREAMER'
    };
    return labels[badge] || badge.toUpperCase();
  };

  const getBadgeColor = (badge: string): string => {
    const colors: Record<string, string> = {
      'moderator': 'bg-green-600',
      'vip': 'bg-pink-600',
      'subscriber': 'bg-purple-600',
      'founder': 'bg-purple-700',
      'broadcaster': 'bg-red-600'
    };
    return colors[badge] || 'bg-gray-600';
  };

  const getAccountAge = (createdAt: string): string => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} Tage`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} Monate`;
    return `${Math.floor(diffDays / 365)} Jahre`;
  };

  const handleTimeout = async (duration: number) => {
    try {
      const { twitchChat } = await import('../services/TwitchChatService');
      twitchChat.timeoutUser(username, duration);
      onClose();
    } catch (error) {
      console.error('Fehler beim Timeout:', error);
    }
  };

  const handleBan = async () => {
    try {
      const { twitchChat } = await import('../services/TwitchChatService');
      twitchChat.banUser(username);
      onClose();
    } catch (error) {
      console.error('Fehler beim Bannen:', error);
    }
  };

  const handleMod = async () => {
    try {
      const { twitchChat } = await import('../services/TwitchChatService');
      twitchChat.sendMessage(`/mod ${username}`);
      onClose();
    } catch (error) {
      console.error('Fehler beim Mod geben:', error);
    }
  };

  const handleVip = async () => {
    try {
      const { twitchChat } = await import('../services/TwitchChatService');
      twitchChat.sendMessage(`/vip ${username}`);
      onClose();
    } catch (error) {
      console.error('Fehler beim VIP geben:', error);
    }
  };

  return (
    <>
      {/* Overlay zum Schließen */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* User Card */}
      <div 
        className="fixed z-50 rounded-lg shadow-2xl"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '320px',
          maxHeight: '500px',
          overflow: 'auto',
          backgroundColor: 'var(--color-tile)',
          border: '1px solid var(--color-border)'
        }}
      >
        {loading ? (
          <div className="p-4 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-t-transparent rounded-full" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}></div>
          </div>
        ) : userInfo ? (
          <div>
            {/* Header mit Profilbild */}
            <div className="p-4 rounded-t-lg" style={{ backgroundColor: 'var(--color-tile-header)' }}>
              <div className="flex items-start gap-3">
                <img 
                  src={userInfo.profile_image_url} 
                  alt={userInfo.display_name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="theme-text font-bold text-lg" style={{ color }}>
                      {userInfo.display_name}
                    </h3>
                    {badges && parseBadges(badges).map((badge, idx) => (
                      <span 
                        key={idx}
                        className={`text-white text-xs px-2 py-0.5 rounded font-semibold ${getBadgeColor(badge)}`}
                      >
                        {getBadgeLabel(badge)}
                      </span>
                    ))}
                  </div>
                  <div className="theme-text-secondary text-sm">@{userInfo.login}</div>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 space-y-3">
              {userInfo.description && (
                <div>
                  <div className="theme-text-secondary text-xs mb-1">Bio</div>
                  <div className="theme-text text-sm">{userInfo.description}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="theme-text-secondary text-xs mb-1">Account-Alter</div>
                  <div className="theme-text text-sm font-semibold">
                    {getAccountAge(userInfo.created_at)}
                  </div>
                </div>
                {userInfo.follower_count !== undefined && (
                  <div>
                    <div className="theme-text-secondary text-xs mb-1">Follower</div>
                    <div className="theme-text text-sm font-semibold">
                      {userInfo.follower_count.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Aktionen */}
              <div className="pt-3 border-t theme-border space-y-2">
                <button
                  onClick={() => window.open(`https://twitch.tv/${userInfo.login}`, '_blank')}
                  className="w-full theme-button px-3 py-2 rounded text-sm theme-text hover:opacity-80 transition-opacity"
                >
                  📺 Kanal besuchen
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleMod}
                    className="theme-button px-3 py-2 rounded text-sm theme-text hover:opacity-80 transition-opacity"
                  >
                    🛡️ Mod
                  </button>
                  <button
                    onClick={handleVip}
                    className="theme-button px-3 py-2 rounded text-sm theme-text hover:opacity-80 transition-opacity"
                  >
                    💎 VIP
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleTimeout(60)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-2 rounded text-xs transition-colors"
                  >
                    ⏱️ 1m
                  </button>
                  <button
                    onClick={() => handleTimeout(600)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-2 rounded text-xs transition-colors"
                  >
                    ⏱️ 10m
                  </button>
                  <button
                    onClick={handleBan}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded text-xs transition-colors"
                  >
                    🚫 Ban
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 theme-text-secondary text-center">
            User nicht gefunden
          </div>
        )}
      </div>
    </>
  );
}
