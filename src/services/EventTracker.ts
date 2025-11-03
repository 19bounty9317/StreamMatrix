// Service zum Tracken von Events und Triggern von Notifications
import NotificationService from './NotificationService';
import { TwitchService } from './TwitchService';

class EventTracker {
  private static instance: EventTracker;
  private lastFollowerCount = 0;
  private lastSubCount = 0;
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): EventTracker {
    if (!EventTracker.instance) {
      EventTracker.instance = new EventTracker();
    }
    return EventTracker.instance;
  }

  startTracking(userId: string) {
    this.stopTracking();

    // Initiale Werte laden
    this.loadInitialCounts(userId);

    // Prüfe alle 30 Sekunden auf neue Events
    this.checkInterval = setInterval(() => {
      this.checkForNewEvents(userId);
    }, 30000);
  }

  stopTracking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async loadInitialCounts(userId: string) {
    try {
      this.lastFollowerCount = await TwitchService.getFollowerCount(userId);
      this.lastSubCount = await TwitchService.getSubscriberCount(userId);
    } catch (error) {
      console.error('Fehler beim Laden der initialen Counts:', error);
    }
  }

  private async checkForNewEvents(userId: string) {
    try {
      const notificationService = NotificationService.getInstance();

      // Prüfe neue Follower
      const currentFollowers = await TwitchService.getFollowerCount(userId);

      if (currentFollowers > this.lastFollowerCount) {
        const newFollowers = currentFollowers - this.lastFollowerCount;
        
        // Hole die neuesten Follower
        const recentFollowers = await TwitchService.getRecentFollowers(userId, newFollowers);
        
        recentFollowers.forEach((follower: any) => {
          notificationService.showAlert({
            type: 'follower',
            username: follower.user_name,
            timestamp: new Date(follower.followed_at)
          });
        });
        
        this.lastFollowerCount = currentFollowers;
      }

      // Prüfe neue Subs
      const currentSubs = await TwitchService.getSubscriberCount(userId);
      if (currentSubs > this.lastSubCount) {
        const newSubs = currentSubs - this.lastSubCount;
        
        notificationService.showAlert({
          type: 'subscriber',
          username: 'Neuer Subscriber',
          amount: newSubs,
          timestamp: new Date()
        });
        
        this.lastSubCount = currentSubs;
      }
    } catch (error) {
      console.error('Fehler beim Prüfen auf neue Events:', error);
    }
  }

  // Manuell Events triggern (z.B. aus Chat-Nachrichten)
  triggerEvent(type: 'follower' | 'subscriber' | 'bits' | 'raid', username: string, amount?: number) {
    const notificationService = NotificationService.getInstance();
    notificationService.showAlert({
      type,
      username,
      amount,
      timestamp: new Date()
    });
  }
}

export default EventTracker;
