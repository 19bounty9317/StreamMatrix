/**
 * Twitch EventSub WebSocket Service
 * 
 * Verbindet sich mit Twitch EventSub WebSocket API für Echtzeit-Events:
 * - Channel Points Redemptions
 * - Follows, Subs, Raids, etc.
 * 
 * Dokumentation: https://dev.twitch.tv/docs/eventsub/handling-websocket-events/
 */

import { TwitchService } from './TwitchService';

interface EventSubMessage {
  metadata: {
    message_id: string;
    message_type: string;
    message_timestamp: string;
    subscription_type?: string;
    subscription_version?: string;
  };
  payload: any;
}

interface EventSubSubscription {
  type: string;
  version: string;
  condition: Record<string, string>;
  transport: {
    method: 'websocket';
    session_id: string;
  };
}

export class TwitchEventSubService {
  private static ws: WebSocket | null = null;
  private static sessionId: string | null = null;
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 5;
  private static reconnectDelay = 1000;
  private static subscriptions: Set<string> = new Set();
  private static keepaliveTimeout: NodeJS.Timeout | null = null;
  private static isConnecting = false;

  /**
   * Startet die EventSub WebSocket Verbindung
   */
  static async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      console.log('⚠️ EventSub: Bereits verbunden oder Verbindung läuft');
      return;
    }

    this.isConnecting = true;
    console.log('🔌 EventSub: Verbinde mit Twitch WebSocket...');

    try {
      this.ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws');

      this.ws.onopen = () => {
        console.log('✅ EventSub: WebSocket verbunden');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws.onerror = (error) => {
        console.error('❌ EventSub: WebSocket Fehler:', error);
      };

      this.ws.onclose = (event) => {
        console.log('🔌 EventSub: WebSocket geschlossen', event.code, event.reason);
        this.isConnecting = false;
        this.sessionId = null;
        
        if (this.keepaliveTimeout) {
          clearTimeout(this.keepaliveTimeout);
          this.keepaliveTimeout = null;
        }

        // Auto-Reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
          console.log(`🔄 EventSub: Reconnect in ${delay}ms (Versuch ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.connect(), delay);
        }
      };
    } catch (error) {
      console.error('❌ EventSub: Verbindungsfehler:', error);
      this.isConnecting = false;
    }
  }

  /**
   * Trennt die WebSocket Verbindung
   */
  static disconnect(): void {
    if (this.ws) {
      console.log('🔌 EventSub: Trenne Verbindung...');
      this.ws.close();
      this.ws = null;
      this.sessionId = null;
      this.subscriptions.clear();
      
      if (this.keepaliveTimeout) {
        clearTimeout(this.keepaliveTimeout);
        this.keepaliveTimeout = null;
      }
    }
  }

  /**
   * Verarbeitet eingehende WebSocket Nachrichten
   */
  private static handleMessage(message: EventSubMessage): void {
    const { metadata, payload } = message;

    switch (metadata.message_type) {
      case 'session_welcome':
        this.handleSessionWelcome(payload);
        break;

      case 'session_keepalive':
        this.handleKeepalive();
        break;

      case 'notification':
        this.handleNotification(metadata, payload);
        break;

      case 'session_reconnect':
        this.handleReconnect(payload);
        break;

      case 'revocation':
        console.warn('⚠️ EventSub: Subscription widerrufen:', payload);
        break;

      default:
        console.log('📨 EventSub: Unbekannter Message Type:', metadata.message_type);
    }
  }

  /**
   * Session Welcome - Empfängt Session ID
   */
  private static async handleSessionWelcome(payload: any): Promise<void> {
    this.sessionId = payload.session.id;
    this.isConnecting = false;
    console.log('✅ EventSub: Session ID erhalten:', this.sessionId);

    // Setze Keepalive Timeout
    const keepaliveTimeout = payload.session.keepalive_timeout_seconds || 10;
    this.resetKeepaliveTimeout(keepaliveTimeout);

    // Erstelle Subscriptions
    await this.createSubscriptions();
  }

  /**
   * Keepalive - Server sendet regelmäßig Keepalive
   */
  private static handleKeepalive(): void {
    console.log('💓 EventSub: Keepalive empfangen');
    this.resetKeepaliveTimeout(10);
  }

  /**
   * Setzt Keepalive Timeout zurück
   */
  private static resetKeepaliveTimeout(seconds: number): void {
    if (this.keepaliveTimeout) {
      clearTimeout(this.keepaliveTimeout);
    }

    // Wenn kein Keepalive nach timeout + grace period, reconnect
    this.keepaliveTimeout = setTimeout(() => {
      console.warn('⚠️ EventSub: Keepalive Timeout - Reconnecting...');
      this.disconnect();
      this.connect();
    }, (seconds + 5) * 1000);
  }

  /**
   * Notification - Event empfangen
   */
  private static handleNotification(metadata: any, payload: any): void {
    const eventType = metadata.subscription_type;
    console.log(`📬 EventSub: ${eventType}`, payload.event);

    // Dispatche Custom Event für die App
    const customEvent = new CustomEvent('eventsub-notification', {
      detail: {
        type: eventType,
        event: payload.event,
        subscription: payload.subscription
      }
    });
    window.dispatchEvent(customEvent);

    // Spezifische Handler
    switch (eventType) {
      case 'channel.channel_points_custom_reward_redemption.add':
        this.handleRedemptionAdd(payload.event);
        break;
      
      case 'channel.channel_points_custom_reward_redemption.update':
        this.handleRedemptionUpdate(payload.event);
        break;

      case 'channel.follow':
        this.handleFollow(payload.event);
        break;

      case 'channel.subscribe':
      case 'channel.subscription.gift':
      case 'channel.subscription.message':
        this.handleSubscription(payload.event);
        break;

      case 'channel.raid':
        this.handleRaid(payload.event);
        break;
    }
  }

  /**
   * Reconnect - Server fordert Reconnect an
   */
  private static handleReconnect(payload: any): void {
    console.log('🔄 EventSub: Server fordert Reconnect an');
    const reconnectUrl = payload.session.reconnect_url;
    
    if (reconnectUrl) {
      // Schließe alte Verbindung
      if (this.ws) {
        this.ws.close();
      }
      
      // Verbinde zu neuer URL
      this.ws = new WebSocket(reconnectUrl);
      this.setupWebSocketHandlers();
    }
  }

  /**
   * Setup WebSocket Event Handlers
   */
  private static setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };

    this.ws.onerror = (error) => {
      console.error('❌ EventSub: WebSocket Fehler:', error);
    };

    this.ws.onclose = () => {
      console.log('🔌 EventSub: WebSocket geschlossen');
      this.sessionId = null;
    };
  }

  /**
   * Erstellt alle benötigten Subscriptions
   */
  private static async createSubscriptions(): Promise<void> {
    if (!this.sessionId) {
      console.error('❌ EventSub: Keine Session ID vorhanden');
      return;
    }

    const user = TwitchService.getUserFromStorage();
    if (!user) {
      console.error('❌ EventSub: Kein User eingeloggt');
      return;
    }

    console.log('📝 EventSub: Erstelle Subscriptions für User:', user.id);

    // Channel Points Redemptions
    await this.subscribe('channel.channel_points_custom_reward_redemption.add', '1', {
      broadcaster_user_id: user.id
    });

    await this.subscribe('channel.channel_points_custom_reward_redemption.update', '1', {
      broadcaster_user_id: user.id
    });

    // Weitere Events (optional)
    // await this.subscribe('channel.follow', '2', {
    //   broadcaster_user_id: user.id,
    //   moderator_user_id: user.id
    // });
  }

  /**
   * Erstellt eine EventSub Subscription
   */
  private static async subscribe(
    type: string,
    version: string,
    condition: Record<string, string>
  ): Promise<void> {
    if (!this.sessionId) {
      console.error('❌ EventSub: Keine Session ID für Subscription');
      return;
    }

    const subscriptionKey = `${type}:${JSON.stringify(condition)}`;
    if (this.subscriptions.has(subscriptionKey)) {
      console.log('⚠️ EventSub: Subscription bereits vorhanden:', type);
      return;
    }

    try {
      const token = TwitchService.getStoredToken();
      if (!token) {
        console.error('❌ EventSub: Kein Token vorhanden');
        return;
      }

      const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': TwitchService.getClientId(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          version,
          condition,
          transport: {
            method: 'websocket',
            session_id: this.sessionId
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.subscriptions.add(subscriptionKey);
        console.log(`✅ EventSub: Subscription erstellt: ${type}`, data);
      } else {
        const error = await response.json();
        console.error(`❌ EventSub: Subscription Fehler (${type}):`, error);
      }
    } catch (error) {
      console.error(`❌ EventSub: Subscription Fehler (${type}):`, error);
    }
  }

  /**
   * Handler für neue Redemption
   */
  private static handleRedemptionAdd(event: any): void {
    console.log('🎁 Neue Redemption:', event);
    
    // Dispatche Event für TileRewardsQueue
    const customEvent = new CustomEvent('channel-points-redemption-add', {
      detail: event
    });
    window.dispatchEvent(customEvent);

    // Sende Chat-Nachricht
    const message = event.user_input 
      ? `${event.user_name} hat "${event.reward.title}" für ${event.reward.cost.toLocaleString('de-DE')} Punkte eingelöst: "${event.user_input}"`
      : `${event.user_name} hat "${event.reward.title}" für ${event.reward.cost.toLocaleString('de-DE')} Punkte eingelöst`;

    const chatMessage = {
      id: event.id,
      username: event.user_name,
      message: message,
      timestamp: new Date(event.redeemed_at),
      color: '#22C55E', // Grün für Channel Points
      badges: '',
      noticeType: 'channel-points',
      tags: {}
    };

    // Dispatche als Chat-Nachricht
    const chatEvent = new CustomEvent('chat-message', {
      detail: chatMessage
    });
    window.dispatchEvent(chatEvent);
  }

  /**
   * Handler für Redemption Update
   */
  private static handleRedemptionUpdate(event: any): void {
    console.log('🔄 Redemption Update:', event);
    
    const customEvent = new CustomEvent('channel-points-redemption-update', {
      detail: event
    });
    window.dispatchEvent(customEvent);
  }

  /**
   * Handler für Follow
   */
  private static handleFollow(event: any): void {
    console.log('👤 Neuer Follow:', event);
    
    const customEvent = new CustomEvent('channel-follow', {
      detail: event
    });
    window.dispatchEvent(customEvent);
  }

  /**
   * Handler für Subscription
   */
  private static handleSubscription(event: any): void {
    console.log('⭐ Neue Subscription:', event);
    
    const customEvent = new CustomEvent('channel-subscription', {
      detail: event
    });
    window.dispatchEvent(customEvent);
  }

  /**
   * Handler für Raid
   */
  private static handleRaid(event: any): void {
    console.log('🎯 Raid:', event);
    
    const customEvent = new CustomEvent('channel-raid', {
      detail: event
    });
    window.dispatchEvent(customEvent);
  }

  /**
   * Gibt den aktuellen Verbindungsstatus zurück
   */
  static isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN && this.sessionId !== null;
  }

  /**
   * Gibt die Session ID zurück
   */
  static getSessionId(): string | null {
    return this.sessionId;
  }
}
