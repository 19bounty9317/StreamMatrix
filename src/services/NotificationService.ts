// Service für Desktop-Benachrichtigungen und Alerts

interface AlertEvent {
  type: 'follower' | 'subscriber' | 'bits' | 'raid' | 'host' | 'donation' | 'channel-points';
  username: string;
  amount?: number;
  message?: string;
  timestamp: Date;
  id?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private enabled: boolean = true;
  private soundEnabled: boolean = true;
  private alertHistory: AlertEvent[] = [];
  private listeners: ((event: AlertEvent) => void)[] = [];

  private constructor() {
    this.requestPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  onAlert(callback: (event: AlertEvent) => void) {
    this.listeners.push(callback);
  }

  private notifyListeners(event: AlertEvent) {
    this.listeners.forEach(callback => callback(event));
  }

  showAlert(event: AlertEvent) {
    this.alertHistory.unshift(event);
    if (this.alertHistory.length > 50) {
      this.alertHistory = this.alertHistory.slice(0, 50);
    }

    this.notifyListeners(event);

    if (!this.enabled) return;

    const title = this.getAlertTitle(event);
    const body = this.getAlertBody(event);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/twitch-icon.png',
        tag: event.type
      });
    }

    if (this.soundEnabled) {
      this.playSound(event.type);
    }
  }

  private getAlertTitle(event: AlertEvent): string {
    switch (event.type) {
      case 'follower': return '🎉 Neuer Follower!';
      case 'subscriber': return '⭐ Neuer Subscriber!';
      case 'bits': return '💎 Bits erhalten!';
      case 'raid': return '🚀 Raid!';
      case 'host': return '📺 Host!';
      case 'channel-points': return '🎁 Kanalpunkte eingelöst!';
      default: return 'Benachrichtigung';
    }
  }

  private getAlertBody(event: AlertEvent): string {
    switch (event.type) {
      case 'follower': return `${event.username} folgt dir jetzt!`;
      case 'subscriber': return `${event.username} hat abonniert!`;
      case 'bits': return `${event.username} hat ${event.amount} Bits gespendet!`;
      case 'raid': return `${event.username} raidet mit ${event.amount} Zuschauern!`;
      case 'host': return `${event.username} hostet deinen Stream!`;
      case 'channel-points': return event.message || `${event.username} hat eine Belohnung eingelöst!`;
      default: return event.message || '';
    }
  }

  private playSound(type: string) {
    const audio = new Audio();
    audio.volume = 0.3;
    
    // Einfacher Beep-Sound (kann später durch echte Sounds ersetzt werden)
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Verschiedene Frequenzen für verschiedene Event-Typen
    if (type === 'raid') {
      oscillator.frequency.value = 800;
    } else if (type === 'channel-points') {
      oscillator.frequency.value = 700;
    } else {
      oscillator.frequency.value = 600;
    }
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 200);
  }

  getAlertHistory(): AlertEvent[] {
    return this.alertHistory;
  }

  clearHistory() {
    this.alertHistory = [];
  }
}

export default NotificationService;
export type { AlertEvent };
