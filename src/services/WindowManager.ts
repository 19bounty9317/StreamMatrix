// Service zum Verwalten von mehreren Fenstern für Kacheln

interface WindowConfig {
  id: string;
  tiles: string[]; // IDs der Kacheln in diesem Fenster
}

class WindowManager {
  private static instance: WindowManager;
  private windows: Map<string, Window | null> = new Map();
  private windowConfigs: Map<string, WindowConfig> = new Map();
  private listeners: Set<(configs: WindowConfig[]) => void> = new Set();
  private dragListeners: Set<(data: { type: string; tileId?: string; windowId?: string }) => void> = new Set();
  private currentDragTile: string | null = null;

  private constructor() {
    this.loadConfigs();
    
    // Höre auf Electron IPC Events
    if (window.electron?.onTileMoved) {
      window.electron.onTileMoved((data) => {
        console.log('📨 IPC Event empfangen: tile-moved', data);
        // Lade Konfiguration neu
        this.loadConfigs();
        this.notifyListeners();
      });
    }
    
    // Höre auf Fenster-Schließen-Events
    if (window.electron?.onTileWindowClosed) {
      window.electron.onTileWindowClosed((windowId) => {
        console.log('📨 IPC Event empfangen: tile-window-closed', windowId);
        this.closeWindow(windowId);
      });
    }
    
    // Höre auf localStorage-Änderungen für Cross-Window-Kommunikation (Fallback)
    window.addEventListener('storage', (e) => {
      if (e.key === 'drag-event' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          this.handleDragEvent(data);
        } catch (error) {
          console.error('Fehler beim Parsen des Drag-Events:', error);
        }
      } else if (e.key === 'window-configs' && e.newValue) {
        // Konfiguration wurde in anderem Fenster geändert
        this.loadConfigs();
        this.notifyListeners();
      }
    });
    
