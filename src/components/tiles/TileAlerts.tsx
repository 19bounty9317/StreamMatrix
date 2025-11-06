import { useState, useEffect } from 'react';
import NotificationService, { AlertEvent } from '../../services/NotificationService';

export default function TileAlerts() {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    
    notificationService.onAlert((event) => {
      setAlerts(prev => [event, ...prev].slice(0, 20));
    });

    setAlerts(notificationService.getAlertHistory());
  }, []);

  // Listener für Test-Events
  useEffect(() => {
    const handleTestEvent = (event: CustomEvent) => {
      const data = event.detail;
      console.log('🧪 Alerts Test Event empfangen:', data);
      
      const testAlert: AlertEvent = {
        id: `test-${Date.now()}`,
        type: data.type === 'sub' || data.type === 'gift-sub' ? 'subscriber' : 
              data.type === 'follow' ? 'follower' :
              data.type === 'bits' || data.type === 'donation' ? 'bits' :
              data.type === 'raid' ? 'raid' : 'other',
        username: data.username,
        message: getTestAlertMessage(data),
        timestamp: new Date()
      };
      
      setAlerts(prev => [testAlert, ...prev].slice(0, 20));
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

    return () => {
      window.removeEventListener('test-event-trigger' as any, handleTestEvent);
    };
  }, []);

  const toggleNotifications = () => {
    const newState = !enabled;
    setEnabled(newState);
    NotificationService.getInstance().setEnabled(newState);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    NotificationService.getInstance().setSoundEnabled(newState);
  };

  const clearAlerts = () => {
    setAlerts([]);
    NotificationService.getInstance().clearHistory();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'follower': return '🎉';
      case 'subscriber': return '⭐';
      case 'bits': return '💎';
      case 'raid': return '🚀';
      case 'host': return '📺';
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
            onClick={toggleNotifications}
            className={`px-3 py-1 rounded text-xs ${
              enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {enabled ? '🔔 An' : '🔕 Aus'}
          </button>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 rounded text-xs ${
              soundEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {soundEnabled ? '🔊 Sound' : '🔇 Stumm'}
          </button>
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
            Keine Alerts bisher
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={index}
              className="theme-tile-content-bg p-3 rounded border-l-4"
              style={{ borderLeftColor: 'var(--color-accent)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{getAlertIcon(alert.type)}</span>
                  <div>
                    <div className="font-semibold theme-text">
                      {alert.username}
                    </div>
                    <div className="text-sm theme-text-secondary">
                      {alert.type === 'bits' && `${alert.amount} Bits`}
                      {alert.type === 'raid' && `${alert.amount} Zuschauer`}
                      {alert.type === 'follower' && 'Neuer Follower'}
                      {alert.type === 'subscriber' && 'Neuer Sub'}
                    </div>
                  </div>
                </div>
                <span className="text-xs theme-text-secondary">
                  {formatTime(alert.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
