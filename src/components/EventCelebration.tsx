import { useState, useEffect } from 'react';

interface EventData {
  type: 'sub' | 'bits' | 'follow' | 'raid' | 'donation' | 'hypetrain' | 'hypetrain-end' | 'gift-sub' | 'sub-bomb';
  username?: string;
  amount?: number;
  message?: string;
  level?: number;
  totalSubs?: number;
  totalBits?: number;
}

interface CelebrationEvent extends EventData {
  id: string;
  timestamp: number;
}

interface EmojiParticle {
  id: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  duration: number;
  delay: number;
}

export default function EventCelebration() {
  const [events, setEvents] = useState<CelebrationEvent[]>([]);
  const [particles, setParticles] = useState<EmojiParticle[]>([]);
  const [trainAnimation, setTrainAnimation] = useState<{ id: string; direction: 'left' | 'right'; level?: number } | null>(null);
  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('celebration-duration');
    return saved ? parseInt(saved) : 5;
  });
  const [celebrationMode, setCelebrationMode] = useState<'full' | 'visual' | 'off'>(() => {
    const saved = localStorage.getItem('celebration-mode');
    return (saved as 'full' | 'visual' | 'off') || 'full';
  });

  useEffect(() => {
    // Globaler Event-Listener für Celebrations
    const handleCelebration = (event: CustomEvent<EventData>) => {
      const newEvent: CelebrationEvent = {
        ...event.detail,
        id: `event-${Date.now()}-${Math.random()}`,
        timestamp: Date.now()
      };

      // Prüfe Celebration-Mode
      if (celebrationMode === 'off') {
        return; // Keine visuellen Effekte
      }

      setEvents(prev => [...prev, newEvent]);

      // Spezial-Animation für Hype Train (nur bei 'full' Mode)
      if (celebrationMode === 'full') {
        if (newEvent.type === 'hypetrain') {
          createTrainAnimation('left', newEvent.level || newEvent.amount);
          createEmojiRain(newEvent.type, newEvent.amount);
        } else if (newEvent.type === 'hypetrain-end') {
          createTrainAnimation('right', newEvent.level || newEvent.amount);
        } else {
          // Erstelle Emoji-Regen für andere Events
          createEmojiRain(newEvent.type, newEvent.amount);
        }
      }
      // Bei 'visual' Mode: Nur Benachrichtigung, kein Emoji-Regen

      // Entferne Event nach eingestellter Dauer
      setTimeout(() => {
        setEvents(prev => prev.filter(e => e.id !== newEvent.id));
      }, duration * 1000);
    };

    window.addEventListener('stream-celebration' as any, handleCelebration);

    return () => {
      window.removeEventListener('stream-celebration' as any, handleCelebration);
    };
  }, [duration]);

  // Listener für Dauer-Änderungen
  useEffect(() => {
    const handleDurationChange = (event: CustomEvent<number>) => {
      setDuration(event.detail);
      localStorage.setItem('celebration-duration', event.detail.toString());
    };

    window.addEventListener('celebration-duration-change' as any, handleDurationChange);

    return () => {
      window.removeEventListener('celebration-duration-change' as any, handleDurationChange);
    };
  }, []);

  // Listener für Celebration-Mode Änderungen
  useEffect(() => {
    const handleModeChange = (event: CustomEvent<'full' | 'visual' | 'off'>) => {
      setCelebrationMode(event.detail);
      localStorage.setItem('celebration-mode', event.detail);
    };

    window.addEventListener('celebration-mode-change' as any, handleModeChange);

    return () => {
      window.removeEventListener('celebration-mode-change' as any, handleModeChange);
    };
  }, []);

  const createTrainAnimation = (direction: 'left' | 'right', level?: number) => {
    const animationId = `train-${Date.now()}`;
    setTrainAnimation({ id: animationId, direction, level });

    // Entferne Animation nach 5 Sekunden
    setTimeout(() => {
      setTrainAnimation(null);
    }, 5000);
  };

  const createEmojiRain = (type: EventData['type'], amount?: number) => {
    const emoji = getEmojiForType(type);
    
    // Mehr Partikel für bestimmte Event-Typen
    let particleCount = 30; // Standard
    if (type === 'bits' || type === 'donation') {
      particleCount = 50; // Stärkerer Regen für Bits und Donations
    } else if (type === 'raid') {
      particleCount = 60; // Noch stärker für Raids
    } else if (type === 'gift-sub') {
      particleCount = 40; // Mittel für Gift Subs
    } else if (type === 'sub-bomb') {
      particleCount = 80; // Massiver Regen für Sub-Bomben (5+ Subs)
    } else if (type === 'hypetrain') {
      particleCount = Math.min(100, 40 + (amount || 0) * 10); // Mehr Partikel je höher das Level
    }
    
    const newParticles: EmojiParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        emoji,
        x: Math.random() * 100, // 0-100% der Bildschirmbreite
        y: -10, // Startet über dem Bildschirm
        rotation: Math.random() * 360,
        duration: 2 + Math.random() * 2, // 2-4 Sekunden
        delay: Math.random() * 0.8 // 0-0.8 Sekunden Verzögerung
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Entferne Partikel nach Animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, duration * 1000);
  };

  const getEmojiForType = (type: EventData['type']): string => {
    switch (type) {
      case 'sub':
      case 'gift-sub':
        return '⭐';
      case 'sub-bomb':
        return '💣'; // Spezial-Emoji für Sub-Bomben
      case 'bits':
        return '💎';
      case 'follow':
        return '👤';
      case 'raid':
        return '🚀';
      case 'donation':
        return '💵';
      case 'hypetrain':
      case 'hypetrain-end':
        return '🚂';
      default:
        return '🎉';
    }
  };

  const getEventMessage = (event: CelebrationEvent): string => {
    switch (event.type) {
      case 'sub':
        return `${event.username} hat abonniert!`;
      case 'gift-sub':
        return `${event.username} verschenkt ${event.amount || 1} Sub${(event.amount || 1) > 1 ? 's' : ''}!`;
      case 'sub-bomb':
        return `💣 ${event.username} hat ${event.amount || 5} Subs verschenkt! SUB-BOMBE!`;
      case 'bits':
        return `${event.username} hat ${event.amount || 0} Bits gespendet!`;
      case 'follow':
        return `${event.username} folgt jetzt!`;
      case 'raid':
        return `${event.username} raidet mit ${event.amount || 0} Zuschauern!`;
      case 'donation':
        return `${event.username} hat ${event.amount || 0}€ gespendet!`;
      case 'hypetrain':
        return `🚂 Hype Train Level ${event.level || event.amount || 1} gestartet!`;
      case 'hypetrain-end':
        return `🚂 Hype Train Level ${event.level || event.amount || 1} beendet!`;
      default:
        return `${event.username} - ${event.message || 'Event'}`;
    }
  };

  const getEventColor = (type: EventData['type']): string => {
    switch (type) {
      case 'sub':
      case 'gift-sub':
        return 'from-purple-500 to-purple-700';
      case 'sub-bomb':
        return 'from-pink-500 to-purple-700'; // Spezielle Farbe für Sub-Bomben
      case 'bits':
        return 'from-blue-500 to-blue-700';
      case 'follow':
        return 'from-green-500 to-green-700';
      case 'raid':
        return 'from-red-500 to-red-700';
      case 'donation':
        return 'from-yellow-500 to-yellow-700';
      case 'hypetrain':
      case 'hypetrain-end':
        return 'from-orange-500 to-orange-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <>
      {/* Hype Train Animation */}
      {trainAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center">
          <div
            className="text-9xl"
            style={{
              animation: trainAnimation.direction === 'left' 
                ? 'trainSlideLeft 5s ease-in-out forwards'
                : 'trainSlideRight 5s ease-in-out forwards',
              transform: trainAnimation.direction === 'right' ? 'scaleX(-1)' : 'none',
              filter: 'drop-shadow(0 0 20px rgba(255, 165, 0, 0.8))'
            }}
          >
            🚂🚂🚂
          </div>
        </div>
      )}

      {/* Emoji-Regen */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute text-6xl animate-fall"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: `rotate(${particle.rotation}deg)`,
              animation: `fall ${particle.duration}s linear ${particle.delay}s forwards`,
              opacity: 0.9
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      {/* Event-Benachrichtigungen */}
      <div className="fixed top-20 right-4 z-50 space-y-3 pointer-events-none">
        {events.map(event => (
          <div
            key={event.id}
            className="animate-slide-in-right"
            style={{
              animation: `slideInRight 0.5s ease-out, fadeOut 0.5s ease-in ${duration - 0.5}s forwards`
            }}
          >
            <div
              className={`relative overflow-hidden rounded-xl shadow-2xl backdrop-blur-md bg-gradient-to-r ${getEventColor(event.type)} bg-opacity-80 border border-white/20`}
              style={{
                minWidth: '320px',
                maxWidth: '400px'
              }}
            >
              {/* Frosted Glass Effect */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
              
              {/* Content */}
              <div className="relative p-4 flex items-center gap-4">
                {/* Emoji Icon */}
                <div className="text-6xl animate-bounce">
                  {getEmojiForType(event.type)}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <div className="text-white font-bold text-lg mb-1">
                    {getEventMessage(event)}
                  </div>
                  {event.message && (
                    <div className="text-white/80 text-sm">
                      {event.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-white/60"
                  style={{
                    animation: `shrink ${duration}s linear forwards`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes trainSlideLeft {
          0% {
            transform: translateX(100vw);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(-100vw);
            opacity: 0;
          }
        }

        @keyframes trainSlideRight {
          0% {
            transform: translateX(-100vw) scaleX(-1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) scaleX(-1);
            opacity: 0;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-fall {
          will-change: transform, opacity;
        }
      `}</style>
    </>
  );
}

// Helper-Funktion zum Triggern von Events
export const triggerCelebration = (eventData: EventData) => {
  // Trigger visuellen Effekt
  const celebrationEvent = new CustomEvent('stream-celebration', {
    detail: eventData
  });
  window.dispatchEvent(celebrationEvent);

  // Wenn Test-Modus aktiv, sende auch an Kacheln
  const isTestMode = localStorage.getItem('test-mode-active') === 'true';
  if (isTestMode) {
    // Trigger Event für Activity Feed, Alerts, etc.
    const tileEvent = new CustomEvent('test-event-trigger', {
      detail: eventData
    });
    window.dispatchEvent(tileEvent);

    // Aktualisiere Session-Stats
    import('../services/StreamSessionTracker').then(({ default: StreamSessionTracker }) => {
      const tracker = StreamSessionTracker.getInstance();
      if (eventData.type === 'follow') {
        tracker.addFollower();
      } else if (eventData.type === 'sub' || eventData.type === 'gift-sub') {
        tracker.addSub();
      }
    });
  }
};
