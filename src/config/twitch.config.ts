// Zentrale Twitch-Konfiguration für die App
// Diese Client ID ist für DEINE App und wird mit der App verteilt
export const TWITCH_CONFIG = {
  // Ersetze dies mit deiner eigenen Client ID von https://dev.twitch.tv/console
  CLIENT_ID: '29m9wd4tyae2dgkvgr8ddqv45rxpwk',

  // Redirect URI - muss in der Twitch Dev Console eingetragen sein
  REDIRECT_URI: 'http://localhost:3000/auth/callback',

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
    'moderator:manage:banned_users', // Für Ban/Timeout
    'moderator:manage:chat_messages' // Für Message Delete
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
