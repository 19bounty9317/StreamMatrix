import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

export default function TileHypeTrain() {
  const [hypeTrainData, setHypeTrainData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setTick] = useState(0); // Für Countdown-Updates
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const [wasActive, setWasActive] = useState(false);

  useEffect(() => {
    const loadHypeTrain = async () => {
      try {
        const user = TwitchService.getUserFromStorage();
        if (user) {
          const data = await TwitchService.getHypeTrainEvents(user.id);
          
          // Prüfe ob neuer Hype Train gestartet wurde
          if (data && data.id !== lastEventId) {
            const isNewActive = data.event_type === 'hypetrain.progression' &&
                               data.event_data?.expires_at &&
                               new Date(data.event_data.expires_at) > new Date();
            
            if (isNewActive && !wasActive) {
              // Hype Train START
              const celebrationEvent = new CustomEvent('stream-celebration', {
                detail: {
                  type: 'hypetrain',
                  username: 'Community',
                  amount: data.event_data?.level || 1
                }
              });
              window.dispatchEvent(celebrationEvent);
              setWasActive(true);
            } else if (!isNewActive && wasActive) {
              // Hype Train ENDE
              const level = data.event_data?.level || 1;
              const topContributions = data.event_data?.top_contributions || [];
              
              // Berechne Gesamt-Beiträge
              let totalSubs = 0;
              let totalBits = 0;
              
              topContributions.forEach((contrib: any) => {
                if (contrib.type === 'SUBS') {
                  totalSubs += contrib.total || 0;
                } else if (contrib.type === 'BITS') {
                  totalBits += contrib.total || 0;
                }
              });
              
              // Celebration Event (für Animation)
              const celebrationEvent = new CustomEvent('stream-celebration', {
                detail: {
                  type: 'hypetrain-end',
                  username: 'Community',
                  amount: level
                }
              });
              window.dispatchEvent(celebrationEvent);
              
              // Activity Feed Event (mit Details)
              const activityEvent = new CustomEvent('hypetrain-ended', {
                detail: {
                  level,
                  totalSubs,
                  totalBits,
                  topContributions
                }
              });
              window.dispatchEvent(activityEvent);
              
              setWasActive(false);
            }
            
            setLastEventId(data.id);
          }
          
          setHypeTrainData(data);
        }
      } catch (error) {
        console.error('Fehler beim Laden des Hype Trains:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHypeTrain();
    // Aktualisiere alle 10 Sekunden
    const dataInterval = setInterval(loadHypeTrain, 10000);
    
    // Aktualisiere Countdown jede Sekunde
    const tickInterval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(dataInterval);
      clearInterval(tickInterval);
    };
  }, [lastEventId, wasActive]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-twitch-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Prüfe ob Hype Train aktiv ist
  // Ein Hype Train ist nur aktiv wenn:
  // 1. Daten vorhanden sind
  // 2. Event-Type ist "hypetrain.progression" (nicht "hypetrain.end")
  // 3. expires_at ist in der Zukunft
  const isActive = hypeTrainData && 
                   hypeTrainData.event_type === 'hypetrain.progression' &&
                   hypeTrainData.event_data?.expires_at &&
                   new Date(hypeTrainData.event_data.expires_at) > new Date();

  if (!isActive) {
    return (
      <div className="h-full flex items-center justify-center gap-4 text-gray-500">
        <div className="text-3xl">🚂</div>
        <div>
          <div className="text-base font-semibold">Kein Hype Train</div>
          <div className="text-xs text-gray-600">Warte auf Subs & Bits...</div>
        </div>
      </div>
    );
  }

  const level = hypeTrainData.event_data?.level || 1;
  const progress = hypeTrainData.event_data?.progress || 0;
  const goal = hypeTrainData.event_data?.goal || 100;
  const percentage = Math.min((progress / goal) * 100, 100);
  
  // Berechne verbleibende Zeit
  const expiresAt = new Date(hypeTrainData.event_data?.expires_at);
  const now = new Date();
  const timeLeft = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;

  return (
    <div className="h-full flex items-center gap-4 p-2">
      <div className="text-3xl animate-bounce">🚂</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xl font-bold theme-text">Level {level}</div>
          <div className="text-xs theme-text-secondary">
            {minutesLeft}:{secondsLeft.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="w-full theme-tile-content-bg rounded-full h-3 mb-1">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-xs theme-text-secondary">
          {progress.toLocaleString()} / {goal.toLocaleString()} ({Math.round(percentage)}%)
        </div>
      </div>
    </div>
  );
}
