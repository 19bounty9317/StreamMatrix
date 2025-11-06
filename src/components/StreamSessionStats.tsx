import { useState, useEffect } from 'react';
import StreamSessionTracker from '../services/StreamSessionTracker';

export default function StreamSessionStats() {
  const [stats, setStats] = useState(StreamSessionTracker.getInstance().getStats());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const tracker = StreamSessionTracker.getInstance();
    
    tracker.onStatsUpdate((newStats) => {
      setStats(newStats);
    });

    // Listener für Test-Mode Änderungen
    const handleTestModeChange = () => {
      setStats(tracker.getStats());
      forceUpdate({});
    };

    window.addEventListener('test-mode-change' as any, handleTestModeChange);

    // Aktualisiere Stats alle 5 Sekunden im Test-Modus, sonst alle 60 Sekunden
    const interval = setInterval(() => {
      const isTestMode = localStorage.getItem('test-mode-active') === 'true';
      const currentStats = tracker.getStats();
      
      if (currentStats) {
        setStats({...currentStats});
      }
      
      if (!isTestMode) {
        const { TwitchService } = require('../services/TwitchService');
        const user = TwitchService.getUserFromStorage();
        if (user) {
          tracker.updateCurrentStats(user.id);
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('test-mode-change' as any, handleTestModeChange);
    };
  }, []);

  if (!stats || !stats.isLive) {
    return null;
  }

  const followerDiff = stats.currentFollowers - stats.startFollowers;
  const subDiff = stats.currentSubs - stats.startSubs;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex gap-3">
      {/* Follower Stats */}
      <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/90 to-blue-600/90 backdrop-blur-md shadow-lg border border-white/20">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👤</span>
          <div>
            <div className="text-white font-bold text-lg">
              {stats.currentFollowers}
              {followerDiff !== 0 && (
                <span className={`ml-2 text-sm ${followerDiff > 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {followerDiff > 0 ? '+' : ''}{followerDiff}
                </span>
              )}
            </div>
            <div className="text-white/80 text-xs">Follower</div>
          </div>
        </div>
      </div>

      {/* Sub Stats */}
      <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/90 to-purple-600/90 backdrop-blur-md shadow-lg border border-white/20">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <div>
            <div className="text-white font-bold text-lg">
              {stats.currentSubs}
              {subDiff !== 0 && (
                <span className={`ml-2 text-sm ${subDiff > 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {subDiff > 0 ? '+' : ''}{subDiff}
                </span>
              )}
            </div>
            <div className="text-white/80 text-xs">Subs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
