// Web-spezifische Konfiguration - wird NUR in der Web-Version verwendet
export function getWebAuthUrl(): string {
  // Hole die aktuelle URL
  const currentUrl = window.location.origin + window.location.pathname;
  const redirectUri = currentUrl.endsWith('/') ? currentUrl.slice(0, -1) : currentUrl;
  
  console.log('🌐 Web Auth URL wird generiert');
  console.log('📍 Current URL:', currentUrl);
  console.log('🔗 Redirect URI:', redirectUri);
  
  const params = new URLSearchParams({
    client_id: '29m9wd4tyae2dgkvgr8ddqv45rxpwk',
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: [
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
    ].join(' ')
  });

  const authUrl = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
  console.log('✅ Auth URL:', authUrl);
  
  return authUrl;
}
