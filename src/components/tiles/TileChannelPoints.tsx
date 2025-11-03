import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

interface Redemption {
  id: string;
  user_name: string;
  user_input?: string;
  reward: {
    id: string;
    title: string;
    cost: number;
  };
  redeemed_at: string;
  status: string;
}

export default function TileChannelPoints() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'UNFULFILLED' | 'FULFILLED' | 'CANCELED'>('UNFULFILLED');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRedemptions();
  }, [filter]);

  const loadRedemptions = async () => {
    setIsLoading(true);
    try {
      const user = TwitchService.getUserFromStorage();
      if (user) {
        const data = await TwitchService.getChannelPointRedemptions(user.id, filter);
        setRedemptions(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einlösungen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFulfill = async (redemption: Redemption) => {
    try {
      const user = TwitchService.getUserFromStorage();
      if (user) {
        await TwitchService.updateRedemptionStatus(
          user.id,
          redemption.reward.id,
          redemption.id,
          'FULFILLED'
        );
        // Entferne aus Liste
        setRedemptions(prev => prev.filter(r => r.id !== redemption.id));
      }
    } catch (error) {
      console.error('Fehler beim Bestätigen:', error);
    }
  };

  const handleRefund = async (redemption: Redemption) => {
    try {
      const user = TwitchService.getUserFromStorage();
      if (user) {
        await TwitchService.updateRedemptionStatus(
          user.id,
          redemption.reward.id,
          redemption.id,
          'CANCELED'
        );
        // Entferne aus Liste
        setRedemptions(prev => prev.filter(r => r.id !== redemption.id));
      }
    } catch (error) {
      console.error('Fehler beim Erstatten:', error);
    }
  };

  const handleBulkFulfill = async () => {
    const user = TwitchService.getUserFromStorage();
    if (!user) return;

    for (const id of selectedIds) {
      const redemption = redemptions.find(r => r.id === id);
      if (redemption) {
        try {
          await TwitchService.updateRedemptionStatus(
            user.id,
            redemption.reward.id,
            redemption.id,
            'FULFILLED'
          );
        } catch (error) {
          console.error('Fehler bei Bulk-Bestätigung:', error);
        }
      }
    }
    setRedemptions(prev => prev.filter(r => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  const handleBulkRefund = async () => {
    const user = TwitchService.getUserFromStorage();
    if (!user) return;

    for (const id of selectedIds) {
      const redemption = redemptions.find(r => r.id === id);
      if (redemption) {
        try {
          await TwitchService.updateRedemptionStatus(
            user.id,
            redemption.reward.id,
            redemption.id,
            'CANCELED'
          );
        } catch (error) {
          console.error('Fehler bei Bulk-Erstattung:', error);
        }
      }
    }
    setRedemptions(prev => prev.filter(r => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(redemptions.map(r => r.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-twitch-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {selectedIds.size > 0 && filter === 'UNFULFILLED' && (
        <div className="mb-2 p-2 bg-twitch-purple rounded flex items-center justify-between">
          <span className="text-sm">{selectedIds.size} ausgewählt</span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkFulfill}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
            >
              ✓ Alle bestätigen
            </button>
            <button
              onClick={handleBulkRefund}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
            >
              ↩ Alle erstatten
            </button>
            <button
              onClick={deselectAll}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-3 pb-2 border-b border-twitch-lightgray">
        <button
          onClick={() => setFilter('UNFULFILLED')}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            filter === 'UNFULFILLED'
              ? 'bg-twitch-purple text-white'
              : 'bg-twitch-lightgray text-gray-400 hover:text-white'
          }`}
        >
          Offen ({redemptions.length})
        </button>
        <button
          onClick={() => setFilter('FULFILLED')}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            filter === 'FULFILLED'
              ? 'bg-twitch-purple text-white'
              : 'bg-twitch-lightgray text-gray-400 hover:text-white'
          }`}
        >
          Bestätigt
        </button>
        <button
          onClick={() => setFilter('CANCELED')}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            filter === 'CANCELED'
              ? 'bg-twitch-purple text-white'
              : 'bg-twitch-lightgray text-gray-400 hover:text-white'
          }`}
        >
          Erstattet
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {redemptions.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="text-4xl mb-2">🎁</div>
            <div className="text-sm">Keine Einlösungen</div>
          </div>
        )}

        {filter === 'UNFULFILLED' && redemptions.length > 1 && (
          <div className="mb-2 flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 bg-twitch-lightgray hover:bg-twitch-purple rounded text-xs"
            >
              Alle auswählen
            </button>
          </div>
        )}

        {redemptions.map((redemption) => (
          <div key={redemption.id} className="theme-tile-content-bg p-3 rounded border theme-border" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between items-start mb-2">
              {filter === 'UNFULFILLED' && (
                <input
                  type="checkbox"
                  checked={selectedIds.has(redemption.id)}
                  onChange={() => toggleSelection(redemption.id)}
                  className="mr-2 mt-1"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="theme-text font-medium">{redemption.user_name}</span>
                  <span className="text-xs theme-text-secondary">{formatTime(redemption.redeemed_at)}</span>
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>{redemption.reward.title}</div>
                <div className="theme-text-secondary text-xs">{redemption.reward.cost.toLocaleString()} Punkte</div>
              </div>
            </div>

            {redemption.user_input && (
              <div className="theme-tile-content-bg p-2 rounded mb-2 text-sm theme-text" style={{ border: '1px solid var(--color-border)' }}>
                💬 {redemption.user_input}
              </div>
            )}

            {filter === 'UNFULFILLED' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleFulfill(redemption)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  ✓ Bestätigen
                </button>
                <button
                  onClick={() => handleRefund(redemption)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  ↩ Erstatten
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
