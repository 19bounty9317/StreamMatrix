/**
 * Service zum Speichern ALLER Chat-Nachrichten pro User
 * Wird für die User-Moderation verwendet
 */

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

interface UserMessageHistory {
  [username: string]: ChatMessage[];
}

class UserMessageHistoryService {
  private static instance: UserMessageHistoryService;
  private messageHistory: UserMessageHistory = {};
  private readonly STORAGE_KEY = 'user-message-history';
  private readonly MAX_MESSAGES_PER_USER = 1000; // Max 1000 Nachrichten pro User

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): UserMessageHistoryService {
    if (!UserMessageHistoryService.instance) {
      UserMessageHistoryService.instance = new UserMessageHistoryService();
    }
    return UserMessageHistoryService.instance;
  }

  /**
   * Fügt eine neue Nachricht zur History hinzu
   */
  addMessage(message: ChatMessage): void {
    const username = message.username.toLowerCase();
    
    // Ignoriere System-Nachrichten
    if (username === 'system' || username === 'du') {
      return;
    }

    if (!this.messageHistory[username]) {
      this.messageHistory[username] = [];
    }

    // Prüfe ob Nachricht bereits existiert (verhindere Duplikate)
    const isDuplicate = this.messageHistory[username].some(m => 
      m.id === message.id || 
      (m.message === message.message && Math.abs(m.timestamp.getTime() - message.timestamp.getTime()) < 1000)
    );
    
    if (isDuplicate) {
      return;
    }

    // Füge Nachricht hinzu
    this.messageHistory[username].push(message);

    // Begrenze auf MAX_MESSAGES_PER_USER
    if (this.messageHistory[username].length > this.MAX_MESSAGES_PER_USER) {
      this.messageHistory[username] = this.messageHistory[username].slice(-this.MAX_MESSAGES_PER_USER);
    }

    // Speichere sofort (damit nichts verloren geht)
    this.saveToStorage();
  }

  /**
   * Gibt alle Nachrichten eines Users zurück
   */
  getUserMessages(username: string): ChatMessage[] {
    const key = username.toLowerCase();
    return this.messageHistory[key] || [];
  }

  /**
   * Gibt die Anzahl der Nachrichten eines Users zurück
   */
  getUserMessageCount(username: string): number {
    return this.getUserMessages(username).length;
  }

  /**
   * Löscht alle Nachrichten eines Users
   */
  clearUserMessages(username: string): void {
    const key = username.toLowerCase();
    delete this.messageHistory[key];
    this.saveToStorage();
  }

  /**
   * Löscht die komplette History
   */
  clearAll(): void {
    this.messageHistory = {};
    this.saveToStorage();
  }

  /**
   * Speichert die History im localStorage
   */
  private saveToStorage(): void {
    try {
      // Konvertiere Date-Objekte zu ISO-Strings für JSON
      const serialized: any = {};
      for (const [username, messages] of Object.entries(this.messageHistory)) {
        serialized[username] = messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }));
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serialized));
      
      const stats = this.getStats();
      console.log('💾 User Message History gespeichert:', stats.totalUsers, 'Users,', stats.totalMessages, 'Nachrichten');
    } catch (error) {
      console.error('❌ Fehler beim Speichern der Message History:', error);
    }
  }

  /**
   * Lädt die History aus dem localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Konvertiere ISO-Strings zurück zu Date-Objekten
        this.messageHistory = {};
        for (const [username, messages] of Object.entries(parsed)) {
          this.messageHistory[username] = (messages as any[]).map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
        
        const stats = this.getStats();
        console.log('✅ User Message History geladen:', stats.totalUsers, 'Users,', stats.totalMessages, 'Nachrichten');
      } else {
        console.log('📝 Keine gespeicherte Message History gefunden - starte neu');
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Message History:', error);
      this.messageHistory = {};
    }
  }

  /**
   * Gibt Statistiken zurück
   */
  getStats(): { totalUsers: number; totalMessages: number } {
    const totalUsers = Object.keys(this.messageHistory).length;
    const totalMessages = Object.values(this.messageHistory).reduce((sum, msgs) => sum + msgs.length, 0);
    return { totalUsers, totalMessages };
  }
}

export const userMessageHistoryService = UserMessageHistoryService.getInstance();
