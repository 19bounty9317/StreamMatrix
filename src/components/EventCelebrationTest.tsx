import { triggerCelebration } from './EventCelebration';

export default function EventCelebrationTest() {
  const testEvents = [
    {
      type: 'sub' as const,
      username: 'TestUser123',
      message: 'Danke für den Stream!'
    },
    {
      type: 'gift-sub' as const,
      username: 'GenerousViewer',
      amount: 5
    },
    {
      type: 'bits' as const,
      username: 'BitsDonor',
      amount: 1000
    },
    {
      type: 'follow' as const,
      username: 'NewFollower'
    },
    {
      type: 'raid' as const,
      username: 'RaidingStreamer',
      amount: 250
    },
    {
      type: 'donation' as const,
      username: 'DonationUser',
      amount: 10
    },
    {
      type: 'hypetrain' as const,
      username: 'Community',
      amount: 3
    }
  ];

  return (
    <div className="p-8 space-y-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold theme-text mb-2">🎉 Event Celebration Test</h1>
        <p className="theme-text-secondary">
          Klicke auf die Buttons, um verschiedene Event-Effekte zu testen.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Sub */}
        <button
          onClick={() => triggerCelebration(testEvents[0])}
          className="p-6 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="text-4xl mb-2">⭐</div>
          <div>Test Sub</div>
        </button>

        {/* Gift Sub */}
        <button
          onClick={() => triggerCelebration(testEvents[1])}
          className="p-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="text-4xl mb-2">⭐⭐</div>
          <div>Test Gift Sub</div>
          <div className="text-xs mt-1">5 Subs</div>
        </button>

        {/* Bits */}
        <button
          onClick={() => triggerCelebration(testEvents[2])}
          className="p-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="text-4xl mb-2">💎</div>
          <div>Test Bits</div>
          <div className="text-xs mt-1">1000 Bits</div>
        </button>

        {/* Follow */}
        <button
          onClick={() => triggerCelebration(testEvents[3])}
          className="p-6 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="text-4xl mb-2">👤</div>
          <div>Test Follow</div>
        </button>

        {/* Raid */}
        <button
          onClick={() => triggerCelebration(testEvents[4])}
          className="p-6 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="text-4xl mb-2">🚀</div>
          <div>Test Raid</div>
          <div className="text-xs mt-1">250 Viewer</div>
        </button>

        {/* Donation */}
        <button
          onClick={() => triggerCelebration(testEvents[5])}
          className="p-6 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="text-4xl mb-2">💵</div>
          <div>Test Donation</div>
          <div className="text-xs mt-1">10€</div>
        </button>

        {/* Hype Train */}
        <button
          onClick={() => triggerCelebration(testEvents[6])}
          className="p-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="text-4xl mb-2">🚂</div>
          <div>Test Hype Train</div>
          <div className="text-xs mt-1">Level 3</div>
        </button>

        {/* Alle gleichzeitig */}
        <button
          onClick={() => {
            testEvents.forEach((event, index) => {
              setTimeout(() => triggerCelebration(event), index * 500);
            });
          }}
          className="p-6 rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="text-4xl mb-2">🎉</div>
          <div>Test Alle</div>
          <div className="text-xs mt-1">Nacheinander</div>
        </button>
      </div>

      <div className="mt-8 p-6 theme-tile-bg rounded-xl">
        <h2 className="text-xl font-bold theme-text mb-4">📋 Event-Typen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 theme-text-secondary text-sm">
          <div>
            <strong className="theme-text">⭐ Sub:</strong> Neues Abonnement
          </div>
          <div>
            <strong className="theme-text">⭐⭐ Gift Sub:</strong> Verschenkte Abos
          </div>
          <div>
            <strong className="theme-text">💎 Bits:</strong> Bits-Spende
          </div>
          <div>
            <strong className="theme-text">👤 Follow:</strong> Neuer Follower
          </div>
          <div>
            <strong className="theme-text">🚀 Raid:</strong> Eingehender Raid
          </div>
          <div>
            <strong className="theme-text">💵 Donation:</strong> Geldspende
          </div>
          <div>
            <strong className="theme-text">🚂 Hype Train:</strong> Hype Train Event
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
        <p className="text-sm theme-text">
          <strong>💡 Hinweis:</strong> Die Effekte erscheinen oben rechts und verschwinden automatisch nach 5 Sekunden.
          Der Emoji-Regen fällt über den gesamten Bildschirm.
        </p>
      </div>
    </div>
  );
}
