// Twitch IRC Chat Service für echte Chat-Nachrichten
export class TwitchChatService {
  private static instance: TwitchChatService;
  private ws: WebSocket | null = null;
  private channel: string = '';
  private username: string = '';
  private token: string = '';
  private messageHandlers: ((message: any) => void)[] = [];
  private roomStateHandlers: ((state: any) => void)[] = [];
  private isConnected = false;

  private constructor() {}

  static getInstance(): TwitchChatService {
    if (!TwitchChatService.instance) {
      TwitchChatService.instance = new TwitchChatService();
    }
    return TwitchChatService.instance;
  }

  connect(channel: string, username: string, token: string) {
    this.channel = channel.toLowerCase();
    this.username = username.toLowerCase();
    this.token = token;

    console.log('🔌 Verbinde zum Chat...', { channel, username });

    // Verbinde zu Twitch IRC über WebSocket
    this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    this.ws.onopen = () => {
      console.log('🎮 Twitch Chat WebSocket verbunden');
      // Authentifiziere
      this.send(`PASS oauth:${this.token}`);
      this.send(`NICK ${this.username}`);
      // Request Capabilities für Tags (Badges, Emotes, etc.)
      this.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
      // Join Channel
      this.send(`JOIN #${this.channel}`);
      console.log('📝 Join-Befehl gesendet für #' + this.channel);
    };

    this.ws.onmessage = (event) => {
      const messages = event.data.split('\r\n');
      messages.forEach((msg: string) => {
        if (msg) {
          this.handleMessage(msg);
        }
      });
    };

    this.ws.onerror = (error) => {
      console.error('❌ Chat Fehler:', error);
    };

    this.ws.onclose = (event) => {
      console.log('🔌 Chat getrennt', event.code, event.reason);
      this.isConnected = false;
      // Auto-Reconnect nach 5 Sekunden
      setTimeout(() => {
        if (this.channel && this.username && this.token) {
          console.log('🔄 Versuche Reconnect...');
          this.connect(this.channel, this.username, this.token);
        }
      }, 5000);
    };
  }

