import { useState, useEffect } from 'react';

interface EventData {
  type: 'sub' | 'bits' | 'follow' | 'raid' | 'donation' | 'hypetrain' | 'gift-sub';
  username: string;
  amount?: number;
  message?: string;
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
  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('celebration-duration');
    return saved ? parseInt(saved) : 5;
  });

  useEffect(() => {
    // Globaler Event-Listener für Celebrations
    const handleCelebration = (event: CustomEvent<EventData>) => {
      const newEvent: CelebrationEvent = {
        ...event.detail,
        id: `event-${Date.now()}-${Math.random()}`,
        timestamp: Date.now()
      };

      setEvents(prev => [...prev, newEvent]);

      // Erstelle Emoji-Regen
      createEmojiRain(newEvent.type);

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

  const createEmojiRain = (type: EventData['type']) => {
    const emoji = getEmojiForType(type);
    
    // Mehr Partikel für bestimmte Event-Typen
    let particleCount = 30; // Standard
    if (type === 'bits' || type === 'donation') {
      particleCount = 50; // Stärkerer Regen für Bits und Donations
    } else if (type === 'raid' || type === 'hypetrain') {
      particleCount = 60; // Noch stärker für Raids und Hype Trains
    } else if (type === 'gift-sub') {
      particleCount = 40; // Mittel für Gift Subs
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
      case 'bits':
        return '💎';
      case 'follow':
        return '👤';
      case 'raid':
        return '🚀';
      case 'donation':
        return '💵';
      case 'hypetrain':
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
      case 'bits':
        return `${event.username} hat ${event.amount || 0} Bits gespendet!`;
      case 'follow':
        return `${event.username} folgt jetzt!`;
      case 'raid':
        return `${event.username} raidet mit ${event.amount || 0} Zuschauern!`;
      case 'donation':
        return `${event.username} hat ${event.amount || 0}€ gespendet!`;
      case 'hypetrain':
        return `Hype Train Level ${event.amount || 1}!`;
      default:
        return `${event.username} - ${event.message || 'Event'}`;
    }
  };

  const getEventColor = (type: EventData['type']): string => {
    switch (type) {
      case 'sub':
      case 'gift-sub':
        return 'from-purple-500 to-purple-700';
      case 'bits':
        return 'from-blue-500 to-blue-700';
      case 'follow':
        return 'from-green-500 to-green-700';
      case 'raid':
        return 'from-red-500 to-red-700';
      case 'donation':
        return 'from-yellow-500 to-yellow-700';
      case 'hypetrain':
        return 'from-orange-500 to-orange-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <>
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
  const event = new CustomEvent('stream-celebration', {
    detail: eventData
  });
  window.dispatchEvent(event);
};
