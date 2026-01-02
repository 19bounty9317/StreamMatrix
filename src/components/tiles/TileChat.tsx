import { useState, useEffect, useRef } from 'react';
import { emoteService } from '../../services/EmoteService';
import UserCard from '../UserCard';
import UserModerationModal from '../UserModerationModal';

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
  isRaidNotice?: boolean; // Für Raid-Banner
  raidTarget?: string; // Raid-Ziel
  noticeType?: string; // Typ der Benachrichtigung
  msgId?: string; // Message ID für spezielle Events
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
  const [selectedUser, setSelectedUser] = useState<{ username: string; color: string; badges: string; position: { x: number; y: number } } | null>(null);
  const [selectedUserForModeration, setSelectedUserForModeration] = useState<{ username: string; userId?: string; color: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(() => {
    const saved = localStorage.getItem('chat-auto-scroll');
    return saved ? JSON.parse(saved) : true;
  });
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [slowModeActive, setSlowModeActive] = useState(false);
  const [slowModeSeconds, setSlowModeSeconds] = useState(30);
  const [emoteOnlyActive, setEmoteOnlyActive] = useState(false);

  const toggleSlowMode = async () => {
    try {
      const { TwitchService } = await import('../../services/TwitchService');
      const user = TwitchService.getUserFromStorage();
      const token = TwitchService.getStoredToken();
      
      if (!user || !token) {
        console.error('❌ Nicht eingeloggt');
        return;
      }

      // Verwende Twitch Helix API statt IRC-Befehle
      const response = await fetch(
        `https://api.twitch.tv/helix/chat/settings?broadcaster_id=${user.id}&moderator_id=${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': '29m9wd4tyae2dgkvgr8ddqv45rxpwk',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            slow_mode: !slowModeActive,
            slow_mode_wait_time: slowModeActive ? null : slowModeSeconds
          })
        }
      );

      if (response.ok) {
        setSlowModeActive(!slowModeActive);
        console.log(`✅ Slow Mode ${!slowModeActive ? 'aktiviert' : 'deaktiviert'}`);
      } else {
        const error = await response.text();
        console.error('❌ Fehler beim Umschalten des Slow Mode:', error);
      }
    } catch (error) {
      console.error('Fehler beim Umschalten des Slow Mode:', error);
    }
  };

  const toggleEmoteOnly = async () => {
    try {
      const { TwitchService } = await import('../../services/TwitchService');
      const user = TwitchService.getUserFromStorage();
      const token = TwitchService.getStoredToken();
      
      if (!user || !token) {
        console.error('❌ Nicht eingeloggt');
        return;
      }

      // Verwende Twitch Helix API statt IRC-Befehle
      const response = await fetch(
        `https://api.twitch.tv/helix/chat/settings?broadcaster_id=${user.id}&moderator_id=${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': '29m9wd4tyae2dgkvgr8ddqv45rxpwk',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emote_mode: !emoteOnlyActive
          })
        }
      );

      if (response.ok) {
        setEmoteOnlyActive(!emoteOnlyActive);
        console.log(`✅ Emote-Only ${!emoteOnlyActive ? 'aktiviert' : 'deaktiviert'}`);
      } else {
        const error = await response.text();
        console.error('❌ Fehler beim Umschalten des Emote-Only:', error);
      }
    } catch (error) {
      console.error('Fehler beim Umschalten des Emote-Only:', error);
    }
  };

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

  const toggleAutoScroll = () => {
    const newValue = !autoScroll;
    setAutoScroll(newValue);
    localStorage.setItem('chat-auto-scroll', JSON.stringify(newValue));
    if (newValue) {
      scrollToBottom();
    }
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    if (autoScroll) {
      // Kleine Verzögerung damit DOM aktualisiert ist
      setTimeout(() => {
        scrollToBottom();
      }, 10);
    }
  }, [messages, autoScroll]);

  // Listener für manuelles Scrollen - nur für Scroll-Button Anzeige
  useEffect(() => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (!chatContainer) return;

    const handleScroll = () => {
      if (!autoScroll) {
        // Nur im manuellen Modus: Zeige Button wenn nicht am Ende
        const scrollBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;
        setShowScrollButton(scrollBottom > 150);
      }
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, [autoScroll]);

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
            // Speichere JEDE Nachricht in der User-History (für Moderation)
            import('../../services/UserMessageHistoryService').then(({ userMessageHistoryService }) => {
              userMessageHistoryService.addMessage(msg);
            });
            
            setMessages(prev => {
              // Keine Duplikat-Prüfung mehr - Twitch sendet jede Nachricht nur einmal
              // Das Echo von eigenen Nachrichten ist gewollt!
              return [...prev, msg].slice(-500); // Max 500 Nachrichten im Chat-Fenster
            });

            // Sende Channel Points Redemptions an NotificationService für Alerts
            if (msg.noticeType === 'channel-points') {
              import('../../services/NotificationService').then(({ default: NotificationService }) => {
                const notificationService = NotificationService.getInstance();
                notificationService.showAlert({
                  id: msg.id,
                  type: 'channel-points',
                  username: msg.username,
                  message: msg.message,
                  timestamp: msg.timestamp
                });
              });
            }
          });
          
          // Höre auf ROOMSTATE-Updates
          twitchChat.onRoomState((state: any) => {
            console.log('🏠 ROOMSTATE Update empfangen:', state);
            setSlowModeActive(state.slow > 0);
            if (state.slow > 0) {
              setSlowModeSeconds(state.slow);
            }
            setEmoteOnlyActive(state.emoteOnly);
          });
          
          setIsConnecting(false);
        }
      } catch (error) {
        console.error('Fehler beim Verbinden zum Chat:', error);
        setIsConnecting(false);
      }
    };

    connectChat();

    // Listener für Chat-Befehle vom User-Modal-Fenster
    const handleChatCommand = async (command: string) => {
      console.log('💬 Führe Chat-Befehl aus:', command);
      
      // Prüfe ob es eine System-Nachricht ist
      if (command.startsWith('__SYSTEM__:')) {
        const message = command.replace('__SYSTEM__:', '');
        const systemMsg: ChatMessage = {
          id: `system-${Date.now()}`,
          username: 'System',
          message: message,
          timestamp: new Date(),
          color: '#9147FF',
          badges: ''
        };
        setMessages(prev => [...prev, systemMsg].slice(-500));
        return;
      }
      
      const { twitchChat } = await import('../../services/TwitchChatService');
      twitchChat.sendMessage(command);
    };

    // Electron IPC Listener
    if (window.electron?.onExecuteChatCommand) {
      window.electron.onExecuteChatCommand(handleChatCommand);
    }

    return () => {
      // Cleanup beim Unmount
      import('../../services/TwitchChatService').then(({ twitchChat }) => {
        twitchChat.disconnect();
      });
    };
  }, []);

  // Listener für Test-Events
  useEffect(() => {
    const handleTestEvent = (event: CustomEvent) => {
      const data = event.detail;
      console.log('🧪 Chat Test Event empfangen:', data);
      
      const testMessage: ChatMessage = {
        id: `test-${Date.now()}`,
        username: data.username,
        message: getTestChatMessage(data),
        timestamp: new Date(),
        color: '#9147FF',
        badges: getTestBadges(data.type),
        tags: {}
      };
      
      setMessages(prev => [...prev, testMessage].slice(-500));
    };

    const getTestChatMessage = (data: any) => {
      switch (data.type) {
        case 'sub':
          return 'Danke für den Sub! ⭐';
        case 'gift-sub':
          return `Verschenkt ${data.amount || 1} Subs! 🎁`;
        case 'bits':
          return `Cheers ${data.amount || 0} Bits! 💎`;
        case 'follow':
          return 'Danke fürs Folgen! 👤';
        case 'raid':
          return `Raidet mit ${data.amount || 0} Zuschauern! 🚀`;
        case 'donation':
          return `Spendet ${data.amount || 0}€! 💵`;
        default:
          return 'Test Event 🎉';
      }
    };

    const getTestBadges = (type: string) => {
      if (type === 'sub' || type === 'gift-sub') return 'subscriber/1';
      if (type === 'bits') return 'bits/1000';
      return '';
    };

    window.addEventListener('test-event-trigger' as any, handleTestEvent);

    // Listener für Tile-Reload (beim Verlassen des Test-Modus)
    const handleReload = () => {
      // Entferne alle Test-Nachrichten
      setMessages(prev => prev.filter(m => !m.id.startsWith('test-')));
    };
    window.addEventListener('reload-tiles' as any, handleReload);

    // Listener für Channel Points Redemptions (von EventSub)
    const handleChannelPoints = (event: CustomEvent) => {
      const msg = event.detail;
      setMessages(prev => [...prev, msg].slice(-500));
    };
    window.addEventListener('chat-message' as any, handleChannelPoints);

    return () => {
      window.removeEventListener('test-event-trigger' as any, handleTestEvent);
      window.removeEventListener('reload-tiles' as any, handleReload);
      window.removeEventListener('chat-message' as any, handleChannelPoints);
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
        
        // NICHT lokal hinzufügen - warte auf Twitch-Echo
        // Twitch sendet die Nachricht mit allen korrekten Daten zurück:
        // - Echte Username-Farbe
        // - Echte Badges (Broadcaster, Mod, Sub, etc.)
        // - Korrekte Tags
        // So sieht es genau wie im echten Twitch Chat aus!
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
        
        // Zeige Raid-Banner wie im Twitch Chat
        const raidNotice: ChatMessage = {
          id: `raid-notice-${Date.now()}`,
          username: 'Raid',
          message: `Du raidest jetzt ${args[0]}!`,
          timestamp: new Date(),
          color: '#9147FF',
          badges: '',
          tags: {},
          isRaidNotice: true,
          raidTarget: args[0]
        };
        setMessages(prev => [...prev, raidNotice].slice(-500));
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

      case '/uniquechat':
        twitchChat.sendMessage('/uniquechat');
        addSystemMessage('🔒 Unique-Chat aktiviert (R9K-Mode)');
        break;

      case '/uniquechatoff':
        twitchChat.sendMessage('/uniquechatoff');
        addSystemMessage('✅ Unique-Chat deaktiviert');
        break;

      case '/r9kbeta':
        twitchChat.sendMessage('/r9kbeta');
        addSystemMessage('🔒 R9K-Mode aktiviert');
        break;

      case '/r9kbetaoff':
        twitchChat.sendMessage('/r9kbetaoff');
        addSystemMessage('✅ R9K-Mode deaktiviert');
        break;

      case '/color':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /color <farbe>');
          addSystemMessage('💡 Farben: Blue, Coral, DodgerBlue, SpringGreen, YellowGreen, Green, OrangeRed, Red, GoldenRod, HotPink, CadetBlue, SeaGreen, Chocolate, BlueViolet, Firebrick');
          return;
        }
        twitchChat.sendMessage(`/color ${args[0]}`);
        addSystemMessage(`🎨 Farbe geändert zu ${args[0]}`);
        break;

      case '/me':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /me <aktion>');
          return;
        }
        twitchChat.sendMessage(command);
        addSystemMessage(`💬 Aktion gesendet`);
        break;

      case '/announce':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /announce <nachricht>');
          return;
        }
        twitchChat.sendMessage(command);
        addSystemMessage(`📢 Ankündigung gesendet`);
        break;

      case '/announceblue':
      case '/announcegreen':
      case '/announceorange':
      case '/announcepurple':
        if (args.length === 0) {
          addSystemMessage(`❌ Verwendung: ${cmd} <nachricht>`);
          return;
        }
        twitchChat.sendMessage(command);
        addSystemMessage(`📢 Farbige Ankündigung gesendet`);
        break;

      case '/delete':
        if (args.length === 0) {
          addSystemMessage('❌ Verwendung: /delete <message-id>');
          return;
        }
        twitchChat.sendMessage(command);
        addSystemMessage(`🗑️ Nachricht gelöscht`);
        break;

      case '/w':
      case '/whisper':
        if (args.length < 2) {
          addSystemMessage('❌ Verwendung: /w <username> <nachricht>');
          return;
        }
        twitchChat.sendMessage(command);
        addSystemMessage(`💌 Whisper an ${args[0]} gesendet`);
        break;

      case '/marker':
        const markerDesc = args.join(' ') || '';
        twitchChat.sendMessage(`/marker ${markerDesc}`);
        addSystemMessage(`📍 Stream-Marker gesetzt${markerDesc ? `: ${markerDesc}` : ''}`);
        break;

      case '/shield':
        twitchChat.sendMessage('/shield');
        addSystemMessage('🛡️ Shield-Mode aktiviert');
        break;

      case '/shieldoff':
        twitchChat.sendMessage('/shieldoff');
        addSystemMessage('✅ Shield-Mode deaktiviert');
        break;

      case '/warn':
        if (args.length < 2) {
          addSystemMessage('❌ Verwendung: /warn <username> <grund>');
          return;
        }
        twitchChat.sendMessage(command);
        addSystemMessage(`⚠️ ${args[0]} wurde verwarnt`);
        break;

      case '/requests':
        twitchChat.sendMessage('/requests');
        addSystemMessage('📋 Mod-Anfragen angezeigt');
        break;

      case '/mods':
        twitchChat.sendMessage('/mods');
        addSystemMessage('🛡️ Moderatoren-Liste angezeigt');
        break;

      case '/vips':
        twitchChat.sendMessage('/vips');
        addSystemMessage('💎 VIP-Liste angezeigt');
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
      '📋 Verfügbare Befehle (1/3):',
      '/raid <user> - Raiden',
      '/host <user> - Hosten',
      '/mod <user> - Mod geben/entfernen',
      '/vip <user> - VIP geben/entfernen',
      '/ban <user> [grund] - Bannen',
      '/unban <user> - Entbannen',
      '/timeout <user> <sec> - Timeout',
      '/warn <user> <grund> - Verwarnen',
      '',
      '📋 Verfügbare Befehle (2/3):',
      '/clear - Chat leeren',
      '/slow <sec> - Slow-Mode',
      '/followers <min> - Follower-Only',
      '/subscribers - Sub-Only',
      '/emoteonly - Emote-Only',
      '/uniquechat - R9K-Mode',
      '/shield - Shield-Mode',
      '',
      '📋 Verfügbare Befehle (3/3):',
      '/announce <text> - Ankündigung',
      '/announceblue/green/orange/purple - Farbige Ankündigung',
      '/me <aktion> - Aktion',
      '/w <user> <text> - Whisper',
      '/color <farbe> - Farbe ändern',
      '/marker [text] - Stream-Marker',
      '/commercial <sec> - Werbung',
      '/mods - Moderatoren anzeigen',
      '/vips - VIPs anzeigen'
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

  const handleUsernameClick = (e: React.MouseEvent, msg: ChatMessage) => {
    if (msg.username === 'Du' || msg.username === 'System') return;
    
    // Rechtsklick oder Ctrl+Click öffnet Moderation-Fenster
    if (e.button === 2 || e.ctrlKey) {
      e.preventDefault();
      
      // Öffne separates Electron-Fenster
      if (window.electron?.openUserModal) {
        // Lade ALLE Nachrichten des Users aus der History
        import('../../services/UserMessageHistoryService').then(({ userMessageHistoryService }) => {
          let allUserMessages = userMessageHistoryService.getUserMessages(msg.username);
          
          // Fallback: Wenn History leer ist, verwende aktuelle Chat-Nachrichten
          if (allUserMessages.length === 0) {
            console.log('⚠️ History leer, verwende aktuelle Chat-Nachrichten');
            allUserMessages = messages.filter(m => m.username.toLowerCase() === msg.username.toLowerCase());
          }
          
          console.log('📝 Lade User-Messages für:', msg.username, '- Anzahl:', allUserMessages.length);
          
          // Serialisiere Messages für IPC (Date -> ISO String)
          const serializedMessages = allUserMessages.map(m => ({
            ...m,
            timestamp: m.timestamp.toISOString()
          }));
          
          if (window.electron?.openUserModal) {
            window.electron.openUserModal({
              username: msg.username,
              userId: msg.tags?.['user-id'],
              userColor: msg.color,
              messages: serializedMessages
            });
          }
        });
      } else {
        // Fallback für Browser (Dev-Modus ohne Electron)
        setSelectedUserForModeration({
          username: msg.username,
          userId: msg.tags?.['user-id'],
          color: msg.color
        });
      }
      return;
    }
    
    // Normaler Klick öffnet UserCard
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setSelectedUser({
      username: msg.username,
      color: msg.color,
      badges: msg.badges || '',
      position: {
        x: rect.left,
        y: rect.bottom + 5
      }
    });
  };

  return (
    <div className="h-full flex flex-col relative">
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
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={toggleSlowMode}
            className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              slowModeActive 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'theme-button theme-text-secondary hover:theme-text'
            }`}
            title={slowModeActive ? `Slow Mode aktiv (${slowModeSeconds}s)` : 'Slow Mode aktivieren'}
          >
            <span>🐌</span>
            <span>{slowModeActive ? `${slowModeSeconds}s` : 'Slow'}</span>
          </button>
          <button
            onClick={toggleEmoteOnly}
            className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              emoteOnlyActive 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'theme-button theme-text-secondary hover:theme-text'
            }`}
            title={emoteOnlyActive ? 'Emote-Only aktiv' : 'Emote-Only aktivieren'}
          >
            <span>😀</span>
            <span>{emoteOnlyActive ? 'Emote' : 'Emote'}</span>
          </button>
          <button
            onClick={toggleAutoScroll}
            className={`text-xs px-2 py-1 theme-button rounded flex items-center gap-1 ${autoScroll ? 'theme-text' : 'theme-text-secondary'}`}
            title="Auto-Scroll ein/ausblenden"
          >
            <span>{autoScroll ? '📜' : '⏸️'}</span>
            <span>{autoScroll ? 'Auto' : 'Manuell'}</span>
          </button>
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
      
      {/* Scroll-to-Bottom Button */}
      {showScrollButton && !autoScroll && (
        <button
          onClick={() => {
            scrollToBottom();
            setAutoScroll(true);
            localStorage.setItem('chat-auto-scroll', JSON.stringify(true));
          }}
          className="absolute bottom-20 right-4 z-10 px-4 py-2 rounded-full shadow-lg transition-all hover:scale-110"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#FFFFFF'
          }}
          title="Zu neuen Nachrichten springen"
        >
          <span className="flex items-center gap-2">
            <span>↓</span>
            <span className="text-sm font-semibold">Neue Nachrichten</span>
          </span>
        </button>
      )}
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
        {messages.map(msg => {
          // Raid-Banner (wie im Twitch Chat)
          if (msg.isRaidNotice) {
            return (
              <div 
                key={msg.id}
                className="px-4 py-3 rounded mb-2 border-l-4"
                style={{
                  backgroundColor: 'rgba(145, 71, 255, 0.15)',
                  borderLeftColor: '#9147FF'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚀</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg" style={{ color: '#9147FF' }}>
                      Raid gestartet!
                    </div>
                    <div className="theme-text text-sm mt-1">
                      Du raidest jetzt <span className="font-semibold">{msg.raidTarget}</span>
                    </div>
                    <div className="theme-text-secondary text-xs mt-1">
                      Deine Zuschauer werden zu {msg.raidTarget} weitergeleitet
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Watch Streak (Zuschauer-Serie)
          if (msg.noticeType === 'watch-streak') {
            return (
              <div 
                key={msg.id}
                className="px-4 py-3 rounded mb-2 border-l-4"
                style={{
                  backgroundColor: 'rgba(147, 51, 234, 0.15)',
                  borderLeftColor: '#9333EA'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔥</span>
                  <div className="flex-1">
                    <div className="font-bold text-base" style={{ color: '#9333EA' }}>
                      Zuschauerserie erreicht!
                    </div>
                    <div className="theme-text text-sm mt-1">
                      {msg.message}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Channel Points Redemption
          if (msg.noticeType === 'channel-points') {
            return (
              <div 
                key={msg.id}
                className="px-4 py-3 rounded mb-2 border-l-4"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  borderLeftColor: '#22C55E'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💎</span>
                  <div className="flex-1">
                    <div className="font-bold text-base" style={{ color: '#22C55E' }}>
                      Kanalpunkte eingelöst
                    </div>
                    <div className="theme-text text-sm mt-1">
                      {msg.message}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Highlighted Message
          if (msg.noticeType === 'highlighted-message') {
            return (
              <div 
                key={msg.id}
                className="px-4 py-3 rounded mb-2 border-l-4"
                style={{
                  backgroundColor: 'rgba(251, 191, 36, 0.15)',
                  borderLeftColor: '#FBBF24'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  <div className="flex-1">
                    <div className="font-bold text-base" style={{ color: '#FBBF24' }}>
                      Hervorgehobene Nachricht
                    </div>
                    <div className="theme-text text-sm mt-1">
                      <span className="font-semibold" style={{ color: msg.color }}>{msg.username}</span>: {msg.message}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Normale Nachricht
          return (
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
                <span 
                  style={{ color: msg.color }} 
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={(e) => handleUsernameClick(e, msg)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    
                    // Öffne separates Electron-Fenster
                    if (window.electron?.openUserModal) {
                      // Lade ALLE Nachrichten des Users aus der History
                      import('../../services/UserMessageHistoryService').then(({ userMessageHistoryService }) => {
                        let allUserMessages = userMessageHistoryService.getUserMessages(msg.username);
                        
                        console.log('🔍 History für', msg.username, ':', allUserMessages.length, 'Nachrichten');
                        console.log('🔍 Aktuelle Chat-Messages:', messages.length);
                        console.log('🔍 Messages von', msg.username, 'im Chat:', messages.filter(m => m.username.toLowerCase() === msg.username.toLowerCase()).length);
                        
                        // Fallback: Wenn History leer ist, verwende aktuelle Chat-Nachrichten
                        if (allUserMessages.length === 0) {
                          console.log('⚠️ History leer, verwende aktuelle Chat-Nachrichten');
                          allUserMessages = messages.filter(m => m.username.toLowerCase() === msg.username.toLowerCase());
                        }
                        
                        console.log('📝 Lade User-Messages für:', msg.username, '- Anzahl:', allUserMessages.length);
                        
                        // Serialisiere Messages für IPC (Date -> ISO String)
                        const serializedMessages = allUserMessages.map(m => ({
                          ...m,
                          timestamp: m.timestamp.toISOString()
                        }));
                        
                        console.log('📤 Sende an Modal:', serializedMessages.length, 'Nachrichten');
                        
                        if (window.electron?.openUserModal) {
                          window.electron.openUserModal({
                            username: msg.username,
                            userId: msg.tags?.['user-id'],
                            userColor: msg.color,
                            messages: serializedMessages
                          });
                        }
                      });
                    } else {
                      // Fallback für Browser (Dev-Modus ohne Electron)
                      setSelectedUserForModeration({
                        username: msg.username,
                        userId: msg.tags?.['user-id'],
                        color: msg.color
                      });
                    }
                  }}
                  title="Linksklick: User-Info | Rechtsklick: Moderation"
                >
                  {msg.username}
                </span>
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
          );
        })}
        <div ref={messagesEndRef} style={{ height: '1px' }} />
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

      {/* User Card Popup */}
      {selectedUser && (
        <UserCard
          username={selectedUser.username}
          color={selectedUser.color}
          badges={selectedUser.badges}
          position={selectedUser.position}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* User Moderation Modal */}
      {selectedUserForModeration && (
        <UserModerationModal
          username={selectedUserForModeration.username}
          userId={selectedUserForModeration.userId}
          userColor={selectedUserForModeration.color}
          onClose={() => setSelectedUserForModeration(null)}
          allMessages={messages}
        />
      )}
    </div>
  );
}
