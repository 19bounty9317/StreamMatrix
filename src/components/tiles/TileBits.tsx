import { useState, useEffect } from 'react';
import { TwitchService } from '../../services/TwitchService';

export default function TileBits() {
  const [bitsData, setBitsData] = useState<any>(null);
  const [subCount, setSubCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'bits' | 'subs'>('overview');

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = TwitchService.getUserFromStorage();
        if (user) {
          const [bits, subs] = await Promise.all([
            TwitchService.getBitsLeaderboard(user.id),
            TwitchService.getSubscriberCount(user.id)
          ]);
          setBitsData(bits);
          setSubCount(subs);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // Aktualisiere alle 60 Sekunden
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-twitch-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const totalBits = bitsData?.data?.reduce((sum: number, entry: any) => sum + entry.score, 0) || 0;
  const topCheerer = bitsData?.data?.[0];
  
  // Berechne geschätzte Einnahmen (Dollar-Preise)
  // 100 Bits = $1.40 (Zuschauer zahlt) → Streamer erhält ~$1.00
  const bitsRevenue = (totalBits / 100) * 1.00; // $1 pro 100 Bits für Streamer
  
  // Tier 1 Sub = $4.99 → Streamer erhält ~$1.99 (ca. 40% nach Steuern/Gebühren)
  // Annahme: Alle Subs sind Tier 1 (häufigster Fall)
  const subsRevenue = subCount * 1.99; // $1.99 pro Tier 1 Sub
  
  const totalRevenue = bitsRevenue + subsRevenue;

  return (
    <div className="h-full flex flex-col">
      {/* Tab-Navigation */}
      <div className="flex gap-1 mb-3 border-b border-twitch-lightgray pb-2">
        <button
          onClick={() => setSelectedTab('overview')}
          className="flex-1 px-2 py-1 rounded text-xs transition-colors"
          style={{ backgroundColor: selectedTab === 'overview' ? 'var(--color-accent)' : 'var(--color-tile-content)', color: '#FFFFFF' }}
        >
          Übersicht
        </button>
        <button
          onClick={() => setSelectedTab('bits')}
          className="flex-1 px-2 py-1 rounded text-xs transition-colors"
          style={{ backgroundColor: selectedTab === 'bits' ? 'var(--color-accent)' : 'var(--color-tile-content)', color: '#FFFFFF' }}
        >
          💎 Bits
        </button>
        <button
          onClick={() => setSelectedTab('subs')}
          className="flex-1 px-2 py-1 rounded text-xs transition-colors"
          style={{ backgroundColor: selectedTab === 'subs' ? 'var(--color-accent)' : 'var(--color-tile-content)', color: '#FFFFFF' }}
        >
          ⭐ Subs
        </button>
      </div>

      {/* Übersicht Tab */}
      {selectedTab === 'overview' && (
        <div className="flex-1 space-y-3">
          <div className="theme-tile-content-bg p-3 rounded">
            <div className="text-xs theme-text-secondary mb-1">Geschätzte Einnahmen (Zeitraum)</div>
            <div className="text-3xl font-bold text-green-400">${totalRevenue.toFixed(2)}</div>
            <div className="text-xs theme-text-secondary mt-1">Nach Twitch-Anteil (50%)</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="theme-tile-content-bg p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💎</span>
                <span className="text-xs theme-text-secondary">Bits</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">{totalBits.toLocaleString()}</div>
              <div className="text-sm theme-text-secondary mt-1">${bitsRevenue.toFixed(2)}</div>
              <div className="text-xs theme-text-secondary">~$1 per 100 Bits</div>
            </div>

            <div className="theme-tile-content-bg p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <span className="text-xs theme-text-secondary">Subs (Tier 1)</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{subCount}</div>
              <div className="text-sm theme-text-secondary mt-1">${subsRevenue.toFixed(2)}</div>
              <div className="text-xs theme-text-secondary">$1.99 per Sub</div>
            </div>
          </div>
        </div>
      )}

      {/* Bits Tab */}
      {selectedTab === 'bits' && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-twitch-lightgray">
            <div className="text-2xl">💎</div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{totalBits.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Bits gesamt (${bitsRevenue.toFixed(2)})</div>
            </div>
          </div>
          
          {bitsData?.data && bitsData.data.length > 0 ? (
            <div className="flex-1 overflow-y-auto space-y-1">
              <div className="text-xs text-gray-400 mb-1">Top Cheerer:</div>
              {bitsData.data.slice(0, 15).map((entry: any, idx: number) => (
                <div key={entry.user_id} className="flex items-center justify-between text-sm py-1 theme-button rounded px-2">
                  <span className="text-gray-400">#{idx + 1} {entry.user_name}</span>
                  <span className="text-yellow-400 font-semibold">{entry.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Noch keine Bits erhalten
            </div>
          )}
        </div>
      )}

      {/* Subs Tab */}
      {selectedTab === 'subs' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">⭐</div>
          <div className="text-3xl font-bold text-purple-400 mb-1">{subCount}</div>
          <div className="text-sm text-gray-400 mb-3">Aktive Abonnenten (Tier 1)</div>
          <div className="text-lg text-green-400 font-semibold">≈ ${subsRevenue.toFixed(2)} / Monat</div>
          <div className="text-xs text-gray-500 mt-2">$1.99 pro Sub (nach Gebühren)</div>
          <div className="mt-4 text-xs text-gray-600 text-center">
            Tier 2 ($9.99) & Tier 3 ($24.99)<br />nicht berücksichtigt
          </div>
        </div>
      )}
    </div>
  );
}
