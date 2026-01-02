import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import UserModerationModal from './components/UserModerationModal';
import { getTheme, applyTheme } from './styles/themes';
import './index.css';

// Hole User-Daten aus URL-Parametern
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username') || '';
const userId = urlParams.get('userId') || undefined;
const userColor = urlParams.get('userColor') || '#9147FF';

// Hole Messages aus localStorage (wurden vom Hauptfenster gesetzt)
const messagesJson = localStorage.getItem('user-modal-messages');
let allMessages = [];

console.log('🔍 localStorage user-modal-messages:', messagesJson ? 'vorhanden' : 'nicht vorhanden');

if (messagesJson) {
  try {
    const parsed = JSON.parse(messagesJson);
    console.log('📦 Parsed messages (raw):', parsed);
    console.log('📦 Anzahl Messages:', Array.isArray(parsed) ? parsed.length : 'nicht array');
    
    // Konvertiere timestamp strings zurück zu Date-Objekten
    allMessages = parsed.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    console.log('✅ Messages geladen:', allMessages.length);
    if (allMessages.length > 0) {
      console.log('📝 Erste Message:', allMessages[0]);
      console.log('📝 Letzte Message:', allMessages[allMessages.length - 1]);
    }
  } catch (error) {
    console.error('❌ Fehler beim Parsen der Messages:', error);
    console.error('❌ messagesJson:', messagesJson?.substring(0, 200));
  }
} else {
  console.warn('⚠️ Keine Messages im localStorage gefunden!');
}

console.log('🪟 User Modal Window geöffnet für:', username);
console.log('📝 Messages:', allMessages.length);

// Komponente die das Theme lädt
function UserModalApp() {
  useEffect(() => {
    // Lade Theme aus localStorage
    const settings = localStorage.getItem('app-settings');
    let themeId = 'twitch-dark'; // Default
    
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        themeId = parsed.themeId || 'twitch-dark';
      } catch (e) {
        console.error('Fehler beim Laden der Settings:', e);
      }
    }
    
    const theme = getTheme(themeId);
    applyTheme(theme);
    console.log('🎨 Theme geladen:', themeId);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      <UserModerationModal
        username={username}
        userId={userId}
        userColor={userColor}
        onClose={() => {
          // Schließe das Fenster
          window.close();
        }}
        allMessages={allMessages}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserModalApp />
  </React.StrictMode>
);
