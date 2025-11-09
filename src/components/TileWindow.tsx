import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import WindowManager from '../services/WindowManager';
import { getTheme, applyTheme } from '../styles/themes';

interface Tile {
  id: string;
  name: string;
  enabled: boolean;
}

export default function TileWindow() {
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    const init = async () => {
      console.log('🚀 TileWindow: Initialisierung gestartet');
      
      // Hole Window-ID aus URL
      const params = new URLSearchParams(window.location.search);
      const windowId = params.get('windowId');
      console.log('🆔 TileWindow: Window ID:', windowId);

      // Lade Theme
      const settings = localStorage.getItem('app-settings');
      let themeId = 'twitch-dark';
      if (settings) {
        const parsed = JSON.parse(settings);
        themeId = parsed.themeId || 'twitch-dark';
      }
      console.log('🎨 TileWindow: Theme:', themeId);
      const theme = getTheme(themeId);
      applyTheme(theme);

      // Lade alle verfügbaren Kacheln vom Hauptfenster via Electron IPC
      // In Electron hat jedes Fenster seinen eigenen localStorage
      console.log('🔍 window.electron verfügbar?', !!window.electron);
      console.log('🔍 window.electron.getTilesOrder verfügbar?', !!window.electron?.getTilesOrder);
      
      // Prüfe zuerst, ob tiles-order bereits im localStorage ist (von Electron gesetzt)
      const existingTilesOrder = localStorage.getItem('tiles-order');
      console.log('🔍 Bereits vorhandene tiles-order:', existingTilesOrder ? 'JA' : 'NEIN');
      
      if (!existingTilesOrder && window.electron?.getTilesOrder) {
        try {
          console.log('📡 Lade Kacheln vom Hauptfenster via IPC...');
          const result = await window.electron.getTilesOrder();
          console.log('📡 IPC Antwort erhalten:', result);
          if (result.tilesOrder) {
            localStorage.setItem('tiles-order', result.tilesOrder);
            console.log('✅ Kacheln vom Hauptfenster geladen');
          } else {
            console.log('⚠️ Keine Kacheln vom Hauptfenster erhalten (result.tilesOrder ist null)');
          }
        } catch (e) {
          console.error('❌ Fehler beim Laden der Kacheln:', e);
        }
      } else if (!window.electron?.getTilesOrder) {
        console.log('⚠️ window.electron.getTilesOrder nicht verfügbar');
      } else {
        console.log('✅ tiles-order bereits vorhanden, kein IPC-Call nötig');
      }

      // Registriere dieses Fenster beim WindowManager
      const windowManager = WindowManager.getInstance();
      if (windowId) {
      // Stelle sicher, dass die Konfiguration existiert
      const configs = windowManager.getWindowConfigs();
      const exists = configs.some(c => c.id === windowId);
      
      if (!exists) {
        // Erstelle Konfiguration für dieses Fenster
        const savedConfigs = localStorage.getItem('window-configs');
        const allConfigs = savedConfigs ? JSON.parse(savedConfigs) : [];
        allConfigs.push({ id: windowId, tiles: [] });
        localStorage.setItem('window-configs', JSON.stringify(allConfigs));
        console.log('✅ Fenster-Konfiguration erstellt:', windowId);
      }
      
      const tileIds = windowManager.getTilesForWindow(windowId);
      const savedTiles = localStorage.getItem('tiles-order');
      if (savedTiles) {
        const allTiles = JSON.parse(savedTiles);
        const windowTiles = allTiles.filter((t: Tile) => tileIds.includes(t.id));
        setTiles(windowTiles);
        }
      }

      // Höre auf Konfigurationsänderungen
      const unsubscribe = windowManager.onConfigChange(() => {
      console.log('🔄 TileWindow: Konfiguration geändert');
      if (windowId) {
        const tileIds = windowManager.getTilesForWindow(windowId);
        console.log('📋 TileWindow: Kacheln für dieses Fenster:', tileIds);
        
        // Lade Kacheln neu aus localStorage (wurde vom Opener kopiert)
        const savedTiles = localStorage.getItem('tiles-order');
        console.log('📦 localStorage tiles-order:', savedTiles ? 'vorhanden' : 'null');
        
        if (savedTiles) {
          const allAvailableTiles = JSON.parse(savedTiles);
          const windowTiles = allAvailableTiles.filter((t: Tile) => tileIds.includes(t.id));
          console.log('✅ TileWindow: Setze Kacheln:', windowTiles);
          setTiles(windowTiles);
        } else {
          console.log('⚠️ Keine tiles-order im localStorage!');
        }
        }
      });

      return () => {
        unsubscribe();
      };
    };
    
    init();
  }, []);

  const handleCloseTile = (tileId: string) => {
    const windowManager = WindowManager.getInstance();
    windowManager.moveTileToWindow(tileId, 'main');
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <div 
        className="p-3 flex items-center justify-between"
        style={{ 
          backgroundColor: 'var(--color-sidebar)', 
          borderBottom: '1px solid var(--color-border)' 
        }}
      >
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
          📺 Kachel-Fenster {(() => {
            const params = new URLSearchParams(window.location.search);
            const windowId = params.get('windowId');
            if (windowId) {
              const manager = WindowManager.getInstance();
              const configs = manager.getWindowConfigs();
              const index = configs.findIndex(c => c.id === windowId);
              return index >= 0 ? index + 1 : '';
            }
            return '';
          })()}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              const windowId = params.get('windowId');
              if (windowId) {
                const windowManager = WindowManager.getInstance();
                const tileIds = windowManager.getTilesForWindow(windowId);
                const savedTiles = localStorage.getItem('tiles-order');
                if (savedTiles) {
                  const allTiles = JSON.parse(savedTiles);
                  const windowTiles = allTiles.filter((t: Tile) => tileIds.includes(t.id));
                  setTiles(windowTiles);
                  console.log('🔄 Manuell neu geladen:', windowTiles);
                }
              }
            }}
            className="px-3 py-1 rounded text-sm transition-colors"
            style={{ 
              backgroundColor: 'var(--color-accent)', 
              color: '#FFFFFF' 
            }}
          >
            🔄 Neu laden
          </button>
          <button
            onClick={() => window.close()}
            className="px-3 py-1 rounded text-sm transition-colors"
            style={{ 
              backgroundColor: 'var(--color-error)', 
              color: '#FFFFFF' 
            }}
          >
            ✕ Schließen
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {tiles.length > 0 ? (
          <Dashboard tiles={tiles} onCloseTile={handleCloseTile} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center" style={{ color: 'var(--color-text-secondary)' }}>
            <div className="text-6xl mb-4">📺</div>
            <div className="text-xl mb-2">Keine Kacheln in diesem Fenster</div>
            <div className="text-sm">Ziehe Kacheln aus dem Hauptfenster hierher</div>
          </div>
        )}
      </div>
    </div>
  );
}
