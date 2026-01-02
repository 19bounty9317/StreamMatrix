import { useState, useEffect } from 'react';
import { twitchChat } from '../services/TwitchChatService';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  color: string;
}

interface UserModerationModalProps {
  username: string;
  userId?: string;
  userColor: string;
  onClose: () => void;
  allMessages: Message[];
}

export default function UserModerationModal({ 
  username, 
  userId,
  userColor, 
  onClose,
  allMessages 
}: UserModerationModalProps) {
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [banReason, setBanReason] = useState('');
  const [customBanReasons] = useState([
    'Spam',
    'Beleidigung',
    'Werbung',
    'Hate Speech',
    'Spoiler',
    'NSFW Content'
  ]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);

  useEffect(() => {
    // Die übergebenen Messages sind bereits für diesen User gefiltert
    console.log('📝 User-Nachrichten erhalten:', allMessages.length);
    if (allMessages.length > 0) {
      console.log('📝 Erste Message:', allMessages[0]);
      console.log('📝 Letzte Message:', allMessages[allMessages.length - 1]);
    }
    setUserMessages(allMessages);
  }, [allMessages]);

  // Lade User-Info von Twitch API
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const { TwitchService } = await import('../services/TwitchService');
        const token = TwitchService.getStoredToken();
        
        if (!token) {
          setIsLoadingUserInfo(false);
          return;
        }

        const response = await fetch(
          `https://api.twitch.tv/helix/users?login=${username}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Client-Id': TwitchService.getClientId()
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            setUserInfo(data.data[0]);
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der User-Info:', error);
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    loadUserInfo();
  }, [username]);

  const handleTimeout = (duration: number) => {
    if (window.electron?.sendChatCommand) {
      window.electron.sendChatCommand(`/timeout ${username} ${duration}`).then(() => {
        console.log(`⏱️ ${username} für ${duration}s getimeoutet`);
        // Sende Bestätigung zurück an Hauptfenster
        if (window.electron?.sendChatCommand) {
          window.electron.sendChatCommand(`__SYSTEM__:⏱️ ${username} wurde für ${duration}s getimeoutet`);
        }
      });
    } else {
      // Fallback für Browser
      twitchChat.timeoutUser(username, duration);
      console.log(`⏱️ ${username} für ${duration}s getimeoutet`);
    }
    onClose();
  };

  const handleBan = () => {
    if (window.electron?.sendChatCommand) {
      if (banReason) {
        window.electron.sendChatCommand(`/ban ${username} ${banReason}`).then(() => {
          console.log(`🚫 ${username} gebannt. Grund: ${banReason}`);
          if (window.electron?.sendChatCommand) {
            window.electron.sendChatCommand(`__SYSTEM__:🚫 ${username} wurde gebannt (Grund: ${banReason})`);
          }
        });
      } else {
        window.electron.sendChatCommand(`/ban ${username}`).then(() => {
          console.log(`🚫 ${username} gebannt`);
          if (window.electron?.sendChatCommand) {
            window.electron.sendChatCommand(`__SYSTEM__:🚫 ${username} wurde gebannt`);
          }
        });
      }
    } else {
      // Fallback für Browser
      twitchChat.banUser(username);
      console.log(`🚫 ${username} gebannt`);
    }
    onClose();
  };

  const handleUnban = () => {
    if (window.electron?.sendChatCommand) {
      window.electron.sendChatCommand(`/unban ${username}`).then(() => {
        console.log(`✅ ${username} entbannt`);
        if (window.electron?.sendChatCommand) {
          window.electron.sendChatCommand(`__SYSTEM__:✅ ${username} wurde entbannt`);
        }
      });
    } else {
      // Fallback für Browser
      twitchChat.sendMessage(`/unban ${username}`);
      console.log(`✅ ${username} entbannt`);
    }
    onClose();
  };

  const handleMod = () => {
    if (window.electron?.sendChatCommand) {
      window.electron.sendChatCommand(`/mod ${username}`).then(() => {
        console.log(`⭐ ${username} zum Mod ernannt`);
        if (window.electron?.sendChatCommand) {
          window.electron.sendChatCommand(`__SYSTEM__:⭐ ${username} ist jetzt Moderator`);
        }
      });
    } else {
      // Fallback für Browser
      twitchChat.sendMessage(`/mod ${username}`);
      console.log(`⭐ ${username} zum Mod ernannt`);
    }
    onClose();
  };

  const handleUnmod = () => {
    if (window.electron?.sendChatCommand) {
      window.electron.sendChatCommand(`/unmod ${username}`).then(() => {
        console.log(`❌ ${username} Mod-Status entfernt`);
        if (window.electron?.sendChatCommand) {
          window.electron.sendChatCommand(`__SYSTEM__:❌ ${username} ist kein Moderator mehr`);
        }
      });
    } else {
      // Fallback für Browser
      twitchChat.sendMessage(`/unmod ${username}`);
      console.log(`❌ ${username} Mod-Status entfernt`);
    }
    onClose();
  };

  const handleVIP = () => {
    if (window.electron?.sendChatCommand) {
      window.electron.sendChatCommand(`/vip ${username}`).then(() => {
        console.log(`💎 ${username} zum VIP ernannt`);
        if (window.electron?.sendChatCommand) {
          window.electron.sendChatCommand(`__SYSTEM__:💎 ${username} ist jetzt VIP`);
        }
      });
    } else {
      // Fallback für Browser
      twitchChat.sendMessage(`/vip ${username}`);
      console.log(`💎 ${username} zum VIP ernannt`);
    }
    onClose();
  };

  const handleUnVIP = () => {
    if (window.electron?.sendChatCommand) {
      window.electron.sendChatCommand(`/unvip ${username}`).then(() => {
        console.log(`❌ ${username} VIP-Status entfernt`);
        if (window.electron?.sendChatCommand) {
          window.electron.sendChatCommand(`__SYSTEM__:❌ ${username} ist kein VIP mehr`);
        }
      });
    } else {
      // Fallback für Browser
      twitchChat.sendMessage(`/unvip ${username}`);
      console.log(`❌ ${username} VIP-Status entfernt`);
    }
    onClose();
  };

  const handleShoutout = () => {
    if (window.electron?.sendChatCommand) {
      window.electron.sendChatCommand(`/shoutout ${username}`).then(() => {
        console.log(`📢 Shoutout für ${username}`);
        if (window.electron?.sendChatCommand) {
          window.electron.sendChatCommand(`__SYSTEM__:📢 Shoutout für ${username} gesendet`);
        }
      });
    } else {
      // Fallback für Browser
      twitchChat.sendMessage(`/shoutout ${username}`);
      console.log(`📢 Shoutout für ${username}`);
    }
  };

  const handlePermit = () => {
    if (window.electron?.sendChatCommand) {
      window.electron.sendChatCommand(`!permit ${username}`).then(() => {
        console.log(`✅ ${username} darf einmalig Links posten`);
        if (window.electron?.sendChatCommand) {
          window.electron.sendChatCommand(`__SYSTEM__:✅ ${username} darf einmalig Links posten`);
        }
      });
    } else {
      // Fallback für Browser
      twitchChat.sendMessage(`!permit ${username}`);
      console.log(`✅ ${username} darf einmalig Links posten`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="theme-tile-bg rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Linke Seite: User Info */}
        <div className="w-1/3 border-r theme-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b theme-border">
            <div className="flex items-center gap-3">
              {userInfo?.profile_image_url ? (
                <img 
                  src={userInfo.profile_image_url} 
                  alt={username}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: userColor }}>
                  {username[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold theme-text">{username}</h2>
                {userInfo && (
                  <p className="text-sm theme-text-secondary">@{userInfo.login}</p>
                )}
              </div>
            </div>
          </div>

          {/* User Bio */}
          {userInfo && (
            <div className="p-4 border-b theme-border">
              <h3 className="text-sm font-bold theme-text mb-2">Bio</h3>
              <p className="text-sm theme-text-secondary whitespace-pre-wrap">
                {userInfo.description || 'Keine Bio verfügbar'}
              </p>
            </div>
          )}

          {/* User Stats */}
          {userInfo && (
            <div className="p-4 border-b theme-border">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="theme-text-secondary">Erstellt</div>
                  <div className="theme-text font-bold">
                    {new Date(userInfo.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
                <div>
                  <div className="theme-text-secondary">Typ</div>
                  <div className="theme-text font-bold">
                    {userInfo.broadcaster_type || 'User'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="p-4 flex-1">
            <button
              onClick={() => window.open(`https://twitch.tv/${username}`, '_blank')}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold transition-colors mb-2"
            >
              🔗 Twitch Profil öffnen
            </button>
            <button
              onClick={() => window.open('https://help.twitch.tv/', '_blank')}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold transition-colors"
            >
              ❓ FAQ
            </button>
          </div>
        </div>

        {/* Rechte Seite: Mod Actions */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b theme-border flex items-center justify-between">
            <h2 className="text-xl font-bold theme-text">Moderations-Aktionen</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded hover:bg-gray-700 flex items-center justify-center theme-text"
            >
              ✕
            </button>
          </div>

          {/* Statistiken */}
          <div className="p-4 border-b theme-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                  {userMessages.length}
                </div>
                <div className="text-sm theme-text-secondary">Nachrichten</div>
              </div>
              <div>
                <div className="text-3xl font-bold theme-text">0/0/0</div>
                <div className="text-sm theme-text-secondary">Mod-Aktionen</div>
              </div>
              <div>
                <div className="text-3xl font-bold theme-text">0 (+0)</div>
                <div className="text-sm theme-text-secondary">Mod-Kommentare</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-b theme-border">
            <div className="grid grid-cols-4 gap-2 mb-3">
              <button
                onClick={handleBan}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors"
              >
                Ban
              </button>
              <button
                onClick={handleUnban}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold transition-colors"
              >
                Unban
              </button>
              <button
                onClick={() => handleTimeout(5)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold transition-colors"
              >
                5s
              </button>
              <button
                onClick={() => handleTimeout(120)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold transition-colors"
              >
                2m
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              <button
                onClick={() => handleTimeout(600)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold transition-colors"
              >
                10m
              </button>
              <button
                onClick={() => handleTimeout(86400)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold transition-colors"
              >
                1d
              </button>
              <button
                onClick={() => handleTimeout(1209600)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold transition-colors"
              >
                14d
              </button>
              <button
                onClick={handleMod}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold transition-colors"
              >
                Mod
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              <button
                onClick={handleVIP}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded font-bold transition-colors"
              >
                VIP
              </button>
              <button
                onClick={handleUnVIP}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold transition-colors"
              >
                Un-VIP
              </button>
              <button
                onClick={handleUnmod}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold transition-colors"
              >
                Unmod
              </button>
              <button
                onClick={handlePermit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold transition-colors"
              >
                Permit
              </button>
            </div>

            {/* Ban Reason */}
            <div className="flex gap-2">
              <select
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="flex-1 px-3 py-2 rounded theme-tile-content-bg theme-text border theme-border"
              >
                <option value="">Ban Grund wählen (optional)</option>
                {customBanReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              <button
                onClick={handleShoutout}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold transition-colors"
              >
                📢 Shoutout
              </button>
            </div>
          </div>

          {/* Message History - Alle Nachrichten des Users */}
          <div className="flex-1 overflow-y-auto p-4 theme-tile-content-bg">
            <h3 className="text-sm font-bold theme-text mb-3">
              Nachrichten-Verlauf ({userMessages.length} Nachrichten):
            </h3>
            {userMessages.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm theme-text-secondary italic mb-2">Keine Nachrichten gefunden</p>
                <p className="text-xs theme-text-secondary">
                  Hinweis: Nur Nachrichten, die seit dem Öffnen der App geschrieben wurden, werden angezeigt.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {userMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2 p-2 rounded hover:bg-gray-700/30">
                    <span className="text-xs theme-text-secondary whitespace-nowrap">
                      {msg.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex-1">
                      <span style={{ color: msg.color }} className="font-bold text-sm">
                        {msg.username}:
                      </span>{' '}
                      <span className="text-sm theme-text">{msg.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="p-4 border-t theme-border">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
