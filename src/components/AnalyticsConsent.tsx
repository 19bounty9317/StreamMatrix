// Consent-Dialog für Analytics und AGBs
import { useState } from 'react';
import AnalyticsService from '../services/AnalyticsService';

export default function AnalyticsConsent() {
  const [show, setShow] = useState(() => {
    const analyticsService = AnalyticsService.getInstance();
    return analyticsService.needsConsent();
  });

  const [showAgbs, setShowAgbs] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleAccept = async () => {
    await AnalyticsService.getInstance().setConsent(true, true);
    setShow(false);
  };

  const handleDecline = () => {
    // AGBs müssen akzeptiert werden, aber Analytics ist optional
    AnalyticsService.getInstance().setConsent(false, true);
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            🎮 Willkommen bei StreamMatrix!
          </h2>
          
          <div className="mb-6 text-gray-700 dark:text-gray-300">
            <p className="mb-4">
              Bevor du StreamMatrix nutzen kannst, müssen wir ein paar Dinge klären:
            </p>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2 text-purple-900 dark:text-purple-300">
                📋 Nutzungsbedingungen (AGBs)
              </h3>
              <p className="text-sm mb-2">
                Um StreamMatrix zu nutzen, musst du unseren AGBs zustimmen:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>StreamMatrix ist kostenlos und Open Source</li>
                <li>Du darfst den Code nicht für kommerzielle Zwecke nutzen</li>
                <li>Du darfst den Code nicht manipulieren oder weiterverbreiten</li>
                <li>Wir behalten uns vor, Accounts bei Verstößen zu sperren</li>
              </ul>
              <button
                onClick={() => setShowAgbs(true)}
                className="text-purple-600 dark:text-purple-400 text-sm hover:underline mt-2"
              >
                → Vollständige AGBs lesen
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2 text-blue-900 dark:text-blue-300">
                📊 Anonyme Nutzungsstatistiken (Optional)
              </h3>
              <p className="text-sm mb-2">
                Hilf uns, StreamMatrix zu verbessern! Mit deiner Zustimmung sammeln wir:
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-1 text-green-700 dark:text-green-400">
                    ✅ Was wir sammeln:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Dein Twitch-Kanal-Name</li>
                    <li>App-Version</li>
                    <li>Betriebssystem</li>
                    <li>Nutzungszeitpunkt</li>
                    <li>Code-Integrität (gegen Manipulation)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-red-700 dark:text-red-400">
                    ❌ Was wir NICHT sammeln:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Passwörter oder Tokens</li>
                    <li>Chat-Inhalte</li>
                    <li>Persönliche Daten</li>
                    <li>IP-Adressen</li>
                    <li>Standort-Daten</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowPrivacy(true)}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2"
              >
                → Datenschutzerklärung lesen
              </button>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2 text-yellow-900 dark:text-yellow-300">
                ⚠️ Code-Integrität & Account-Sicherheit
              </h3>
              <p className="text-sm">
                Wir prüfen die Integrität der App-Dateien, um Manipulation zu erkennen.
                Bei Verstößen gegen die AGBs (z.B. Code-Manipulation, Malware-Verbreitung)
                behalten wir uns vor, deinen Account zu sperren.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-sm">
              <p className="mb-2">
                <strong>Wichtig:</strong> Du kannst deine Einwilligung für Analytics jederzeit
                in den Einstellungen widerrufen. Die AGBs müssen jedoch akzeptiert werden,
                um StreamMatrix nutzen zu können.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAccept}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              ✅ Ich akzeptiere die AGBs und stimme Analytics zu
            </button>
            <button
              onClick={handleDecline}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              ⚠️ Ich akzeptiere nur die AGBs (ohne Analytics)
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Durch die Nutzung von StreamMatrix stimmst du den AGBs zu.
          </p>
        </div>
      </div>

      {/* AGBs Modal */}
      {showAgbs && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              📋 Allgemeine Geschäftsbedingungen (AGBs)
            </h2>
            
            <div className="prose dark:prose-invert max-w-none text-sm">
              <h3>1. Geltungsbereich</h3>
              <p>
                Diese AGBs gelten für die Nutzung von StreamMatrix, einer kostenlosen
                Desktop-Anwendung für Twitch-Streamer.
              </p>

              <h3>2. Nutzungsrechte</h3>
              <p>
                StreamMatrix ist Open Source Software unter der MIT-Lizenz.
                Du darfst die Software kostenlos nutzen, jedoch nicht:
              </p>
              <ul>
                <li>Für kommerzielle Zwecke ohne Genehmigung nutzen</li>
                <li>Den Code manipulieren oder modifizieren</li>
                <li>Die Software unter eigenem Namen weiterverbreiten</li>
                <li>Malware oder schädlichen Code einschleusen</li>
              </ul>

              <h3>3. Code-Integrität</h3>
              <p>
                Wir prüfen die Integrität der App-Dateien, um Manipulation zu erkennen.
                Bei Verstößen behalten wir uns vor, deinen Account zu sperren.
              </p>

              <h3>4. Haftungsausschluss</h3>
              <p>
                StreamMatrix wird "wie besehen" bereitgestellt. Wir übernehmen keine
                Haftung für Schäden, die durch die Nutzung entstehen.
              </p>

              <h3>5. Datenschutz</h3>
              <p>
                Siehe separate Datenschutzerklärung. Mit Analytics-Zustimmung sammeln
                wir anonyme Nutzungsstatistiken.
              </p>

              <h3>6. Änderungen</h3>
              <p>
                Wir behalten uns vor, diese AGBs jederzeit zu ändern. Änderungen werden
                in der App angezeigt.
              </p>

              <h3>7. Kontakt</h3>
              <p>
                Bei Fragen: streammatrix@web.de
              </p>
            </div>

            <button
              onClick={() => setShowAgbs(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold mt-6"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* Datenschutz Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              🔒 Datenschutzerklärung - Analytics
            </h2>
            
            <div className="prose dark:prose-invert max-w-none text-sm">
              <h3>1. Welche Daten sammeln wir?</h3>
              <p>Mit deiner Einwilligung sammeln wir:</p>
              <ul>
                <li><strong>Twitch-Kanal-Name:</strong> Um zu sehen, wer die App nutzt</li>
                <li><strong>App-Version:</strong> Um zu sehen, welche Versionen genutzt werden</li>
                <li><strong>Betriebssystem:</strong> Um Kompatibilität zu gewährleisten</li>
                <li><strong>Nutzungszeitpunkt:</strong> Um aktive User zu zählen</li>
                <li><strong>Code-Hash:</strong> Um Manipulation zu erkennen</li>
              </ul>

              <h3>2. Wie nutzen wir die Daten?</h3>
              <ul>
                <li>Verbesserung der App</li>
                <li>Fehleranalyse</li>
                <li>Nutzungsstatistiken</li>
                <li>Erkennung von Code-Manipulation</li>
              </ul>

              <h3>3. Wer hat Zugriff?</h3>
              <p>
                Nur der Entwickler hat Zugriff auf die Daten. Daten werden nicht
                an Dritte weitergegeben.
              </p>

              <h3>4. Wie lange speichern wir?</h3>
              <p>
                Daten werden gespeichert, solange du die App nutzt. Bei Opt-out
                werden Daten gelöscht.
              </p>

              <h3>5. Deine Rechte</h3>
              <ul>
                <li>Widerruf der Einwilligung jederzeit möglich</li>
                <li>Löschung deiner Daten auf Anfrage</li>
                <li>Auskunft über gespeicherte Daten</li>
              </ul>

              <h3>6. Kontakt</h3>
              <p>
                Datenschutz-Anfragen: streammatrix@web.de
              </p>
            </div>

            <button
              onClick={() => setShowPrivacy(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold mt-6"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
