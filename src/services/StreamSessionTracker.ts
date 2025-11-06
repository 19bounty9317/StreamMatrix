// Service zum Tracken von Stream-Session Statistiken

interface SessionStats {
  startFollowers: number;
  startSubs: number;
  currentFollowers: number;
  currentSubs: number;
  sessionStartTime: string;
  isLive: boolean;
}

class StreamSessionTracker {
  private static instance: StreamSessionTracker;
  private stats: SessionStats | null = null;
  private listeners: ((stats: SessionStats) => void)[] = [];

  private constructor() {
    this.loadSession();
  }

  static getInstance(): StreamSessionTracker {
    if (!StreamSessionTracker.instance) {
      StreamSessionTracker.instance = new StreamSessionTracker();
    }
    return StreamSessionTracker.instance;
  }

  private loadSession() {
    const saved = localStorage.getItem('stream-session-stats');
    if (saved) {
      this.stats = JSON.parse(saved);
    }
  }

  private saveSession() {
    if (this.stats) {
      localStorage.setItem('stream-session-stats', JSON.stringify(this.stats));
      this.notifyListeners();
    }
  }

  async startSession(userId: string) {
    const { TwitchService } = await import('./TwitchService');
    
    try {
      // Hole aktuelle Follower-Anzahl
      const followersResponse = await fetch(
        `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${TwitchService.getStoredToken()}`,
            'Client-Id': TwitchService.getClientId()
          }
        }
      );
      
      const followersData = await followersResponse.json();
      const followerCount = followersData.total || 0;

      // Hole aktuelle Sub-Anzahl
      const subsResponse = await fetch(
        `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${TwitchService.getStoredToken()}`,
            'Client-Id': TwitchService.getClientId()
          }
        }
      );
      
      const subsData = await subsResponse.json();
      const subCount = (subsData.total || 0) - 1; // -1 weil Broadcaster selbst nicht zählt

      this.stats = {
        startFollowers: followerCount,
        startSubs: subCount,
        currentFollowers: followerCount,
        currentSubs: subCount,
        sessionStartTime: new Date().toISOString(),
        isLive: true
      };

      this.saveSession();
      console.log('📊 Stream-Session gestartet:', this.stats);
    } catch (error) {
      console.error('Fehler beim Starten der Session:', error);
    }
  }

  async updateCurrentStats(userId: string) {
    if (!this.stats) return;

    const { TwitchService } = await import('./TwitchService');
    
    try {
      // Hole aktuelle Follower-Anzahl
      const followersResponse = await fetch(
        `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${TwitchService.getStoredToken()}`,
            'Client-Id': TwitchService.getClientId()
          }
        }
      );
      
      const followersData = await followersResponse.json();
      this.stats.currentFollowers = followersData.total || 0;

      // Hole aktuelle Sub-Anzahl
      const subsResponse = await fetch(
        `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${TwitchService.getStoredToken()}`,
            'Client-Id': TwitchService.getClientId()
          }
        }
      );
      
      const subsData = await subsResponse.json();
      this.stats.currentSubs = (subsData.total || 0) - 1;

      this.saveSession();
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Stats:', error);
    }
  }

  endSession() {
    if (this.stats) {
      this.stats.isLive = false;
      this.saveSession();
      console.log('📊 Stream-Session beendet:', this.stats);
    }
  }

  getStats(): SessionStats | null {
    return this.stats;
  }

  getFollowerDiff(): number {
    if (!this.stats) return 0;
    return this.stats.currentFollowers - this.stats.startFollowers;
  }

  getSubDiff(): number {
    if (!this.stats) return 0;
    return this.stats.currentSubs - this.stats.startSubs;
  }

  onStatsUpdate(callback: (stats: SessionStats) => void) {
    this.listeners.push(callback);
  }

  private notifyListeners() {
    if (this.stats) {
      this.listeners.forEach(listener => listener(this.stats!));
    }
  }

  // Manuell Follower/Subs ändern (für Test-Modus)
  addFollower() {
    if (this.stats) {
      this.stats.currentFollowers++;
      this.saveSession();
    }
  }

  removeFollower() {
    if (this.stats) {
      this.stats.currentFollowers--;
      this.saveSession();
    }
  }

  addSub() {
    if (this.stats) {
      this.stats.currentSubs++;
      this.saveSession();
    }
  }

  removeSub() {
    if (this.stats) {
      this.stats.currentSubs--;
      this.saveSession();
    }
  }
}

export default StreamSessionTracker;
