import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

interface ViewerDataPoint {
  time: string;
  viewers: number;
}

export default function TileViewerStats() {
  const [viewerHistory, setViewerHistory] = useState<ViewerDataPoint[]>([]);
  const [currentViewers, setCurrentViewers] = useState(0);
  const [peakViewers, setPeakViewers] = useState(0);
  const [averageViewers, setAverageViewers] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViewerData = async () => {
      try {
        const user = TwitchService.getUserFromStorage();
        if (!user) {
          console.log('📊 ViewerStats: Kein User gefunden');
          return;
        }

        console.log('📊 ViewerStats: Lade Stream-Info für User:', user.id);
        const streamInfo = await TwitchService.getStreamInfo(user.id);
        console.log('📊 ViewerStats: Stream-Info:', streamInfo);

        if (streamInfo) {
          setIsLive(true);
          const viewers = streamInfo.viewer_count;
          console.log('📊 ViewerStats: Aktuelle Viewer:', viewers);
          setCurrentViewers(viewers);

          const now = new Date();
          const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

          setViewerHistory(prev => {
            const newHistory = [...prev, { time: timeStr, viewers }];
            if (newHistory.length > 30) {
              newHistory.shift();
            }

            const peak = Math.max(...newHistory.map(d => d.viewers));
            setPeakViewers(peak);

            const avg = Math.round(
              newHistory.reduce((sum, d) => sum + d.viewers, 0) / newHistory.length
            );
            setAverageViewers(avg);

            return newHistory;
          });
        } else {
          console.log('📊 ViewerStats: Stream ist offline');
          setIsLive(false);
          setCurrentViewers(0);
        }
      } catch (error) {
        console.error('❌ ViewerStats: Fehler beim Laden der Viewer-Daten:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewerData();
    const interval = setInterval(fetchViewerData, 30000); // Alle 30 Sekunden

    return () => clearInterval(interval);
  }, []);

  const maxViewers = Math.max(...viewerHistory.map(d => d.viewers), 1);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-t-transparent rounded-full" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {!isLive ? (
        <div className="flex-1 flex items-center justify-center theme-text-secondary">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-sm">Stream ist offline</div>
            <div className="text-xs mt-1">Statistiken werden angezeigt wenn du live gehst</div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="theme-tile-content-bg p-3 rounded text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {currentViewers}
              </div>
              <div className="text-xs theme-text-secondary">Aktuell</div>
            </div>
            <div className="theme-tile-content-bg p-3 rounded text-center">
              <div className="text-2xl font-bold text-green-400">
                {peakViewers}
              </div>
              <div className="text-xs theme-text-secondary">Peak</div>
            </div>
            <div className="theme-tile-content-bg p-3 rounded text-center">
              <div className="text-2xl font-bold text-blue-400">
                {averageViewers}
              </div>
              <div className="text-xs theme-text-secondary">Durchschnitt</div>
            </div>
          </div>

          <div className="flex-1 theme-tile-content-bg p-3 rounded">
            <div className="text-xs theme-text-secondary mb-2">Viewer-Verlauf</div>
            <div className="h-full flex items-end gap-1">
              {viewerHistory.map((point, index) => {
                const height = (point.viewers / maxViewers) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 rounded-t transition-all relative group"
                    style={{ height: `${height}%`, minHeight: '4px', backgroundColor: 'var(--color-accent)' }}
                  >
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 theme-tile-content-bg px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none theme-text" style={{ border: '1px solid var(--color-border)' }}>
                      {point.viewers} Viewer<br />
                      {point.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
