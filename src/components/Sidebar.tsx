import { useState, useEffect } from 'react';

interface Tile {
  id: string;
  name: string;
  enabled: boolean;
}

interface SidebarProps {
  tiles: Tile[];
  onToggleTile: (tileId: string) => void;
  onReorderTiles: (tiles: Tile[]) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export default function Sidebar({ tiles, onToggleTile, onReorderTiles, onOpenSettings, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [userInfo, setUserInfo] = useState<any>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showAvatar, setShowAvatar] = useState(() => {
    const settings = localStorage.getItem('app-settings');
    if (settings) {
      const { showAvatar } = JSON.parse(settings);
      return showAvatar !== false; // Default true
    }
    return true;
  });
  const [compactMode, setCompactMode] = useState(() => {
    const settings = localStorage.getItem('app-settings');
    if (settings) {
      const { compactMode } = JSON.parse(settings);
      return compactMode === true;
    }
    return false;
  });

  useEffect(() => {
    // Lade Benutzer-Info
    const loadUserInfo = async () => {
      try {
        const { TwitchService } = await import('../services/TwitchService');
        const user = TwitchService.getUserFromStorage();
        if (user) {
          setUserInfo(user);
        }
      } catch (error) {
        console.error('Fehler beim Laden der User-Info:', error);
      }
    };
    
    loadUserInfo();
    
    // Prüfe regelmäßig auf Updates (z.B. nach Login)
    const interval = setInterval(loadUserInfo, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Höre auf Settings-Änderungen
  useEffect(() => {
    const handleStorageChange = () => {
      const settings = localStorage.getItem('app-settings');
      if (settings) {
        const { showAvatar, compactMode } = JSON.parse(settings);
        setShowAvatar(showAvatar !== false);
        setCompactMode(compactMode === true);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Auch direkt beim Mount prüfen
    handleStorageChange();
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleCollapse = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newValue));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTiles = [...tiles];
    const draggedTile = newTiles[draggedIndex];
    newTiles.splice(draggedIndex, 1);
    newTiles.splice(index, 0, draggedTile);

    onReorderTiles(newTiles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div 
      className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}
      style={{ backgroundColor: 'var(--color-sidebar)', borderRight: '1px solid var(--color-border)' }}
    >
      <div className={`flex flex-col gap-3 ${isCollapsed ? 'p-2' : 'p-4'}`} style={{ borderBottom: '1px solid var(--color-border)' }}>
        <button
          onClick={toggleCollapse}
          className="p-3 rounded transition-colors self-center text-4xl font-bold leading-none"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}

          title={isCollapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
        
        {userInfo && showAvatar && (
          <div className="flex items-center justify-center flex-shrink-0">
            <img 
              src={userInfo.profile_image_url} 
              alt={userInfo.display_name}
              className={`rounded-full border-2 object-cover ${
                isCollapsed ? 'w-10 h-10' : 'w-12 h-12'
              }`}
              style={{ borderColor: 'var(--color-accent)' }}
              title={`Dashboard von ${userInfo.display_name}`}
            />
          </div>
        )}
        
        {!isCollapsed && userInfo && (
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Dashboard von</div>
            <div className="text-base font-bold truncate px-2" style={{ color: 'var(--color-accent)' }}>{userInfo.display_name}</div>
          </div>
        )}
        
        {!isCollapsed && !userInfo && (
          <h2 className="text-xl font-bold text-center" style={{ color: 'var(--color-text)' }}>Dashboard</h2>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!isCollapsed && (
          <>
            <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>Kacheln</h3>
            <div className="space-y-2">
              {tiles.map((tile, index) => (
                <div
                  key={tile.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                >
                  <button
                    onClick={() => onToggleTile(tile.id)}
                    className="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
                    style={{
                      backgroundColor: tile.enabled ? 'var(--color-accent)' : 'var(--color-tile)',
                      color: tile.enabled ? '#FFFFFF' : 'var(--color-text-secondary)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>⋮⋮</span>
                      <span className="text-sm">{tile.name}</span>
                    </div>
                    <span className="text-xs">
                      {tile.enabled ? '✓' : '+'}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {isCollapsed && (
          <div className="space-y-2">
            {tiles.map(tile => (
              <button
                key={tile.id}
                onClick={() => onToggleTile(tile.id)}
                className="w-full px-2 py-2 rounded-lg transition-colors flex items-center justify-center"
                style={{
                  backgroundColor: tile.enabled ? 'var(--color-accent)' : 'var(--color-tile)',
                  color: tile.enabled ? '#FFFFFF' : 'var(--color-text-secondary)'
                }}
                title={tile.name}
              >
                <span className="text-xs">
                  {tile.enabled ? '✓' : '+'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={onOpenSettings}
            className="w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            style={{ backgroundColor: 'var(--color-tile)', color: 'var(--color-text)' }}
            title="Einstellungen"
          >
            ⚙️ Einstellungen
          </button>
          
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            style={{ backgroundColor: 'var(--color-error)', color: '#FFFFFF' }}
            title="Abmelden"
          >
            Abmelden
          </button>
        </div>
      )}
    </div>
  );
}
