import { useState, useEffect } from 'react';

export default function Tutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('tutorial-seen');
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 2000);
    }

    // Listener für manuelles Öffnen des Tutorials
    const handleShowTutorial = () => {
      setCurrentStep(0);
      setShowTutorial(true);
    };

    window.addEventListener('show-tutorial' as any, handleShowTutorial);

    return () => {
      window.removeEventListener('show-tutorial' as any, handleShowTutorial);
    };
  }, []);

  const steps = [
    {
      title: '👋 Willkommen bei StreamMatrix!',
      content: 'Dein All-in-One Dashboard für Twitch Streaming. Lass uns dir die wichtigsten Features zeigen!',
      position: 'center'
    },
    {
      title: '📋 Kacheln verwalten',
      content: 'Klicke in der linken Sidebar auf eine Kachel, um sie ein-/auszublenden. Ziehe sie per Drag & Drop, um die Reihenfolge zu ändern.',
      position: 'left'
    },
    {
      title: '📐 Layout anpassen',
      content: 'Ziehe an den Ecken einer Kachel, um sie zu vergrößern oder zu verkleinern. Nutze A+/A- für die Schriftgröße.',
      position: 'center'
    },
    {
      title: '🎯 Schalter & Filter',
      content: 'Viele Kacheln haben Schalter: Live Viewer (Aktiv/Alle), Raid-Ziele (Live/Alle), Test-Modus in Settings.',
      position: 'center'
    },
    {
      title: '🚀 Raid-Alerts',
      content: 'Bei Raids erscheint eine Benachrichtigung mit Shoutout-Button. Ein Klick sendet automatisch /shoutout!',
      position: 'center'
    },
    {
      title: '🚂 Hype Train',
      content: 'Aktiviere die Hype Train Kachel! Sie zeigt Level, Progress und Details. Nach Ende erscheint ein Eintrag im Activity Feed.',
      position: 'center'
    },
    {
      title: '⚙️ Einstellungen',
      content: 'Klicke auf das Zahnrad für Themes, OBS-Integration, Test-Modus und mehr. Test-Modus simuliert Events!',
      position: 'center'
    },
    {
      title: '🎉 Los geht\'s!',
      content: 'Du kannst dieses Tutorial jederzeit über "Tutorial" in der Sidebar neu starten. Viel Erfolg beim Streamen!',
      position: 'center'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };

  const handleSkip = () => {
    closeTutorial();
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorial-seen', 'true');
  };

  if (!showTutorial) return null;

  const step = steps[currentStep];

  return (

    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-twitch-gray rounded-lg border-2 border-twitch-purple max-w-md w-full p-6 relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
          <p className="text-gray-300">{step.content}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-twitch-purple' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-400 text-sm">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
          >
            Überspringen
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 bg-twitch-purple hover:bg-purple-600 rounded text-white font-semibold"
          >
            {currentStep < steps.length - 1 ? 'Weiter' : 'Los geht\'s!'}
          </button>
        </div>
      </div>
    </div>
  );
}
