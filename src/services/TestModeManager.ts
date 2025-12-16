// Service zum Verwalten des Test-Modus und automatischen Cleanup

class TestModeManager {
  private static instance: TestModeManager;
  private testModeTimer: NodeJS.Timeout | null = null;
  private liveCheckTimer: NodeJS.Timeout | null = null;
  private liveStartTime: Date | null = null;
  private isStreamVerifiedLive: boolean = false;

  private constructor() {
    this.init();
  }

  static getInstance(): TestModeManager {
    if (!TestModeManager.instance) {
      TestModeManager.instance = new TestModeManager();
    }
    return TestModeManager.instance;
  }

  private init() {
    // Prüfe ob Test-Modus aktiv ist
    const isTestMode = localStorage.getItem('test-mode-active') === 'true';
    if (isTestMode) {
      this.startTestModeTimer();
    }

    // Starte Live-Check wenn Session aktiv ist
    this.startLiveCheck();
  }

  // Aktiviere Test-Modus (automatisch nach 5 Min beenden)
  activateTestMode() {
    console.log('🧪 Test-Modus aktiviert - automatisches Cleanup in 5 Minuten');
    localStorage.setItem('test-mode-active', 'true');
    localStorage.setItem('test-mode-start-time', new Date().toISOString());
    
    this.startTestModeTimer();
    
    // Trigger Event
    window.dispatchEvent(new CustomEvent('test-mode-change', { detail: true }));
  }

  // Deaktiviere Test-Modus und lösche Test-Daten
  async deactivateTestMode(immediate: boolean = false) {
    console.log('🧹 Test-Modus wird deaktiviert...');
    
    if (this.testModeTimer) {
      clearTimeout(this.testModeTimer);
      this.testModeTimer = null;
    }

    localStorage.setItem('test-mode-active', 'false');
    localStorage.removeItem('test-mode-start-time');

    if (immediate) {
      await this.cleanupTestData();
    }
    
    // Trigger Event
    window.dispatchEvent(new CustomEvent('test-mode-change', { detail: false }));
  }

