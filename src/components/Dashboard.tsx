import { useState, useEffect, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import TileChat from './tiles/TileChat';
import TileActivity from './tiles/TileActivity';
import TileStreamInfo from './tiles/TileStreamInfo';
import TileFollowers from './tiles/TileFollowers';
import TileSubs from './tiles/TileSubs';
import TileBits from './tiles/TileBits';
import TileChannelPoints from './tiles/TileChannelPoints';
import TileHypeTrain from './tiles/TileHypeTrain';
import TileStreamSettings from './tiles/TileStreamSettings';
import TileAlerts from './tiles/TileAlerts';
import TileViewerStats from './tiles/TileViewerStats';
import TileQuickActions from './tiles/TileQuickActions';
import TileViewerList from './tiles/TileViewerList';
import TileStreamPreview from './tiles/TileStreamPreview';
import TileRaidTargets from './tiles/TileRaidTargets';
import TileStreamHistory from './tiles/TileStreamHistory';
import WindowManager from '../services/WindowManager';

interface Tile {
  id: string;
  name: string;
  enabled: boolean;
}

interface DashboardProps {
  tiles: Tile[];
  onCloseTile: (tileId: string) => void;
}

export default function Dashboard({ tiles, onCloseTile }: DashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [compactMode, setCompactMode] = useState(() => {
    const settings = localStorage.getItem('app-settings');
    if (settings) {
      const { compactMode } = JSON.parse(settings);
      return compactMode === true;
    }
    return false;
  });
  const [contextMenu, setContextMenu] = useState<{ tileId: string; x: number; y: number } | null>(null);
  const [availableWindows, setAvailableWindows] = useState<Array<{ id: string; name: string }>>([]);

  const tileComponents: Record<string, React.ComponentType> = {
    'chat': TileChat,
    'activity': TileActivity,
    'stream-info': TileStreamInfo,
    'followers': TileFollowers,
    'alerts': TileAlerts,
    'viewer-stats': TileViewerStats,
    'quick-actions': TileQuickActions,
    'viewer-list': TileViewerList,
    'subs': TileSubs,
    'bits': TileBits,
    'channel-points': TileChannelPoints,
    'hype-train': TileHypeTrain,
    'stream-settings': TileStreamSettings,
    'stream-preview': TileStreamPreview,
    'raid-targets': TileRaidTargets,
    'stream-history': TileStreamHistory
  };

  // Standard-Layout: Festes Layout wie im Screenshot
  const getDefaultLayout = (tiles: Tile[]) => {
    // Definiere feste Positionen für jede Kachel basierend auf dem Screenshot
    const layoutMap: Record<string, { x: number; y: number; w: number; h: number }> = {
      'chat': { x: 0, y: 0, w: 6, h: 4 },
      'stream-info': { x: 6, y: 0, w: 3, h: 2 },
      'stream-settings': { x: 9, y: 0, w: 3, h: 4 },
      'stream-preview': { x: 6, y: 2, w: 3, h: 4 },
      'activity': { x: 0, y: 4, w: 3, h: 3 },
      'alerts': { x: 3, y: 4, w: 3, h: 3 },
      'followers': { x: 6, y: 6, w: 3, h: 3 },
      'viewer-list': { x: 9, y: 4, w: 3, h: 3 },
      'bits': { x: 0, y: 7, w: 3, h: 3 },
      'quick-actions': { x: 3, y: 7, w: 3, h: 3 },
      'channel-points': { x: 6, y: 9, w: 3, h: 3 },
      'hype-train': { x: 9, y: 7, w: 3, h: 3 },
      'viewer-stats': { x: 0, y: 10, w: 3, h: 3 },
      'subs': { x: 3, y: 10, w: 3, h: 3 },
      'raid-targets': { x: 6, y: 10, w: 3, h: 4 },
      'stream-history': { x: 9, y: 10, w: 3, h: 4 }
    };

    return tiles.map((tile) => {
      const layout = layoutMap[tile.id];
      if (layout) {
        return {
          i: tile.id,
          ...layout,
          minW: 2,
          minH: 2
        };
      }
      // Fallback für unbekannte Kacheln
      return {
        i: tile.id,
        x: 0,
        y: 0,
        w: 3,
        h: 3,
        minW: 2,
        minH: 2
      };
    });
  };

  // Lade gespeichertes Layout oder erstelle neues
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem('dashboard-layout');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Fehler beim Laden des Layouts:', e);
        return getDefaultLayout(tiles);
      }
    }
    return getDefaultLayout(tiles);
  });

  // Update Layout wenn Tiles sich ändern (hinzufügen/entfernen)
  useEffect(() => {
    const layoutTileIds = new Set(layout.map((l: any) => l.i));
    
    // Prüfe ob Tiles hinzugefügt oder entfernt wurden
    const tilesChanged = 
      tiles.length !== layout.length ||
      !tiles.every(t => layoutTileIds.has(t.id));
    
    if (tilesChanged) {
      // Behalte Positionen für existierende Tiles, füge neue mit Default-Position hinzu
      const newLayout = tiles.map(tile => {
        const existing = layout.find((l: any) => l.i === tile.id);
        if (existing) {
          return existing;
        }
        // Neue Tile: Verwende Default-Position
        const defaultLayout = getDefaultLayout([tile]);
        return defaultLayout[0];
      });
      
      setLayout(newLayout);
      localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
    }
  }, [tiles]);

  // Lade Schriftgrößen
  const [fontSizes, setFontSizes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('tile-font-sizes');
    return saved ? JSON.parse(saved) : {};
  });

  // Speichere Layout bei Änderungen
  const handleLayoutChange = (newLayout: any[]) => {
    setLayout(newLayout);
    localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
  };

  // Ändere Schriftgröße einer Kachel
  const changeFontSize = (tileId: string, delta: number) => {
    setFontSizes(prev => {
      const current = prev[tileId] || 14;
      const newSize = Math.max(10, Math.min(24, current + delta));
      const updated = { ...prev, [tileId]: newSize };
      localStorage.setItem('tile-font-sizes', JSON.stringify(updated));
      return updated;
    });
  };

  // Passe Breite dynamisch an
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 32); // minus padding
      }
    };

    updateWidth();
    
    // Update bei Resize und nach kurzer Verzögerung (für Sidebar-Animation)
    window.addEventListener('resize', updateWidth);
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateWidth);
      observer.disconnect();
    };
  }, []);

  // Höre auf Settings-Änderungen für Kompakt-Modus
  useEffect(() => {
    const handleStorageChange = () => {
      const settings = localStorage.getItem('app-settings');
      if (settings) {
        const { compactMode } = JSON.parse(settings);
        setCompactMode(compactMode === true);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Lade verfügbare Fenster
  useEffect(() => {
    const updateWindows = () => {
      const manager = WindowManager.getInstance();
      const configs = manager.getWindowConfigs();
      
      setAvailableWindows([
        { id: 'main', name: 'Hauptfenster' },
        ...configs.map((config: any, index: number) => ({
          id: config.id,
          name: `Fenster ${index + 1}`
        }))
      ]);
    };

    updateWindows();

    // Höre auf Fenster-Änderungen
    if (window.electron?.onTileWindowOpened) {
      window.electron.onTileWindowOpened(updateWindows);
    }
    if (window.electron?.onTileWindowClosed) {
      window.electron.onTileWindowClosed(updateWindows);
    }

    const interval = setInterval(updateWindows, 2000);
    return () => clearInterval(interval);
  }, []);

  // Schließe Kontextmenü bei Klick außerhalb
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  const handleContextMenu = (e: React.MouseEvent, tileId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      tileId,
      x: e.clientX,
      y: e.clientY
    });
  };

  const moveTileToWindow = (tileId: string, targetWindowId: string) => {
    const manager = WindowManager.getInstance();
    manager.moveTileToWindow(tileId, targetWindowId);
    setContextMenu(null);
  };

  // Drag & Drop zwischen Fenstern wurde entfernt
  // Verwende stattdessen das Kontextmenü (Rechtsklick auf Kachel)

  return (
    <div 
      ref={containerRef} 
      className={`flex-1 overflow-auto ${compactMode ? 'p-2' : 'p-4'}`} 
      style={{ 
        backgroundColor: 'var(--color-background)'
      }}
    >
      
      {/* Kontextmenü */}
      {contextMenu && (
        <div
          className="fixed z-50 rounded-lg shadow-2xl py-2 min-w-[200px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            backgroundColor: 'var(--color-tile)',
            border: '1px solid var(--color-border)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
            Verschieben nach:
          </div>
          {availableWindows
            .filter(w => w.id !== 'main' || window.location.pathname !== '/')
            .map(window => (
              <button
                key={window.id}
                onClick={() => moveTileToWindow(contextMenu.tileId, window.id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-opacity-10 transition-colors"
                style={{ color: 'var(--color-text)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(145, 71, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                📺 {window.name}
              </button>
            ))}
        </div>
      )}
      
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={compactMode ? 60 : 80}
        width={containerWidth}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={false}
      >
        {tiles.map(tile => {
          const TileComponent = tileComponents[tile.id];
          const fontSize = fontSizes[tile.id] || 14;
          return (
            <div 
              key={tile.id} 
              className="rounded-lg border overflow-hidden" 
              style={{ 
                backgroundColor: 'var(--color-tile)', 
                borderColor: 'var(--color-tile-border)'
              }}
            >
              <div 
                className="drag-handle px-4 py-2 cursor-move flex items-center justify-between" 
                style={{ backgroundColor: 'var(--color-tile-header)' }}
                onContextMenu={(e) => handleContextMenu(e, tile.id)}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{tile.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      changeFontSize(tile.id, -1);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-twitch-gray rounded"
                    title="Schrift verkleinern"
                  >
                    A-
                  </button>
                  <span className="text-gray-500 text-xs">{fontSize}px</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      changeFontSize(tile.id, 1);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-twitch-gray rounded"
                    title="Schrift vergrößern"
                  >
                    A+
                  </button>
                  {availableWindows.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContextMenu(e, tile.id);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-twitch-gray rounded"
                      title="Zu anderem Fenster verschieben"
                    >
                      📺
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTile(tile.id);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-red-400 text-xs px-2 py-1 hover:bg-twitch-gray rounded"
                    title="Kachel schließen"
                  >
                    ✕
                  </button>
                  <span className="text-gray-400 text-xs ml-1">⋮⋮</span>
                </div>
              </div>
              <div className="p-4 h-[calc(100%-40px)] overflow-auto" style={{ fontSize: `${fontSize}px` }}>
                {TileComponent ? <TileComponent /> : <div>Kachel nicht gefunden</div>}
              </div>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}
