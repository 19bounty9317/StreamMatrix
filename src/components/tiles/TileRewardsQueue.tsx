import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

interface Redemption {
  id: string;
  user_id: string;
  user_name: string;
  user_input: string;
  status: 'UNFULFILLED' | 'FULFILLED' | 'CANCELED';
  reward: {
    id: string;
    title: string;
    cost: number;
    prompt: string;
  };
  redeemed_at: string;
}

export default function TileRewardsQueue() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRedemptions = async () => {
    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) return;

      const data = await TwitchService.getChannelPointRedemptions(user.id, 'UNFULFILLED');
      setRedemptions(data);
      setError(null);
    } catch (err: any) {
      console.error('Fehler beim Laden der Redemptions:', err);
      setError(err.response?.data?.message || 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRedemptions();
    
    // Aktualisiere alle 10 Sekunden
    const interval = setInterval(loadRedemptions, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Listener für neue Redemptions aus Chat
  useEffect(() => {
    const handleRedemption = (event: CustomEvent) => {
      const data = event.detail;
      console.log('🎁 Channel Points Redemption:', data);
      
      // Reload Redemptions
      loadRedemptions();
    };

    window.addEventListener('channel-points-redemption' as any, handleRedemption);

    return () => {
      window.removeEventListener('channel-points-redemption' as any, handleRedemption);
    };
  }, []);

  const handleFulfill = async (redemption: Redemption) => {
    setProcessing(redemption.id);
    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) return;

      await TwitchService.updateRedemptionStatus(
        user.id,
        redemption.reward.id,
        redemption.id,
        'FULFILLED'
      );

      // Entferne aus Liste
      setRedemptions(prev => prev.filter(r => r.id !== redemption.id));
      
      // Zeige Erfolg im Chat (optional)
      const event = new CustomEvent('system-message', {
        detail: {
          message: `✅ Reward "${redemption.reward.title}" von ${redemption.user_name} bestätigt`,
          type: 'success'
        }
      });
      window.dispatchEvent(event);
    } catch (err: any) {
      console.error('Fehler beim Bestätigen:', err);
      alert('Fehler beim Bestätigen: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(null);
    }
  };

  const handleCancel = async (redemption: Redemption) => {
    setProcessing(redemption.id);
    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) return;

      await TwitchService.updateRedemptionStatus(
        user.id,
        redemption.reward.id,
        redemption.id,
        'CANCELED'
      );

      // Entferne aus Liste
      setRedemptions(prev => prev.filter(r => r.id !== redemption.id));
      
      // Zeige Info im Chat
      const event = new CustomEvent('system-message', {
        detail: {
          message: `❌ Reward "${redemption.reward.title}" von ${redemption.user_name} abgelehnt`,
          type: 'error'
        }
      });
      window.dispatchEvent(event);
    } catch (err: any) {
      console.error('Fehler beim Ablehnen:', err);
      alert('Fehler beim Ablehnen: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(null);
    }
  };

  const handleRefund = async (redemption: Redemption) => {
    if (!confirm(`Punkte an ${redemption.user_name} erstatten?\n\nDies gibt ${redemption.reward.cost} Punkte zurück.`)) {
      return;
    }

    setProcessing(redemption.id);
    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) return;

      // CANCELED gibt automatisch Punkte zurück
      await TwitchService.updateRedemptionStatus(
        user.id,
        redemption.reward.id,
        redemption.id,
        'CANCELED'
      );

      // Entferne aus Liste
      setRedemptions(prev => prev.filter(r => r.id !== redemption.id));
      
      // Zeige Erfolg im Chat
      const event = new CustomEvent('system-message', {
        detail: {
          message: `💰 ${redemption.reward.cost} Punkte an ${redemption.user_name} erstattet`,
          type: 'info'
        }
      });
      window.dispatchEvent(event);
    } catch (err: any) {
      console.error('Fehler beim Erstatten:', err);
      alert('Fehler beim Erstatten: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(null);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Gerade eben';
    if (minutes < 60) return `vor ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `vor ${hours}h`;
    return date.toLocaleDateString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-sm theme-text-secondary">Lade Redemptions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-sm theme-text-secondary">{error}</div>
          <button
            onClick={loadRedemptions}
            className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-twitch-lightgray">
        <span className="text-xs text-gray-400">
          {redemptions.length} {redemptions.length === 1 ? 'Redemption' : 'Redemptions'}
        </span>
        <button
          onClick={loadRedemptions}
          className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
          title="Aktualisieren"
        >
          🔄
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {redemptions.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="text-4xl mb-2">🎁</div>
            <div className="text-sm theme-text">Keine offenen Redemptions</div>
            <div className="text-xs mt-2 theme-text-secondary">
              Channel Points Einlösungen erscheinen hier
            </div>
          </div>
        )}
        
        {redemptions.map(redemption => (
          <div 
            key={redemption.id} 
            className="p-3 theme-tile-content-bg rounded border theme-border"
            style={{ 
              borderColor: 'var(--color-border)',
              opacity: processing === redemption.id ? 0.6 : 1
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎁</span>
                  <h3 className="theme-text font-bold truncate">
                    {redemption.reward.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs theme-text-secondary">
                  <span className="font-semibold text-purple-400">
                    {redemption.user_name}
                  </span>
                  <span>•</span>
                  <span>{formatTime(redemption.redeemed_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-600/20 rounded text-xs font-bold text-purple-400">
                <span>💎</span>
                <span>{redemption.reward.cost.toLocaleString('de-DE')}</span>
              </div>
            </div>

            {/* User Input */}
            {redemption.user_input && (
              <div className="mb-3 p-2 bg-black/20 rounded">
                <div className="text-xs theme-text-secondary mb-1">Nachricht:</div>
                <div className="text-sm theme-text break-words">
                  {redemption.user_input}
                </div>
              </div>
            )}

            {/* Prompt */}
            {redemption.reward.prompt && (
              <div className="mb-3 text-xs theme-text-secondary italic">
                "{redemption.reward.prompt}"
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFulfill(redemption)}
                disabled={processing === redemption.id}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                title="Bestätigen"
              >
                <span>✅</span>
                <span>Bestätigen</span>
              </button>
              
              <button
                onClick={() => handleCancel(redemption)}
                disabled={processing === redemption.id}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                title="Ablehnen"
              >
                <span>❌</span>
                <span>Ablehnen</span>
              </button>
              
              <button
                onClick={() => handleRefund(redemption)}
                disabled={processing === redemption.id}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                title="Punkte erstatten"
              >
                <span>💰</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
