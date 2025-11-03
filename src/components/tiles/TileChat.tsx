import { useState, useEffect, useRef } from 'react';
import { emoteService } from '../../services/EmoteService';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  color: string;
  isMod?: boolean;
  isSubscriber?: boolean;
  isVip?: boolean;
  isFirstMessage?: boolean;
  badges?: string;
  tags?: any;
}

// Komponente zum Rendern von Nachrichten mit Emotes
function MessageWithEmotes({ message }: { message: ChatMessage }) {
  const emoteTags = message.tags?.emotes;
  const html = emoteService.parseMessageWithEmotes(message.message, emoteTags);
  
  return (
    <span 
      className="theme-text flex-1" 
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function TileChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(() => {
    const saved = localStorage.getItem('chat-show-timestamps');
    return saved ? JSON.parse(saved) : false;
  });
  const [highlightMessages, setHighlightMessages] = useState(() => {
    const saved = localStorage.getItem('chat-highlight-messages');
    return saved ? JSON.parse(saved) : false;
  });
  const [showViewerCount, setShowViewerCount] = useState(() => {
    const saved = localStorage.getItem('chat-show-viewer-count');
    return saved ? JSON.parse(saved) : true;
  });
  const [viewerCount, setViewerCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleTimestamps = () => {
    const newValue = !showTimestamps;
    setShowTimestamps(newValue);
    localStorage.setItem('chat-show-timestamps', JSON.stringify(newValue));
  };

  const toggleHighlight = () => {
    const newValue = !highlightMessages;
    setHighlightMessages(newValue);
    localStorage.setItem('chat-highlight-messages', JSON.stringify(newValue));
  };

  const toggleViewerCount = () => {
    const newValue = !showViewerCount;
    setShowViewerCount(newValue);
    localStorage.setItem('chat-show-viewer-count', JSON.stringify(newValue));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const parseBadges = (badgeString: string): string[] => {
    if (!badgeString) return [];
    const allBadges = badgeString.split(',').map(b => b.split('/')[0]);
    
    // Nur Sub, Mod, VIP und Broadcaster anzeigen
    const allowedBadges = ['moderator', 'vip', 'subscriber', 'founder', 'broadcaster'];
    return allBadges.filter(badge => allowedBadges.includes(badge));
  };

  const getBadgeLabel = (badge: string): string => {
    const labels: Record<string, string> = {
      'moderator': 'MOD',
      'vip': 'VIP',
      'subscriber': 'SUB',
      'founder': 'FOUNDER',
      'broadcaster': 'STREAMER',
      'staff': 'STAFF',
      'admin': 'ADMIN',
      'global_mod': 'GLOBAL MOD',
      'partner': 'PARTNER',
      'turbo': 'TURBO',
      'premium': 'PRIME',
      'bits': 'BITS',
      'sub-gifter': 'GIFTER'
    };
    return labels[badge] || badge.toUpperCase();
  };

  const getBadgeColor = (badge: string): string => {
    const colors: Record<string, string> = {
      'moderator': 'bg-green-600',
      'vip': 'bg-pink-600',
      'subscriber': 'bg-purple-600',
      'founder': 'bg-purple-700',
      'broadcaster': 'bg-red-600',
      'staff': 'bg-blue-700',
      'admin': 'bg-red-700',
      'global_mod': 'bg-green-700',
      'partner': 'bg-purple-500',
      'turbo': 'bg-blue-500',
      'premium': 'bg-blue-600',
      'bits': 'bg-yellow-600',
      'sub-gifter': 'bg-pink-500'
    };
    return colors[badge] || 'bg-gray-600';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Verbinde zum Chat und lade Emotes
  useEffect(() => {
    const connectChat = async () => {
      try {
        const { TwitchService } = await import('../../services/TwitchService');
        const { twitchChat } = await import('../../services/TwitchChatService');
        const { emoteService } = await import('../../services/EmoteService');
        
        const user = TwitchService.getUserFromStorage();
        const token = TwitchService.getStoredToken();
        
        if (user && token) {
          // Lade Emotes
          await emoteService.loadEmotes(user.id, user.login);
          
          // Verbinde zum Chat
          twitchChat.connect(user.login, user.login, token);
          
          // Höre auf neue Nachrichten
          twitchChat.onMessage((msg: ChatMessage) => {
            setMessages(prev => [...prev, msg].slice(-100)); // Max 100 Nachrichten
          });
          
          setIsConnecting(false);
        }
      } catch (error) {
        console.error('Fehler beim Verbinden zum Chat:', error);
        setIsConnecting(false);
      }
    };

    connectChat();

    return () => {
      // Cleanup beim Unmount
      import('../../services/TwitchChatService').then(({ twitchChat }) => {
        twitchChat.disconnect();
      });
    };
  }, []);

  // Lade Zuschauerzahl regelmäßig
  useEffect(() => {
    const loadViewerCount = async () => {
      try {
        const { TwitchService } = await import('../../services/TwitchService');
        const user = TwitchService.getUserFromStorage();
        if (user) {
          const streamInfo = await TwitchService.getStreamInfo(user.id);
          if (streamInfo) {
            setViewerCount(streamInfo.viewer_count);
          } else {
            setViewerCount(0); // Stream offline
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Zuschauerzahl:', error);
      }
    };

    loadViewerCount();
    // Aktualisiere alle 30 Sekunden
    const interval = setInterval(loadViewerCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const message = inputValue.trim();
      
      // Prüfe ob es ein Slash-Command ist
      if (message.startsWith('/')) {
        await handleCommand(message);
      } else {
        // Normale Nachricht senden
        const { twitchChat } = await import('../../services/TwitchChatService');
        twitchChat.sendMessage(message);
      }
      
      setInputValue('');
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
    }
  };

  const handleCommand = async (command: string) => {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const { twitchChat } = await import('../../services/TwitchChatService');

    switch (cmd) {
      case '/raid':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /raid <username>');
          return;
        }
        twitchChat.sendMessage(`/raid ${args[0]}`);
        addSystemMessage(`🚀 Raiding ${args[0]}...`);
        break;

      case '/unraid':
        twitchChat.sendMessage('/unraid');
        addSystemMessage('❌ Raid abgebrochen');
        break;

      case '/host':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /host <username>');
          return;
        }
        twitchChat.sendMessage(`/host ${args[0]}`);
        addSystemMessage(`📺 Hosting ${args[0]}...`);
        break;

      case '/unhost':
        twitchChat.sendMessage('/unhost');
        addSystemMessage('❌ Host beendet');
        break;

      case '/mod':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /mod <username>');
          return;
        }
        twitchChat.sendMessage(`/mod ${args[0]}`);
        addSystemMessage(`🛡️ ${args[0]} ist jetzt Moderator`);
        break;

      case '/unmod':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /unmod <username>');
          return;
        }
        twitchChat.sendMessage(`/unmod ${args[0]}`);
        addSystemMessage(`❌ ${args[0]} ist kein Moderator mehr`);
        break;

      case '/vip':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /vip <username>');
          return;
        }
        twitchChat.sendMessage(`/vip ${args[0]}`);
        addSystemMessage(`💎 ${args[0]} ist jetzt VIP`);
        break;

      case '/unvip':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /unvip <username>');
          return;
        }
        twitchChat.sendMessage(`/unvip ${args[0]}`);
        addSystemMessage(`❌ ${args[0]} ist kein VIP mehr`);
        break;

      case '/ban':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /ban <username> [reason]');
          return;
        }
        twitchChat.sendMessage(command);
        addSystemMessage(`🔨 ${args[0]} wurde gebannt`);
        break;

      case '/unban':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /unban <username>');
          return;
        }
        twitchChat.sendMessage(`/unban ${args[0]}`);
        addSystemMessage(`✅ ${args[0]} wurde entbannt`);
        break;

      case '/timeout':
        if (args.length < 2) {
          addSystemMessage('❌ Verwendung: /timeout <username> <seconds> [reason]');
          return;
        }
        twitchChat.sendMessage(command);
        addSystemMessage(`⏱️ ${args[0]} wurde für ${args[1]}s getimeoutet`);
        break;

      case '/clear':
        twitchChat.sendMessage('/clear');
        addSystemMessage('🧹 Chat wurde geleert');
        break;

      case '/slow':
        const slowTime = args[0] || '30';
        twitchChat.sendMessage(`/slow ${slowTime}`);
        addSystemMessage(`🐌 Slow-Mode aktiviert (${slowTime}s)`);
        break;

      case '/slowoff':
        twitchChat.sendMessage('/slowoff');
        addSystemMessage('✅ Slow-Mode deaktiviert');
        break;

      case '/followers':
        const followTime = args[0] || '0';
        twitchChat.sendMessage(`/followers ${followTime}`);
        addSystemMessage(`👥 Follower-Only-Mode aktiviert (${followTime}m)`);
        break;

      case '/followersoff':
        twitchChat.sendMessage('/followersoff');
        addSystemMessage('✅ Follower-Only-Mode deaktiviert');
        break;

      case '/subscribers':
        twitchChat.sendMessage('/subscribers');
        addSystemMessage('⭐ Subscriber-Only-Mode aktiviert');
        break;

      case '/subscribersoff':
        twitchChat.sendMessage('/subscribersoff');
        addSystemMessage('✅ Subscriber-Only-Mode deaktiviert');
        break;

      case '/emoteonly':
        twitchChat.sendMessage('/emoteonly');
        addSystemMessage('😀 Emote-Only-Mode aktiviert');
        break;

      case '/emoteonlyoff':
        twitchChat.sendMessage('/emoteonlyoff');
        addSystemMessage('✅ Emote-Only-Mode deaktiviert');
        break;

      case '/commercial':
        const duration = args[0] || '30';
        twitchChat.sendMessage(`/commercial ${duration}`);
        addSystemMessage(`📺 Werbung gestartet (${duration}s)`);
        break;

      case '/help':
        showCommandHelp();
        break;

      default:
        // Unbekannter Command - sende trotzdem (könnte ein Bot-Command sein)
        twitchChat.sendMessage(command);
        break;
    }
  };

  const addSystemMessage = (text: string) => {
    const systemMsg: ChatMessage = {
      id: `system-${Date.now()}`,
      username: 'System',
      message: text,
      timestamp: new Date(),
      color: '#9147FF',
      badges: ''
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  const showCommandHelp = () => {
    const helpMessages = [
      '📋 Verfügbare Befehle:',
      '/raid <user> - Raiden',
      '/host <user> - Hosten',
      '/mod <user> - Mod geben',
      '/vip <user> - VIP geben',
      '/ban <user> - Bannen',
      '/timeout <user> <sec> - Timeout',
      '/clear - Chat leeren',
      '/slow <sec> - Slow-Mode',
      '/followers <min> - Follower-Only',
      '/subscribers - Sub-Only',
      '/emoteonly - Emote-Only',
      '/commercial <sec> - Werbung'
    ];
    
    helpMessages.forEach(msg => addSystemMessage(msg));
  };

  const handleDeleteMessage = async (msgId: string) => {
    try {
      const msg = messages.find(m => m.id === msgId);
      const { twitchChat } = await import('../../services/TwitchChatService');
      
      console.log('🗑️ Lösche Nachricht:', msgId, 'von', msg?.username);
      
      // Lösche auf Twitch (für alle sichtbar)
      twitchChat.deleteMessage(msgId);
      
      // Entferne lokal (sofortiges Feedback)
      setMessages(prev => prev.filter(m => m.id !== msgId));
      
      // System-Nachricht
      const systemMsg: ChatMessage = {
        id: `system-delete-${Date.now()}`,
        username: 'System',
        message: `Nachricht von ${msg?.username || 'User'} wurde gelöscht`,
        timestamp: new Date(),
        color: '#9147FF',
        badges: ''
      };
      setMessages(prev => [...prev, systemMsg]);
    } catch (error) {
      console.error('❌ Fehler beim Löschen:', error);
    }
  };

  const handleTimeout = async (msgId: string, duration: number) => {
    const msg = messages.find(m => m.id === msgId);
    if (msg) {
      try {
        const { twitchChat } = await import('../../services/TwitchChatService');
        
        console.log(`⏱️ Timeout User: ${msg.username} für ${duration}s`);
        
        // Timeout auf Twitch (für alle sichtbar)
        twitchChat.timeoutUser(msg.username, duration);
        
        // Entferne alle Nachrichten des Users lokal
        setMessages(prev => prev.filter(m => m.username !== msg.username));
        
        // System-Nachricht
        const timeoutMsg: ChatMessage = {
          id: `system-timeout-${Date.now()}`,
          username: 'System',
          message: `${msg.username} wurde für ${duration}s getimeoutet`,
          timestamp: new Date(),
          color: '#FF6B6B',
          badges: ''
        };
        setMessages(prev => [...prev, timeoutMsg]);
      } catch (error) {
        console.error('❌ Fehler beim Timeout:', error);
      }
    }
  };

  const handleBan = async (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (msg) {
      try {
        const { twitchChat } = await import('../../services/TwitchChatService');
        
        console.log(`🚫 Ban User: ${msg.username}`);
        
        // Ban auf Twitch (für alle sichtbar)
        twitchChat.banUser(msg.username);
        
        // Entferne alle Nachrichten des Users lokal
        setMessages(prev => prev.filter(m => m.username !== msg.username));
        
        // System-Nachricht
        const banMsg: ChatMessage = {
          id: `system-ban-${Date.now()}`,
          username: 'System',
          message: `${msg.username} wurde permanent gebannt`,
          timestamp: new Date(),
          color: '#FF0000',
          badges: ''
        };
        setMessages(prev => [...prev, banMsg]);
      } catch (error) {
        console.error('❌ Fehler beim Bannen:', error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 theme-border" style={{ borderBottom: '1px solid var(--color-border)' }}>
        {showViewerCount && (
          <button
            onClick={toggleViewerCount}
            className="flex items-center gap-2 px-3 py-1 theme-button rounded transition-colors cursor-pointer"
            title="Zuschauerzahl ausblenden"
          >
            <span className="text-red-500">●</span>
            <span className="theme-text font-semibold">{viewerCount.toLocaleString()}</span>
            <span className="theme-text-secondary text-xs">Zuschauer</span>
          </button>
        )}
        {!showViewerCount && (
          <button
            onClick={toggleViewerCount}
            className="text-xs theme-text-secondary px-2 py-1"
            title="Zuschauerzahl anzeigen"
          >
            👁️
          </button>
        )}
        <div className="flex items-center gap-2">
        <button
          onClick={toggleHighlight}
          className="text-xs theme-text-secondary px-2 py-1 theme-button rounded flex items-center gap-1"
          title="Nachrichten hervorheben"
        >
          <span>💬</span>
          <span>{highlightMessages ? 'Felder aus' : 'Felder an'}</span>
        </button>
        <button
          onClick={toggleTimestamps}
          className="text-xs theme-text-secondary px-2 py-1 theme-button rounded flex items-center gap-1"
          title="Zeitstempel ein/ausblenden"
        >
          <span>🕐</span>
          <span>{showTimestamps ? 'Uhrzeit aus' : 'Uhrzeit an'}</span>
        </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isConnecting && (
          <div className="h-full flex flex-col items-center justify-center theme-text-secondary">
            <div className="animate-spin h-8 w-8 border-2 border-t-transparent rounded-full mb-2" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}></div>
            <div className="text-sm">Verbinde zum Chat...</div>
          </div>
        )}
        {!isConnecting && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center theme-text-secondary">
            <div className="text-4xl mb-2">💬</div>
            <div className="text-sm">Warte auf Chat-Nachrichten...</div>
          </div>
        )}
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className="group px-3 py-2 rounded border mb-2 theme-border"
            style={{
              backgroundColor: highlightMessages ? 'var(--color-tile-content)' : 'transparent',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="flex items-start gap-2">
              {showTimestamps && (
                <span className="theme-text-secondary text-xs flex-shrink-0 mt-0.5">
                  {formatTime(msg.timestamp)}
                </span>
              )}
              <div className="flex items-center gap-1 flex-shrink-0 flex-wrap">
                {msg.badges && parseBadges(msg.badges).map((badge, idx) => (
                  <span 
                    key={idx}
                    className={`text-white text-xs px-1.5 py-0.5 rounded font-semibold ${getBadgeColor(badge)}`}
                    title={badge}
                  >
                    {getBadgeLabel(badge)}
                  </span>
                ))}
                {msg.isFirstMessage && (
                  <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-semibold" title="Erste Nachricht">
                    FIRST
                  </span>
                )}
                <span style={{ color: msg.color }} className="font-semibold">{msg.username}</span>
              </div>
              <span className="theme-text-secondary">:</span>
              <MessageWithEmotes message={msg} />
              
              {msg.username !== 'Du' && msg.username !== 'System' && (
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}
                    className="text-red-400 hover:text-red-300 theme-button rounded flex items-center gap-0.5"
                    style={{ fontSize: '0.85em', padding: '2px 4px' }}
                    title="Nachricht löschen"
                  >
                    <span>🗑️</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleTimeout(msg.id, 60); }}
                    className="text-yellow-400 hover:text-yellow-300 theme-button rounded flex items-center gap-0.5"
                    style={{ fontSize: '0.85em', padding: '2px 4px' }}
                    title="Timeout 60 Sekunden"
                  >
                    <span>⏱️</span>
                    <span className="text-xs">60s</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleTimeout(msg.id, 600); }}
                    className="text-orange-400 hover:text-orange-300 theme-button rounded flex items-center gap-0.5"
                    style={{ fontSize: '0.85em', padding: '2px 4px' }}
                    title="Timeout 10 Minuten"
                  >
                    <span>⏱️</span>
                    <span className="text-xs">10m</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBan(msg.id); }}
                    className="text-red-500 hover:text-red-400 theme-button rounded flex items-center gap-0.5"
                    style={{ fontSize: '0.85em', padding: '2px 4px' }}
                    title="Permanent bannen"
                  >
                    <span>🚫</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nachricht senden... (Tipp: /help für Befehle)"
          className="w-full theme-input px-3 py-2 rounded"
        />
      </form>
    </div>
  );
}
