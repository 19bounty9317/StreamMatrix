export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(sessionId: string) {
    const wsUrl = 'wss://eventsub.wss.twitch.tv/ws';
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket verbunden');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Fehler:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket getrennt');
      this.attemptReconnect(sessionId);
    };
  }

  private handleMessage(message: any) {
    const { metadata, payload } = message;

    switch (metadata?.message_type) {
      case 'session_welcome':
        console.log('Session ID:', payload.session.id);
        break;
      case 'notification':
        this.handleNotification(payload);
        break;
      case 'session_keepalive':
        // Keepalive erhalten
        break;
    }
  }

  private handleNotification(payload: any) {
    console.log('Event erhalten:', payload);
    // Hier Events verarbeiten (Follow, Sub, Bits, etc.)
  }

  private attemptReconnect(sessionId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnect Versuch ${this.reconnectAttempts}...`);
        this.connect(sessionId);
      }, 2000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
