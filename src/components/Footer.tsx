import React, { useState, useEffect } from 'react';
import { APP_VERSION } from '../config/version';

interface ConnectionStatus {
  api: string;
  websocket: string;
  tokenValid: boolean;
}

interface FooterProps {
  status: ConnectionStatus;
}

interface SystemStats {
  cpu: number;
  ram: number;
  gpu: number;
  bitrate: number;
}

export default function Footer({ status }: FooterProps) {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    ram: 0,
    gpu: 0,
    bitrate: 0
  });
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateVersion, setUpdateVersion] = useState('');

  useEffect(() => {
    const updateStats = async () => {
      try {
        // Prüfe ob Electron API verfügbar ist
        if (!window.electron?.getSystemStats) {
          return;
        }
        
        // @ts-ignore - Electron API
        const stats = await window.electron.getSystemStats();
        console.log('System Stats:', stats); // Debug
        setSystemStats(stats);
      } catch (error) {
        console.error('Fehler beim Laden der System-Stats:', error);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 2000); // Alle 2 Sekunden aktualisieren
    return () => clearInterval(interval);
  }, []);

  // Update-Listener
  useEffect(() => {
    if (window.electron?.onUpdateAvailable) {
      window.electron.onUpdateAvailable((info) => {
        const dismissedUpdate = localStorage.getItem('dismissed-update-version');
        if (dismissedUpdate !== info.version) {
          setUpdateAvailable(true);
          setUpdateVersion(info.version);
        }
      });
    }
  }, []);

  const dismissUpdate = () => {
    // Speichere dass User "Später" geklickt hat
    // Aber lasse das Banner sichtbar (setUpdateAvailable bleibt true)
    localStorage.setItem('dismissed-update-popup', updateVersion);
    console.log('Update-Popup für v' + updateVersion + ' dismissed - Banner bleibt sichtbar');
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'disconnected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'connected': return '●';
      case 'connecting': return '◐';
      case 'disconnected': return '○';
      default: return '?';
    }
  };

  return (
    <div className="px-4 py-2 flex items-center justify-between text-xs" style={{ backgroundColor: 'var(--color-sidebar)', borderTop: '1px solid var(--color-border)' }}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className={`${getStatusColor(status.api)} font-bold`}>
            {getStatusIcon(status.api)}
          </span>
          <span style={{ color: 'var(--color-text-secondary)' }}>API:</span>
          <span style={{ color: 'var(--color-text)' }}>{status.api}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`${getStatusColor(status.websocket)} font-bold`}>
            {getStatusIcon(status.websocket)}
          </span>
          <span style={{ color: 'var(--color-text-secondary)' }}>WebSocket:</span>
          <span style={{ color: 'var(--color-text)' }}>{status.websocket}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`${status.tokenValid ? 'text-green-400' : 'text-red-400'} font-bold`}>
            {status.tokenValid ? '✓' : '✗'}
          </span>
          <span style={{ color: 'var(--color-text-secondary)' }}>Token:</span>
          <span style={{ color: 'var(--color-text)' }}>{status.tokenValid ? 'Gültig' : 'Ungültig'}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* System Stats */}
        <div className="flex items-center gap-4">
          {/* CPU */}
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--color-text-secondary)' }}>🖥️ CPU:</span>
            <span
              className="font-semibold"
              style={{
                color: systemStats.cpu > 80 ? 'var(--color-error)' :
                  systemStats.cpu > 60 ? 'var(--color-warning)' :
                    'var(--color-success)'
              }}
            >
              {systemStats.cpu}%
            </span>
          </div>

          {/* RAM */}
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--color-text-secondary)' }}>💾 RAM:</span>
            <span
              className="font-semibold"
              style={{
                color: systemStats.ram > 80 ? 'var(--color-error)' :
                  systemStats.ram > 60 ? 'var(--color-warning)' :
                    'var(--color-success)'
              }}
            >
              {systemStats.ram}%
            </span>
          </div>

          {/* GPU */}
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--color-text-secondary)' }}>🎮 GPU:</span>
            <span
              className="font-semibold"
              style={{
                color: systemStats.gpu > 80 ? 'var(--color-error)' :
                  systemStats.gpu > 60 ? 'var(--color-warning)' :
                    'var(--color-success)'
              }}
            >
              {systemStats.gpu}%
            </span>
          </div>
        </div>

        <div style={{ color: 'var(--color-border)' }}>|</div>
        
        {updateAvailable ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgb(6, 182, 212)' }}>
            <span className="font-bold animate-pulse" style={{ color: 'rgb(34, 211, 238)' }}>🎉 Update v{updateVersion} verfügbar!</span>
            <button
              onClick={dismissUpdate}
              className="px-2 py-1 rounded text-xs font-semibold transition-colors"
              style={{ backgroundColor: 'rgb(6, 182, 212)', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(8, 145, 178)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(6, 182, 212)'}
            >
              Später
            </button>
          </div>
        ) : (
          <div style={{ color: 'var(--color-text-secondary)' }}>v{APP_VERSION}</div>
        )}
      </div>
    </div>
  );
}
