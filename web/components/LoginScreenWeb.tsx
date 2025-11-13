import { useState, useEffect } from 'react';
import { getWebAuthUrl } from '../config';

interface LoginScreenWebProps {
  onLogin: (token: string) => void;
}

export default function LoginScreenWeb({ onLogin }: LoginScreenWebProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prüfe ob wir von OAuth zurückkommen
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    if (token) {
      setIsLoading(true);
      onLogin(token);
      // Entferne Hash aus URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [onLogin]);

  const handleLogin = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authUrl = getWebAuthUrl();
      console.log('🚀 Redirecting to:', authUrl);
      window.location.href = authUrl;
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Login fehlgeschlagen. Bitte versuche es erneut.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-twitch-dark via-twitch-gray to-twitch-purple/20">
      <div className="bg-twitch-gray p-8 rounded-lg shadow-2xl w-96 border border-twitch-lightgray">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📺</div>
          <h1 className="text-3xl font-bold text-white mb-2">StreamMatrix Web</h1>
          <p className="text-gray-400">Dein Streaming-Dashboard im Browser</p>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-twitch-purple hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Verbinde...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
              Mit Twitch anmelden
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Sichere OAuth2-Authentifizierung</p>
          <p className="mt-2">Deine Daten bleiben in deinem Browser</p>
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded text-sm text-blue-200">
          <p className="font-semibold mb-2">💡 Hinweis:</p>
          <p>Dies ist die Web-Version von StreamMatrix. Für erweiterte Features wie System-Monitoring und Multi-Window-Support lade die Desktop-App herunter.</p>
        </div>
      </div>
    </div>
  );
}
