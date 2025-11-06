import { useState, useEffect } from 'react';
import NotificationService, { AlertEvent } from '../../services/NotificationService';

export default function TileAlerts() {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [celebrationMode, setCelebrationMode] = useState<'full' | 'visual' | 'off'>(() => {
    const saved = localStorage.getItem('celebration-mode');
    return (saved as 'full' | 'visual' | 'off') || 'full';
  });

  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    
    notificationService.onAlert((event) => {
      // Raids und Sub-Bomben (5+ Subs) anzeigen
      if (event.type === 'raid' || (event.type === 'subscriber' && event.amount && event.amount >= 5)) {
        setAlerts(prev => [event, ...prev].slice(0, 20));
      }
    });

    // Lade Raid-Alerts und Sub-Bomben aus der Historie
    const history = notificationService.getAlertHistory();
    setAlerts(history.filter(a => a.type === 'raid' || (a.type === 'subscriber' && a.amount && a.amount >= 5)));
  }, []);

  // Listener für Test-Events
  useEffect(() => {
    const handleTestEvent = (event: CustomEvent) => {
      const data = event.detail;
      console.log('🧪 Alerts Test Event empfangen:', data);
      
      // Raids und Sub-Bomben (5+ Gift Subs) anzeigen
      if (data.type === 'raid') {
        const testAlert: AlertEvent = {
          id: `test-${Date.now()}`,
          type: 'raid',
          username: data.username,
          amount: data.amount || 0,
          message: getTestAlertMessage(data),
          timestamp: new Date()
        };
        setAlerts(prev => [testAlert, ...prev].slice(0, 20));
      } else if (data.type === 'gift-sub' && data.amount && data.amount >= 5) {
        const testAlert: AlertEvent = {
          id: `test-${Date.now()}`,
          type: 'subscriber',
          username: data.username,
          amount: data.amount,
          message: getTestAlertMessage(data),
          timestamp: new Date()
        };
        setAlerts(prev => [testAlert, ...prev].slice(0, 20));
      }
    };

    const getTestAlertMessage = (data: any) => {
      switch (data.type) {
        case 'sub':
          return 'hat subscribed!';
        case 'gift-sub':
          return `hat ${data.amount || 1} Subs verschenkt!`;
        case 'bits':
          return `hat ${data.amount || 0} Bits gecheert!`;
        case 'follow':
          return 'folgt dir jetzt!';
        case 'raid':
          return `raidet mit ${data.amount || 0} Zuschauern!`;
        case 'donation':
          return `hat ${data.amount || 0}€ gespendet!`;
        default:
          return 'Test Event';
      }
    };

    window.addEventListener('test-event-trigger' as any, handleTestEvent);

    // Listener für Tile-Reload (beim Verlassen des Test-Modus)
    const handleReload = () => {
      // Entferne alle Test-Alerts
      setAlerts(prev => prev.filter(a => !a.id.startsWith('test-')));
    };
    window.addEventListener('reload-tiles' as any, handleReload);

    return () => {
      window.removeEventListener('test-event-trigger' as any, handleTestEvent);
      window.removeEventListener('reload-tiles' as any, handleReload);
    };
  }, []);

  const cycleCelebrationMode = () => {
    let newMode: 'full' | 'visual' | 'off';
    if (celebrationMode === 'full') {
      newMode = 'visual';
    } else if (celebrationMode === 'visual') {
      newMode = 'off';
    } else {
      newMode = 'full';
    }
    
    setCelebrationMode(newMode);
    localStorage.setItem('celebration-mode', newMode);
    
    // Trigger Event für EventCelebration
    const event = new CustomEvent('celebration-mode-change', { detail: newMode });
    window.dispatchEvent(event);
    
    // Auch NotificationService aktualisieren
    NotificationService.getInstance().setEnabled(newMode !== 'off');
  };

  const clearAlerts = () => {
    setAlerts([]);
    NotificationService.getInstance().clearHistory();
  };

  const sendShoutout = async (username: string) => {
    try {
      const { twitchChat } = await import('../../services/TwitchChatService');
      // Verwende den offiziellen Twitch /shoutout Befehl
      twitchChat.sendMessage(`/shoutout ${username}`);
      console.log(`✅ Shoutout gesendet an ${username}`);
    } catch (error) {
      console.error('Fehler beim Senden des Shoutouts:', error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'follower': return '🎉';
      case 'subscriber': return '⭐';
      case 'bits': return '💎';
      case 'raid': return '🚀';
      case 'host': return '📺';
      case 'donation': return '💵';
      default: return '🔔';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (

    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={cycleCelebrationMode}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              celebrationMode === 'full' ? 'bg-green-600 hover:bg-green-700 text-white' :
              celebrationMode === 'visual' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
              'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
            title={
              celebrationMode === 'full' ? 'Alles an: Benachrichtigung + Emoji-Regen' :
              celebrationMode === 'visual' ? 'Nur Visuell: Benachrichtigung ohne Emoji-Regen' :
              'Alles aus: Keine visuellen Effekte'
            }
          >
            {celebrationMode === 'full' ? '🔔 Voll' :
             celebrationMode === 'visual' ? '🎨 Visuell' :
             '🔕 Aus'}
          </button>
          <div className="text-xs theme-text-secondary">
            {celebrationMode === 'full' ? 'Benachrichtigung + Regen' :
             celebrationMode === 'visual' ? 'Nur Benachrichtigung' :
             'Keine Effekte'}
          </div>
        </div>
        <button
          onClick={clearAlerts}
          className="px-3 py-1 rounded text-xs bg-red-600 hover:bg-red-700"
        >
          🗑️ Löschen
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {alerts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🚀</div>
            <div className="text-sm theme-text">Keine Alerts bisher</div>
            <div className="text-xs mt-2 theme-text-secondary">Raids & Sub-Bomben (5+) werden hier angezeigt</div>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={index}
              className={`theme-tile-content-bg p-3 rounded border-l-4 ${
                alert.type === 'raid' ? 'border-red-500' : 'border-purple-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{alert.type === 'raid' ? '🚀' : '⭐'}</span>
                  <div>
                    <div className="font-semibold theme-text text-lg">
                      {alert.username}
                    </div>
                    <div className={`text-sm font-semibold ${
                      alert.type === 'raid' ? 'text-red-400' : 'text-purple-400'
                    }`}>
                      {alert.type === 'raid' 
                        ? `${alert.amount || 0} Zuschauer` 
                        : `${alert.amount || 0} Subs verschenkt`}
                    </div>
                  </div>
                </div>
                <span className="text-xs theme-text-secondary">
                  {formatTime(alert.timestamp)}
                </span>
              </div>
              {alert.type === 'raid' && (
                <button
                  onClick={() => sendShoutout(alert.username)}
                  className="w-full px-3 py-2 rounded bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  📢 Shoutout senden
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
