// Service zum Tracken von Stream-Session Statistiken

interface SessionStats {
  startFollowers: number;
  startSubs: number;
  currentFollowers: number;
  currentSubs: number;
  sessionStartTime: string;
  isLive: boolean;
  isReal?: boolean; // Flag ob Daten echt sind (Stream 10+ Min live)
  viewerHistory?: number[]; // Historie der Viewer-Zahlen
  peakViewers?: number; // Höchste Viewer-Zahl
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
        isLive: true,
        viewerHistory: [],
        peakViewers: 0
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

  async endSession(avgViewers?: number, peakViewers?: number) {
    if (this.stats) {
      // Berechne Stream-Dauer
      const startTime = new Date(this.stats.sessionStartTime);
      const endTime = new Date();
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);
      
      // Markiere als "echt" wenn Stream mindestens 10 Minuten live war
      if (durationMinutes >= 10) {
        this.stats.isReal = true;
        console.log('✅ Stream war 10+ Minuten live - markiere als echte Daten');
      } else {
        console.log('⚠️ Stream war < 10 Minuten live - markiere als Test-Daten');
      }
      
      this.stats.isLive = false;
      this.saveSession();
      
      // Verwende berechnete Werte wenn nicht übergeben
      const finalAvgViewers = avgViewers !== undefined ? avgViewers : this.getAverageViewers();
      const finalPeakViewers = peakViewers !== undefined ? peakViewers : this.getPeakViewers();
      
      // Speichere Session in Historie
      await this.saveToHistory(finalAvgViewers, finalPeakViewers);
      
      console.log('📊 Stream-Session beendet:', this.stats);
      console.log(`📊 Viewer-Stats: Ø ${finalAvgViewers}, Peak ${finalPeakViewers}`);
      
      // Lösche Session nach Speicherung
      this.clearSession();
    }
  }

  private async saveToHistory(avgViewers: number, peakViewers: number) {
    if (!this.stats) return;

    try {
      const startTime = new Date(this.stats.sessionStartTime);
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60); // Minuten

      const session = {
        date: startTime.toISOString().split('T')[0], // YYYY-MM-DD
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        avgViewers,
        peakViewers,
        newFollowers: this.getFollowerDiff(),
        newSubs: this.getSubDiff(),
        isReal: this.stats.isReal || false // Übernehme isReal Flag
      };

      // Lade bestehende Historie
      const saved = localStorage.getItem('stream-history');
      const history = saved ? JSON.parse(saved) : [];

      // Füge neue Session hinzu
      history.push(session);

      // Behalte nur die letzten 90 Tage
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const filtered = history.filter((s: any) => new Date(s.date) >= ninetyDaysAgo);

      // Speichere
      localStorage.setItem('stream-history', JSON.stringify(filtered));
      console.log('📊 Session in Historie gespeichert:', session);
    } catch (error) {
      console.error('Fehler beim Speichern der Historie:', error);
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

  // Reset Session (für Test-Modus beenden)
  resetSession() {
    if (this.stats) {
      // Setze current auf start zurück
      this.stats.currentFollowers = this.stats.startFollowers;
      this.stats.currentSubs = this.stats.startSubs;
      this.saveSession();
    }
  }

  // Lösche Session komplett
  clearSession() {
    this.stats = null;
    localStorage.removeItem('stream-session-stats');
    this.notifyListeners();
  }

  // Tracke Viewer-Zahl
  trackViewers(viewerCount: number) {
    if (this.stats && this.stats.isLive) {
      // Füge zur Historie hinzu
      if (!this.stats.viewerHistory) {
        this.stats.viewerHistory = [];
      }
      this.stats.viewerHistory.push(viewerCount);

      // Aktualisiere Peak
      if (!this.stats.peakViewers || viewerCount > this.stats.peakViewers) {
        this.stats.peakViewers = viewerCount;
      }

      this.saveSession();
    }
  }

  // Berechne durchschnittliche Viewer
  getAverageViewers(): number {
    if (!this.stats || !this.stats.viewerHistory || this.stats.viewerHistory.length === 0) {
      return 0;
    }
    const sum = this.stats.viewerHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.stats.viewerHistory.length);
  }

  // Hole Peak Viewer
  getPeakViewers(): number {
    return this.stats?.peakViewers || 0;
  }
}

export default StreamSessionTracker;
