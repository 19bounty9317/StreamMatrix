import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const updateStats = async () => {
      try {
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
        <div style={{ color: 'var(--color-text-secondary)' }}>v1.3.4</div>
      </div>
    </div>
  );
}
