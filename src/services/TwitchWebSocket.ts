// Twitch EventSub WebSocket Service für Echtzeit-Events
export class TwitchWebSocketService {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventHandlers: Map<string, Function[]> = new Map();

  connect() {
    const wsUrl = 'wss://eventsub.wss.twitch.tv/ws';
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('✅ Twitch WebSocket verbunden');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket Fehler:', error);
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket getrennt');
      this.attemptReconnect();
    };
  }

  private handleMessage(message: any) {
    const { metadata, payload } = message;

    switch (metadata?.message_type) {
      case 'session_welcome':
        this.sessionId = payload.session.id;
        console.log('🎉 Session ID erhalten:', this.sessionId);
        this.emit('session_ready', this.sessionId);
        break;
        
      case 'notification':
        this.handleNotification(payload);
        break;
        
      case 'session_keepalive':
        // Keepalive erhalten - alles gut
        break;
        
      case 'session_reconnect':
        console.log('🔄 Reconnect angefordert');
        this.reconnect(payload.session.reconnect_url);
        break;
    }
  }

  private handleNotification(payload: any) {
    const eventType = payload.subscription.type;
    const eventData = payload.event;

    console.log('📢 Event erhalten:', eventType, eventData);
    this.emit(eventType, eventData);
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = 2000 * this.reconnectAttempts;
      console.log(`🔄 Reconnect Versuch ${this.reconnectAttempts} in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('❌ Max Reconnect-Versuche erreicht');
    }
  }

  private reconnect(url: string) {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new WebSocket(url);
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  private emit(event: string, data: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

// Singleton-Instanz
export const twitchWebSocket = new TwitchWebSocketService();