  private send(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message + '\r\n');
    }
  }

  private handleMessage(rawMessage: string) {
    console.log('📨 IRC:', rawMessage.substring(0, 100)); // Log erste 100 Zeichen
    
    // Antworte auf PING
    if (rawMessage.startsWith('PING')) {
      this.send('PONG :tmi.twitch.tv');
      return;
    }

    // Parse IRC Message
    if (rawMessage.includes('PRIVMSG')) {
      const parsed = this.parseMessage(rawMessage);
      if (parsed) {
        console.log('💬 Chat-Nachricht:', parsed);
        this.messageHandlers.forEach(handler => handler(parsed));
      }
    }

    // Parse USERNOTICE (Subs, Raids, etc.)
    if (rawMessage.includes('USERNOTICE')) {
      const parsed = this.parseUserNotice(rawMessage);
      if (parsed) {
        console.log('🎉 User-Notice:', parsed);
        this.messageHandlers.forEach(handler => handler(parsed));
      }
    }

    // Erfolgreiche Verbindung
    if (rawMessage.includes('001')) {
      this.isConnected = true;
      console.log('✅ Chat erfolgreich verbunden und authentifiziert');
    }
    
    // Channel Join bestätigt
    if (rawMessage.includes('JOIN')) {
      console.log('✅ Channel erfolgreich beigetreten');
    }
    
    // ROOMSTATE - Chat-Modus-Änderungen
    if (rawMessage.includes('ROOMSTATE')) {
      const parsed = this.parseRoomState(rawMessage);
      if (parsed) {
        console.log('🏠 ROOMSTATE Update:', parsed);
        this.roomStateHandlers.forEach(handler => handler(parsed));
      }
    }
  }

  private parseMessage(rawMessage: string) {
    try {
      // Parse IRC Tags
      const tagMatch = rawMessage.match(/^@([^ ]+) /);
      const tags: any = {};
      
      if (tagMatch) {
        const tagString = tagMatch[1];
        tagString.split(';').forEach(tag => {
          const [key, value] = tag.split('=');
          tags[key] = value;
        });
      }

      // Parse Username
      const userMatch = rawMessage.match(/:([^!]+)!/);
      const username = userMatch ? userMatch[1] : 'Unknown';

      // Parse Message
      const messageMatch = rawMessage.match(/PRIVMSG #[^ ]+ :(.+)/);
      const message = messageMatch ? messageMatch[1] : '';

      // Parse Badges
      const badges = tags['badges'] || '';
      const isMod = tags['mod'] === '1' || badges.includes('moderator');
      const isVip = badges.includes('vip');
      const isSubscriber = tags['subscriber'] === '1' || badges.includes('subscriber') || badges.includes('founder');
      const isFirstMessage = tags['first-msg'] === '1';

      return {
        id: tags['id'] || Date.now().toString(),
        username: tags['display-name'] || username,
        message: message,
        color: tags['color'] || this.getRandomColor(),
        badges: badges,
        isMod: isMod,
        isVip: isVip,
        isSubscriber: isSubscriber,
        isFirstMessage: isFirstMessage,
        timestamp: new Date(),
        tags: tags, // Füge alle Tags hinzu für Bits, Subs, etc.
        bits: tags['bits'] || null // Bits explizit hinzufügen
      };
    } catch (error) {
      console.error('Fehler beim Parsen der Nachricht:', error);
      return null;
    }
  }

  private parseUserNotice(rawMessage: string) {
    try {
      // Parse IRC Tags
      const tagMatch = rawMessage.match(/^@([^ ]+) /);
      const tags: any = {};
      
      if (tagMatch) {
        const tagString = tagMatch[1];
        tagString.split(';').forEach(tag => {
          const [key, value] = tag.split('=');
          tags[key] = value ? value.replace(/\\s/g, ' ') : value; // Decode escaped spaces
        });
      }

      // Parse Username
      const userMatch = rawMessage.match(/:([^!]+)!/);
      const username = userMatch ? userMatch[1] : tags['login'] || 'Unknown';

      // Parse Message (optional bei USERNOTICE)
      const messageMatch = rawMessage.match(/USERNOTICE #[^ ]+ :(.+)/);
      const message = messageMatch ? messageMatch[1] : '';

      // Bestimme den Typ der Nachricht
      const msgId = tags['msg-id'];
      let displayMessage = message || tags['system-msg'] || '';
      let noticeType = 'general';

      // Watch Streak (Zuschauer-Serie)
      if (msgId === 'viewermilestone') {
        const streakMonths = tags['msg-param-value'] || '?';
        const category = tags['msg-param-category'] || 'watch-streak';
        
        if (category === 'watch-streak') {
          noticeType = 'watch-streak';
          displayMessage = `${tags['display-name'] || username} hat momentan eine ${streakMonths}-Streams-Serie!`;
        }
      }

      // Channel Points Redemption
      if (msgId === 'highlighted-message') {
        noticeType = 'highlighted-message';
        displayMessage = `${tags['display-name'] || username} hat eine Nachricht hervorgehoben`;
      }

      // Custom Reward (Channel Points)
      if (msgId === 'custom-reward-id' || tags['custom-reward-id']) {
        noticeType = 'channel-points';
        const rewardTitle = tags['msg-param-reward-title'] || 'Belohnung';
        displayMessage = `${tags['display-name'] || username} hat "${rewardTitle}" eingelöst`;
        if (message) {
          displayMessage += `: ${message}`;
        }
        
        // Trigger Event für Rewards Queue
        const redemptionEvent = new CustomEvent('channel-points-redemption', {
          detail: {
            username: tags['display-name'] || username,
            userId: tags['user-id'],
            rewardId: tags['custom-reward-id'],
            rewardTitle: rewardTitle,
            userInput: message,
            timestamp: new Date()
          }
        });
        window.dispatchEvent(redemptionEvent);
      }

      // Subs, Resubs, Gift Subs
      if (msgId === 'sub' || msgId === 'resub') {
        noticeType = 'subscription';
      } else if (msgId === 'subgift' || msgId === 'submysterygift') {
        noticeType = 'gift-sub';
      } else if (msgId === 'raid') {
        noticeType = 'raid';
      }

      return {
        id: tags['id'] || Date.now().toString(),
        username: tags['display-name'] || username,
        message: displayMessage,
        color: tags['color'] || this.getRandomColor(),
        badges: tags['badges'] || '',
        timestamp: new Date(),
        tags: tags,
        bits: null,
        noticeType: noticeType, // Füge Typ hinzu
        msgId: msgId // Füge msg-id hinzu
      };
    } catch (error) {
      console.error('Fehler beim Parsen der USERNOTICE:', error);
      return null;
    }
  }

  private getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  sendMessage(message: string) {
    if (this.isConnected && this.channel) {
      this.send(`PRIVMSG #${this.channel} :${message}`);
    }
  }

  // Mod-Befehle
  deleteMessage(messageId: string) {
    if (this.isConnected && this.channel) {
      const command = `/delete ${messageId}`;
      console.log('🗑️ Sende Delete-Befehl:', command);
      this.send(`PRIVMSG #${this.channel} :${command}`);
      console.log('✅ Delete-Befehl gesendet für Message-ID:', messageId);
    } else {
      console.error('❌ Nicht verbunden oder kein Channel');
    }
  }

  timeoutUser(username: string, duration: number) {
    if (this.isConnected && this.channel) {
      const command = `/timeout ${username} ${duration}`;
      console.log('⏱️ Sende Timeout-Befehl:', command);
      this.send(`PRIVMSG #${this.channel} :${command}`);
      console.log(`✅ Timeout-Befehl gesendet für ${username} (${duration}s)`);
    } else {
      console.error('❌ Nicht verbunden oder kein Channel');
    }
  }

  banUser(username: string) {
    if (this.isConnected && this.channel) {
      const command = `/ban ${username}`;
      console.log('🚫 Sende Ban-Befehl:', command);
      this.send(`PRIVMSG #${this.channel} :${command}`);
      console.log(`✅ Ban-Befehl gesendet für ${username}`);
    } else {
      console.error('❌ Nicht verbunden oder kein Channel');
    }
  }

  onMessage(handler: (message: any) => void) {
    this.messageHandlers.push(handler);
  }

  onRoomState(handler: (state: any) => void) {
    this.roomStateHandlers.push(handler);
  }

  private parseRoomState(rawMessage: string) {
    try {
      // Parse IRC Tags
      const tagMatch = rawMessage.match(/^@([^ ]+) /);
      if (!tagMatch) return null;

      const tags: any = {};
      const tagString = tagMatch[1];
      tagString.split(';').forEach(tag => {
        const [key, value] = tag.split('=');
        tags[key] = value;
      });

      return {
        emoteOnly: tags['emote-only'] === '1',
        followersOnly: tags['followers-only'] !== '-1',
        r9k: tags['r9k'] === '1',
        slow: parseInt(tags['slow'] || '0'),
        subsOnly: tags['subs-only'] === '1'
      };
    } catch (error) {
      console.error('Fehler beim Parsen von ROOMSTATE:', error);
      return null;
    }
  }

  disconnect() {
    if (this.ws) {
      this.send(`PART #${this.channel}`);
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

// Singleton - verwende getInstance() statt direkter Instanziierung
export const twitchChat = TwitchChatService.getInstance();
