import { useState, useEffect } from 'react';

export default function Tutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('tutorial-seen');
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 2000);
    }
  }, []);

  const steps = [
    {
      title: '👋 Willkommen bei StreamMatrix!',
      content: 'Lass uns dir zeigen, wie du das Dashboard nutzt.',
      position: 'center'
    },
    {
      title: '📋 Kacheln aktivieren',
      content: 'Klicke in der linken Sidebar auf eine Kachel, um sie ein-/auszublenden.',
      position: 'left'
    },
    {
      title: '🔄 Kacheln sortieren',
      content: 'Ziehe Kacheln in der Sidebar per Drag & Drop, um die Reihenfolge zu ändern.',
      position: 'left'
    },
    {
      title: '📐 Größe anpassen',
      content: 'Ziehe an den Ecken einer Kachel, um sie zu vergrößern oder zu verkleinern.',
      position: 'center'
    },
    {
      title: '🔤 Schriftgröße',
      content: 'Nutze die A+ und A- Buttons in der Titelleiste jeder Kachel.',
      position: 'center'
    },
    {
      title: '✕ Kacheln schließen',
      content: 'Klicke auf das ✕ in der Titelleiste, um eine Kachel zu schließen.',
      position: 'center'
    },
    {
      title: '🎉 Fertig!',
      content: 'Du kannst dieses Tutorial jederzeit über das Fragezeichen-Icon neu starten.',
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