  private startTestModeTimer() {
    // Lösche alten Timer
    if (this.testModeTimer) {
      clearTimeout(this.testModeTimer);
    }

    // Starte 5-Minuten Timer
    this.testModeTimer = setTimeout(async () => {
      console.log('⏰ 5 Minuten Test-Modus abgelaufen - starte 30s Countdown');
      
      // Trigger Event für UI (30s Countdown)
      window.dispatchEvent(new CustomEvent('test-mode-cleanup-countdown', { detail: 30 }));
      
      // Starte 30-Sekunden Countdown
      let countdown = 30;
      const countdownInterval = setInterval(() => {
        countdown--;
        window.dispatchEvent(new CustomEvent('test-mode-cleanup-countdown', { detail: countdown }));
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      // Nach 30 Sekunden: Cleanup
      setTimeout(async () => {
        await this.deactivateTestMode(true);
        window.dispatchEvent(new CustomEvent('test-mode-cleanup-countdown', { detail: 0 }));
      }, 30000); // 30 Sekunden
    }, 5 * 60 * 1000); // 5 Minuten
  }

  // Prüfe regelmäßig ob Stream live ist (für isReal Flag)
  private startLiveCheck() {
    // Prüfe alle 30 Sekunden
    this.liveCheckTimer = setInterval(async () => {
      await this.checkIfStreamIsLive();
    }, 30000); // 30 Sekunden

    // Erste Prüfung sofort
    this.checkIfStreamIsLive();
  }

  private async checkIfStreamIsLive() {
    try {
      const { TwitchService } = await import('./TwitchService');
      const user = TwitchService.getUserFromStorage();
      
      if (!user) return;

      const streamInfo = await TwitchService.getStreamInfo(user.id);
      
      if (streamInfo && streamInfo.type === 'live') {
        // Stream ist live
        if (!this.liveStartTime) {
          this.liveStartTime = new Date();
          console.log('🔴 Stream ist live - starte 10-Minuten Verifizierung');
        }

        // Prüfe ob Stream seit 10+ Minuten live ist
        const liveMinutes = (new Date().getTime() - this.liveStartTime.getTime()) / 1000 / 60;
        
        if (liveMinutes >= 10 && !this.isStreamVerifiedLive) {
          this.isStreamVerifiedLive = true;
          await this.markCurrentDataAsReal();
          console.log('✅ Stream seit 10+ Minuten live - Daten als ECHT markiert');
        }
      } else {
        // Stream ist offline
        if (this.liveStartTime) {
          console.log('⚫ Stream ist offline');
          this.liveStartTime = null;
          this.isStreamVerifiedLive = false;
        }
      }
    } catch (error) {
      console.error('Fehler beim Live-Check:', error);
    }
  }

  // Markiere aktuelle Session und Daten als echt
  private async markCurrentDataAsReal() {
    try {
      // 1. Markiere aktuelle Session als echt
      const sessionStats = localStorage.getItem('stream-session-stats');
      if (sessionStats) {
        const stats = JSON.parse(sessionStats);
        stats.isReal = true;
        localStorage.setItem('stream-session-stats', JSON.stringify(stats));
        console.log('✅ Session als ECHT markiert');
      }

      // 2. Markiere aktuelle Stream-History als echt
      const streamHistory = localStorage.getItem('stream-history');
      if (streamHistory) {
        const sessions = JSON.parse(streamHistory);
        const today = new Date().toISOString().split('T')[0];
        
        // Finde heutige Session und markiere als echt
        const updated = sessions.map((s: any) => {
          if (s.date === today && !s.isReal) {
            return { ...s, isReal: true };
          }
          return s;
        });
        
        localStorage.setItem('stream-history', JSON.stringify(updated));
        console.log('✅ Heutige Stream-History als ECHT markiert');
      }

      // 3. Markiere Activity Feed Einträge als echt
      const activityFeed = localStorage.getItem('activity-feed');
      if (activityFeed) {
        const activities = JSON.parse(activityFeed);
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        
        // Markiere alle Activities der letzten 10 Minuten als echt
        const updated = activities.map((a: any) => {
          const activityTime = new Date(a.timestamp);
          if (activityTime >= tenMinutesAgo && !a.isReal) {
            return { ...a, isReal: true };
          }
          return a;
        });
        
        localStorage.setItem('activity-feed', JSON.stringify(updated));
        console.log('✅ Activity Feed als ECHT markiert');
      }
    } catch (error) {
      console.error('Fehler beim Markieren als echt:', error);
    }
  }

  // Lösche alle Test-Daten (ohne isReal Flag ODER mit unrealistischen Werten)
  private async cleanupTestData() {
    console.log('🗑️ Lösche alle Test-Daten...');

    try {
      // 1. Lösche Activity Feed Test-Daten
      const activityFeed = localStorage.getItem('activity-feed');
      if (activityFeed) {
        const activities = JSON.parse(activityFeed);
        // Behalte nur Activities mit isReal=true
        const realActivities = activities.filter((a: any) => a.isReal === true);
        localStorage.setItem('activity-feed', JSON.stringify(realActivities));
        console.log(`✅ ${activities.length - realActivities.length} Test-Activities gelöscht`);
      }

      // 2. Lösche Stream-History Test-Daten
      const streamHistory = localStorage.getItem('stream-history');
      if (streamHistory) {
        const sessions = JSON.parse(streamHistory);
        
        // Behalte nur Sessions die:
        // - isReal=true haben ODER
        // - Realistische Werte haben (< 50 Follower/Subs pro Session UND Dauer > 0)
        const realSessions = sessions.filter((s: any) => {
          // Wenn isReal Flag existiert, nutze es
          if (s.isReal !== undefined) {
            return s.isReal === true;
          }
          
          // Alte Daten ohne Flag: Prüfe ob realistisch
          // Entferne Sessions mit unrealistischen Werten
          if (s.duration === 0 || s.duration < 1) return false;
          if (s.newFollowers > 50 || s.newSubs > 50) return false;
          
          // Behalte realistische alte Sessions
          return true;
        });
        
        localStorage.setItem('stream-history', JSON.stringify(realSessions));
        console.log(`✅ ${sessions.length - realSessions.length} Test-Sessions gelöscht`);
      }

      // 3. Reset Session-Stats wenn nicht echt
      const sessionStats = localStorage.getItem('stream-session-stats');
      if (sessionStats) {
        const stats = JSON.parse(sessionStats);
        if (!stats.isReal) {
          const StreamSessionTracker = (await import('./StreamSessionTracker')).default;
          const tracker = StreamSessionTracker.getInstance();
          tracker.resetSession();
          console.log('✅ Test-Session zurückgesetzt');
        }
      }

      // 4. Trigger Reload aller Kacheln
      window.dispatchEvent(new CustomEvent('reload-tiles'));
      
      console.log('✅ Cleanup abgeschlossen!');
    } catch (error) {
      console.error('Fehler beim Cleanup:', error);
    }
  }

  // Manuelles Cleanup (für Button in Settings)
  async manualCleanup() {
    console.log('🧹 Manuelles Cleanup gestartet...');
    await this.cleanupTestData();
  }

  // Stoppe alle Timer (beim App-Beenden)
  destroy() {
    if (this.testModeTimer) {
      clearTimeout(this.testModeTimer);
    }
    if (this.liveCheckTimer) {
      clearInterval(this.liveCheckTimer);
    }
  }

  // Getter
  isTestModeActive(): boolean {
    return localStorage.getItem('test-mode-active') === 'true';
  }

  getTestModeRemainingTime(): number {
    const startTime = localStorage.getItem('test-mode-start-time');
    if (!startTime) return 0;

    const elapsed = Date.now() - new Date(startTime).getTime();
    const remaining = (5 * 60 * 1000) - elapsed; // 5 Minuten in ms
    
    return Math.max(0, Math.ceil(remaining / 1000)); // Sekunden
  }

  isStreamLive(): boolean {
    return this.isStreamVerifiedLive;
  }
}

export default TestModeManager;
