// Zentrale Twitch-Konfiguration für die App
// Diese Client ID ist für DEINE App und wird mit der App verteilt

// Automatische Erkennung: Web oder Desktop
const isWeb = typeof window !== 'undefined' && !window.electron;
const getRedirectUri = () => {
  if (isWeb) {
    // Web-Version: Nutze aktuelle URL
    const url = window.location.origin + window.location.pathname;
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  // Desktop-Version: Nutze localhost OAuth-Server
  return 'http://localhost:3000/auth/callback';
};

export const TWITCH_CONFIG = {
  // Ersetze dies mit deiner eigenen Client ID von https://dev.twitch.tv/console
  CLIENT_ID: '29m9wd4tyae2dgkvgr8ddqv45rxpwk',

  // Redirect URI - automatisch erkannt (Web oder Desktop)
  REDIRECT_URI: getRedirectUri(),

  // Scopes die deine App benötigt
  SCOPES: [
    'user:read:email',
    'chat:read',
    'chat:edit',
    'channel:read:subscriptions',
    'bits:read',
    'channel:read:redemptions',
    'moderator:read:followers',
    'moderator:read:chatters', // Für Live Viewer Liste
    'channel:read:hype_train',
    'channel:manage:broadcast',
    'channel:manage:raids', // Für Raid-Funktion
    'moderator:manage:banned_users', // Für Ban/Timeout
    'moderator:manage:chat_messages', // Für Message Delete
    'moderator:manage:announcements', // Für Announcements
    'moderator:manage:chat_settings', // Für Chat-Modi (Slow, Follower-Only, etc.)
    'moderator:manage:shield_mode', // Für Shield-Mode
    'moderator:manage:warnings', // Für Warnungen
    'user:read:follows' // Für Raid-Ziele (gefolgte Kanäle)
  ]
};

// OAuth URL Generator
export function getAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: TWITCH_CONFIG.CLIENT_ID,
    redirect_uri: TWITCH_CONFIG.REDIRECT_URI,
    response_type: 'token',
    scope: TWITCH_CONFIG.SCOPES.join(' ')
  });

  return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
}
