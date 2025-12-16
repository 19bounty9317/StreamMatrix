import { useState, useEffect } from 'react';

export default function TestModeCleanupNotification() {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const handleCountdown = (event: CustomEvent<number>) => {
      const value = event.detail;
      setCountdown(value > 0 ? value : null);
      
      if (value === 0) {
        // Zeige kurz "Abgeschlossen" Nachricht
        setTimeout(() => setCountdown(null), 3000);
      }
    };

    window.addEventListener('test-mode-cleanup-countdown', handleCountdown as EventListener);
    
    return () => {
      window.removeEventListener('test-mode-cleanup-countdown', handleCountdown as EventListener);
    };
  }, []);

  if (countdown === null) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="p-4 rounded-lg shadow-2xl border-2 max-w-sm"
           style={{
             backgroundColor: 'var(--color-tile)',
             borderColor: countdown > 0 ? '#f97316' : '#22c55e'
           }}>
        {countdown > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">⏰</div>
              <div>
                <div className="font-bold theme-text">Test-Modus endet</div>
                <div className="text-xs theme-text-secondary">
                  5 Minuten Test-Zeit abgelaufen
                </div>
              </div>
            </div>
            
            <div className="text-center mb-3">
              <div className="text-4xl font-bold theme-text">
                {countdown}s
              </div>
              <div className="text-xs theme-text-secondary mt-1">
                Test-Daten werden gelöscht...
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-orange-700 transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 30) * 100}%` }}
              />
            </div>
            
            <div className="text-xs theme-text-secondary text-center">
              Echte Daten (isReal=true) bleiben erhalten
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="text-3xl">✅</div>
              <div>
                <div className="font-bold theme-text">Cleanup abgeschlossen!</div>
                <div className="text-xs theme-text-secondary">
                  Alle Test-Daten wurden entfernt
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
