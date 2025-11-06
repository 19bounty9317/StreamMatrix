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
          className="p-6 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">⭐</div>
          <div>Test Sub</div>
          <div className="text-xs mt-1 opacity-80">1 Abo</div>
        </button>

        {/* Gift Sub */}
        <button
          onClick={() => triggerCelebration(testEvents[1])}
          className="p-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">⭐⭐</div>
          <div>Test Gift Sub</div>
          <div className="text-xs mt-1 opacity-80">5 Subs verschenkt</div>
        </button>

        {/* Bits - Klein */}
        <button
          onClick={() => triggerCelebration({
            type: 'bits',
            username: 'SmallBitsDonor',
            amount: 100
          })}
          className="p-6 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">💎</div>
          <div>Test Bits</div>
          <div className="text-xs mt-1 opacity-80">100 Bits</div>
        </button>

        {/* Bits - Groß */}
        <button
          onClick={() => triggerCelebration(testEvents[2])}
          className="p-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">💎💎</div>
          <div>Test Bits</div>
          <div className="text-xs mt-1 opacity-80">1000 Bits</div>
        </button>

        {/* Follow */}
        <button
          onClick={() => triggerCelebration(testEvents[3])}
          className="p-6 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">👤</div>
          <div>Test Follow</div>
          <div className="text-xs mt-1 opacity-80">Neuer Follower</div>
        </button>

        {/* Raid - Klein */}
        <button
          onClick={() => triggerCelebration({
            type: 'raid',
            username: 'SmallRaider',
            amount: 10
          })}
          className="p-6 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">🚀</div>
          <div>Test Raid</div>
          <div className="text-xs mt-1 opacity-80">10 Viewer</div>
        </button>

        {/* Raid - Groß */}
        <button
          onClick={() => triggerCelebration(testEvents[4])}
          className="p-6 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">🚀🚀</div>
          <div>Test Raid</div>
          <div className="text-xs mt-1 opacity-80">250 Viewer</div>
        </button>

        {/* Donation - Klein */}
        <button
          onClick={() => triggerCelebration({
            type: 'donation',
            username: 'SmallDonor',
            amount: 2
          })}
          className="p-6 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">💵</div>
          <div>Test Donation</div>
          <div className="text-xs mt-1 opacity-80">2€</div>
        </button>

        {/* Donation - Groß */}
        <button
          onClick={() => triggerCelebration(testEvents[5])}
          className="p-6 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">💵💵</div>
          <div>Test Donation</div>
          <div className="text-xs mt-1 opacity-80">10€</div>
        </button>

        {/* Hype Train - Level 1 */}
        <button
          onClick={() => triggerCelebration({
            type: 'hypetrain',
            username: 'Community',
            amount: 1
          })}
          className="p-6 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">🚂</div>
          <div>Test Hype Train</div>
          <div className="text-xs mt-1 opacity-80">Level 1</div>
        </button>

        {/* Hype Train - Level 5 */}
        <button
          onClick={() => triggerCelebration({
            type: 'hypetrain',
            username: 'Community',
            amount: 5
          })}
          className="p-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">🚂🚂</div>
          <div>Test Hype Train</div>
          <div className="text-xs mt-1 opacity-80">Level 5</div>
        </button>

        {/* Hype Train Ende */}
        <button
          onClick={() => triggerCelebration({
            type: 'hypetrain-end',
            username: 'Community',
            amount: 3
          })}
          className="p-6 rounded-xl bg-gradient-to-r from-orange-600 to-orange-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">🚂✅</div>
          <div>Test Hype Train Ende</div>
          <div className="text-xs mt-1 opacity-80">Level 3 beendet</div>
        </button>

        {/* Spam Test */}
        <button
          onClick={() => {
            for (let i = 0; i < 5; i++) {
              setTimeout(() => {
                const randomEvent = testEvents[Math.floor(Math.random() * testEvents.length)];
                triggerCelebration(randomEvent);
              }, i * 300);
            }
          }}
          className="p-6 rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">🎊</div>
          <div>Spam Test</div>
          <div className="text-xs mt-1 opacity-80">5x Random</div>
        </button>

        {/* Alle nacheinander */}
        <button
          onClick={() => {
            testEvents.forEach((event, index) => {
              setTimeout(() => triggerCelebration(event), index * 800);
            });
          }}
          className="p-6 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-4xl mb-2">🎉</div>
          <div>Test Alle</div>
          <div className="text-xs mt-1 opacity-80">Nacheinander</div>
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
            <strong className="theme-text">🚂 Hype Train:</strong> Hype Train Start
          </div>
          <div>
            <strong className="theme-text">🚂✅ Hype Train Ende:</strong> Hype Train beendet
          </div>
        </div>
      </div>

      {/* Custom Event Tester */}
      <div className="mt-8 p-6 theme-tile-bg rounded-xl">
        <h2 className="text-xl font-bold theme-text mb-4">🎮 Eigene Events testen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom Sub */}
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <h3 className="font-bold theme-text mb-2">⭐ Custom Sub</h3>
            <input
              type="text"
              placeholder="Username"
              id="sub-username"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <button
              onClick={() => {
                const username = (document.getElementById('sub-username') as HTMLInputElement)?.value || 'TestUser';
                triggerCelebration({ type: 'sub', username });
              }}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition-colors"
            >
              Trigger Sub
            </button>
          </div>

          {/* Custom Bits */}
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <h3 className="font-bold theme-text mb-2">💎 Custom Bits</h3>
            <input
              type="text"
              placeholder="Username"
              id="bits-username"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <input
              type="number"
              placeholder="Anzahl Bits"
              id="bits-amount"
              defaultValue="100"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <button
              onClick={() => {
                const username = (document.getElementById('bits-username') as HTMLInputElement)?.value || 'TestUser';
                const amount = parseInt((document.getElementById('bits-amount') as HTMLInputElement)?.value || '100');
                triggerCelebration({ type: 'bits', username, amount });
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
            >
              Trigger Bits
            </button>
          </div>

          {/* Custom Raid */}
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <h3 className="font-bold theme-text mb-2">🚀 Custom Raid</h3>
            <input
              type="text"
              placeholder="Username"
              id="raid-username"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <input
              type="number"
              placeholder="Anzahl Viewer"
              id="raid-amount"
              defaultValue="50"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <button
              onClick={() => {
                const username = (document.getElementById('raid-username') as HTMLInputElement)?.value || 'TestRaider';
                const amount = parseInt((document.getElementById('raid-amount') as HTMLInputElement)?.value || '50');
                triggerCelebration({ type: 'raid', username, amount });
              }}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors"
            >
              Trigger Raid
            </button>
          </div>

          {/* Custom Donation */}
          <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <h3 className="font-bold theme-text mb-2">💵 Custom Donation</h3>
            <input
              type="text"
              placeholder="Username"
              id="dono-username"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <input
              type="number"
              placeholder="Betrag in €"
              id="dono-amount"
              defaultValue="5"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <button
              onClick={() => {
                const username = (document.getElementById('dono-username') as HTMLInputElement)?.value || 'TestDonor';
                const amount = parseInt((document.getElementById('dono-amount') as HTMLInputElement)?.value || '5');
                triggerCelebration({ type: 'donation', username, amount });
              }}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-semibold transition-colors"
            >
              Trigger Donation
            </button>
          </div>

          {/* Custom Follow */}
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <h3 className="font-bold theme-text mb-2">👤 Custom Follow</h3>
            <input
              type="text"
              placeholder="Username"
              id="follow-username"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <button
              onClick={() => {
                const username = (document.getElementById('follow-username') as HTMLInputElement)?.value || 'NewFollower';
                triggerCelebration({ type: 'follow', username });
              }}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
            >
              Trigger Follow
            </button>
          </div>

          {/* Custom Gift Sub */}
          <div className="p-4 bg-purple-600/10 rounded-lg border border-purple-600/30">
            <h3 className="font-bold theme-text mb-2">⭐⭐ Custom Gift Sub</h3>
            <input
              type="text"
              placeholder="Username"
              id="giftsub-username"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <input
              type="number"
              placeholder="Anzahl Subs"
              id="giftsub-amount"
              defaultValue="5"
              className="w-full px-3 py-2 theme-input rounded mb-2"
            />
            <button
              onClick={() => {
                const username = (document.getElementById('giftsub-username') as HTMLInputElement)?.value || 'Gifter';
                const amount = parseInt((document.getElementById('giftsub-amount') as HTMLInputElement)?.value || '5');
                triggerCelebration({ type: 'gift-sub', username, amount });
              }}
              className="w-full px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded font-semibold transition-colors"
            >
              Trigger Gift Sub
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
        <p className="text-sm theme-text">
          <strong>💡 Hinweis:</strong> Die Effekte erscheinen oben rechts und verschwinden automatisch nach 5 Sekunden.
          Der Emoji-Regen fällt über den gesamten Bildschirm.
        </p>
      </div>

      <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
        <p className="text-sm theme-text">
          <strong>✅ Test-Modus aktiv:</strong> Du befindest dich im Test-Branch. Klicke auf "← Zurück zum Dashboard" 
          um zur normalen Ansicht zurückzukehren.
        </p>
      </div>
    </div>
  );
}
