// Web-Version Twitch-Konfiguration
export const TWITCH_CONFIG_WEB = {
  CLIENT_ID: '29m9wd4tyae2dgkvgr8ddqv45rxpwk',
  
  // Web-Redirect URI - automatisch erkannt
  REDIRECT_URI: (() => {
    const url = window.location.origin + window.location.pathname;
    // Entferne trailing slash wenn vorhanden
    return url.endsWith('/') ? url.slice(0, -1) : url;
  })(),

  SCOPES: [
    'user:read:email',
    'chat:read',
    'chat:edit',
    'channel:read:subscriptions',
    'bits:read',
    'channel:read:redemptions',
    'moderator:read:followers',
    'moderator:read:chatters',
    'channel:read:hype_train',
    'channel:manage:broadcast',
    'channel:manage:raids',
    'moderator:manage:banned_users',
    'moderator:manage:chat_messages',
    'moderator:manage:announcements',
    'moderator:manage:chat_settings',
    'moderator:manage:shield_mode',
    'moderator:manage:warnings',
    'user:read:follows'
  ]
};

export function getAuthUrlWeb(): string {
  const params = new URLSearchParams({
    client_id: TWITCH_CONFIG_WEB.CLIENT_ID,
    redirect_uri: TWITCH_CONFIG_WEB.REDIRECT_URI,
    response_type: 'token',
    scope: TWITCH_CONFIG_WEB.SCOPES.join(' ')
  });

  return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
}
