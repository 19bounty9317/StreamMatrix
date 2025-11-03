/**
 * Service für automatische Daten-Aktualisierung
 */
class RefreshService {
  private static instance: RefreshService;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private callbacks: Map<string, () => void> = new Map();
  private isEnabled: boolean = true;
  private intervalSeconds: number = 30;

  private constructor() {
    this.loadSettings();
  }

  static getInstance(): RefreshService {
    if (!RefreshService.instance) {
      RefreshService.instance = new RefreshService();
    }
    return RefreshService.instance;
  }

  private loadSettings() {
    const settings = localStorage.getItem('app-settings');
    if (settings) {
      const { autoRefresh, refreshInterval } = JSON.parse(settings);
      this.isEnabled = autoRefresh !== false;
      this.intervalSeconds = refreshInterval || 30;
    }
  }

  /**
   * Registriere einen Callback für automatische Aktualisierung
   */
  register(key: string, callback: () => void) {
    this.callbacks.set(key, callback);
    
    if (this.isEnabled) {
      this.startInterval(key);
    }
  }

  /**
   * Entferne einen Callback
   */
  unregister(key: string) {
    this.stopInterval(key);
    this.callbacks.delete(key);
  }

  /**
   * Starte Intervall für einen Key
   */
  private startInterval(key: string) {
    this.stopInterval(key);
    
    const callback = this.callbacks.get(key);
    if (!callback) return;

    const interval = setInterval(() => {
      if (this.isEnabled) {
        callback();
      }
    }, this.intervalSeconds * 1000);

    this.intervals.set(key, interval);
  }

  /**
   * Stoppe Intervall für einen Key
   */
  private stopInterval(key: string) {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
    }
  }

  /**
   * Aktualisiere Einstellungen
   */
  updateSettings(autoRefresh: boolean, intervalSeconds: number) {
    this.isEnabled = autoRefresh;
    this.intervalSeconds = intervalSeconds;

    // Starte/Stoppe alle Intervalle neu
    if (this.isEnabled) {
      this.callbacks.forEach((_, key) => {
        this.startInterval(key);
      });
    } else {
      this.intervals.forEach((_, key) => {
        this.stopInterval(key);
      });
    }
  }

  /**
   * Triggere manuelle Aktualisierung aller registrierten Callbacks
   */
  refreshAll() {
    this.callbacks.forEach(callback => callback());
  }
}

export default RefreshService;