    // Cleanup beim Schließen
    window.addEventListener('beforeunload', () => {
      this.closeAllWindows();
    });
  }

  private handleDragEvent(data: { type: string; tileId?: string; windowId?: string }) {
    if (data.type === 'drag-start') {
      this.currentDragTile = data.tileId || null;
      this.notifyDragListeners(data);
    } else if (data.type === 'drag-end') {
      this.currentDragTile = null;
      this.notifyDragListeners(data);
    } else if (data.type === 'drop' && this.currentDragTile) {
      this.moveTileToWindow(this.currentDragTile, data.windowId || 'main');
      this.currentDragTile = null;
      this.notifyDragListeners({ type: 'drag-end' });
    }
  }

  static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  private loadConfigs() {
    const saved = localStorage.getItem('window-configs');
    if (saved) {
      try {
        const configs = JSON.parse(saved);
        configs.forEach((config: WindowConfig) => {
          this.windowConfigs.set(config.id, config);
        });
      } catch (error) {
        console.error('Fehler beim Laden der Fenster-Konfiguration:', error);
      }
    }
  }

  private saveConfigs() {
    const configs = Array.from(this.windowConfigs.values());
    localStorage.setItem('window-configs', JSON.stringify(configs));
    this.notifyListeners();
  }

  private notifyListeners() {
    const configs = Array.from(this.windowConfigs.values());
    console.log('📢 WindowManager: Benachrichtige Listener', configs);
    this.listeners.forEach(listener => listener(configs));
  }

  onConfigChange(listener: (configs: WindowConfig[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onDragEvent(listener: (data: { type: string; tileId?: string; windowId?: string }) => void) {
    this.dragListeners.add(listener);
    return () => this.dragListeners.delete(listener);
  }

  private notifyDragListeners(data: { type: string; tileId?: string; windowId?: string }) {
    this.dragListeners.forEach(listener => listener(data));
  }

  startDrag(tileId: string) {
    this.currentDragTile = tileId;
    this.broadcastDragEvent({ type: 'drag-start', tileId });
  }

  endDrag() {
    this.currentDragTile = null;
    this.broadcastDragEvent({ type: 'drag-end' });
  }

  dragOver(windowId: string) {
    this.broadcastDragEvent({ type: 'drag-over', windowId });
  }

  drop(windowId: string) {
    if (this.currentDragTile) {
      this.moveTileToWindow(this.currentDragTile, windowId);
      this.currentDragTile = null;
      this.broadcastDragEvent({ type: 'drag-end' });
    }
  }

  getCurrentDragTile(): string | null {
    return this.currentDragTile;
  }

  private broadcastDragEvent(data: { type: string; tileId?: string; windowId?: string }) {
    // Verwende localStorage für Cross-Window-Kommunikation
    const eventData = {
      ...data,
      timestamp: Date.now()
    };
    localStorage.setItem('drag-event', JSON.stringify(eventData));
    
    // Benachrichtige lokale Listener
    this.notifyDragListeners(data);
  }



  openTileWindow(): string {
    const windowId = `tile-window-${Date.now()}`;
    
    // Erstelle Konfiguration sofort (auch wenn window.open null zurückgibt in Electron)
    this.windowConfigs.set(windowId, {
      id: windowId,
      tiles: []
    });
    this.saveConfigs();
    
    // Versuche Fenster zu öffnen (funktioniert in Electron anders)
    const newWindow = window.open(
      `${window.location.origin}/tile-window.html?windowId=${windowId}`,
      windowId,
      'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no'
    );

    if (newWindow) {
      this.windows.set(windowId, newWindow);

      // Prüfe ob Fenster geschlossen wurde
      const checkClosed = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkClosed);
          this.closeWindow(windowId);
        }
      }, 1000);
    }

    return windowId;
  }

  closeWindow(windowId: string) {
    console.log('🔴 WindowManager: Schließe Fenster', windowId);
    
    // Hole alle Kacheln aus diesem Fenster
    const config = this.windowConfigs.get(windowId);
    if (config && config.tiles.length > 0) {
      console.log('📦 Verschiebe Kacheln zurück ins Hauptfenster:', config.tiles);
      // Verschiebe alle Kacheln zurück ins Hauptfenster
      config.tiles.forEach(tileId => {
        this.moveTileToWindow(tileId, 'main');
      });
    }
    
    const win = this.windows.get(windowId);
    if (win && !win.closed) {
      win.close();
    }
    this.windows.delete(windowId);
    this.windowConfigs.delete(windowId);
    this.saveConfigs();
  }

  closeAllWindows() {
    this.windows.forEach((win) => {
      if (win && !win.closed) {
        win.close();
      }
    });
    this.windows.clear();
    this.windowConfigs.clear();
    this.saveConfigs();
  }

  moveTileToWindow(tileId: string, targetWindowId: string) {
    console.log('🔄 WindowManager: moveTileToWindow', { tileId, targetWindowId });
    
    // Lade aktuelle Konfiguration aus localStorage (wichtig für Sync zwischen Fenstern)
    this.loadConfigs();
    
    // Entferne Kachel aus allen Fenstern
    this.windowConfigs.forEach(config => {
      config.tiles = config.tiles.filter(id => id !== tileId);
    });

    // Füge zu Ziel-Fenster hinzu
    let targetConfig = this.windowConfigs.get(targetWindowId);
    if (!targetConfig && targetWindowId !== 'main') {
      // Erstelle Konfiguration falls sie nicht existiert
      console.log('⚠️ Ziel-Konfiguration nicht gefunden, erstelle neue:', targetWindowId);
      targetConfig = { id: targetWindowId, tiles: [] };
      this.windowConfigs.set(targetWindowId, targetConfig);
    }
    
    if (targetConfig) {
      targetConfig.tiles.push(tileId);
      console.log('✅ Kachel hinzugefügt zu:', targetWindowId, 'Kacheln:', targetConfig.tiles);
    } else {
      console.log('⚠️ Kein Ziel-Config gefunden für:', targetWindowId);
    }

    this.saveConfigs();

    // Verwende Electron IPC wenn verfügbar, sonst localStorage
    if (window.electron?.moveTile) {
      console.log('📡 Verwende Electron IPC');
      window.electron.moveTile(tileId, targetWindowId);
    } else {
      console.log('📡 Verwende localStorage');
      this.broadcastConfigChange();
    }
  }

  getTilesForWindow(windowId: string): string[] {
    const config = this.windowConfigs.get(windowId);
    return config ? config.tiles : [];
  }

  getMainWindowTiles(allTileIds: string[]): string[] {
    // Alle Kacheln die nicht in anderen Fenstern sind
    const tilesInOtherWindows = new Set<string>();
    this.windowConfigs.forEach(config => {
      config.tiles.forEach(tileId => tilesInOtherWindows.add(tileId));
    });

    return allTileIds.filter(id => !tilesInOtherWindows.has(id));
  }

  getWindowConfigs(): WindowConfig[] {
    return Array.from(this.windowConfigs.values());
  }

  private broadcastConfigChange() {
    const configs = Array.from(this.windowConfigs.values());
    
    // Sende an alle offenen Fenster
    this.windows.forEach(win => {
      if (win && !win.closed) {
        win.postMessage({
          type: 'window-config-update',
          configs
        }, window.location.origin);
      }
    });
  }

  isMainWindow(): boolean {
    return !window.location.search.includes('windowId=');
  }
}

export default WindowManager;
