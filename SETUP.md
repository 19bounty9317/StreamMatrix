# Setup-Anleitung für Entwickler

## Twitch App erstellen (einmalig für die Verteilung)

### 1. Twitch Developer Account
- Gehe zu https://dev.twitch.tv/console
- Melde dich mit deinem Twitch-Account an
- Akzeptiere die Developer Agreement

### 2. Neue Anwendung erstellen
1. Klicke auf "Register Your Application"
2. Fülle die Felder aus:
   - **Name**: `Twitch Streamer Dashboard` (oder dein eigener Name)
   - **OAuth Redirect URLs**: `http://localhost:3000/auth/callback`
   - **Category**: `Application Integration`
3. Klicke auf "Create"

### 3. Client ID kopieren
1. Klicke auf "Manage" bei deiner neuen App
2. Kopiere die **Client ID**
3. Öffne `src/config/twitch.config.ts`
4. Ersetze `'deine_app_client_id_hier'` mit deiner echten Client ID

### 4. Wichtig für Produktion
Wenn du die App öffentlich verteilst:
- Die Client ID wird in der App eingebaut und ist für alle Nutzer gleich
- Jeder Nutzer meldet sich mit seinem eigenen Twitch-Account an
- Die Access Tokens bleiben lokal auf dem Gerät des Nutzers
- Du siehst KEINE Daten der Nutzer

### 5. Redirect URI für Production Build
Für die finale Version musst du eventuell zusätzliche Redirect URIs hinzufügen:
- `http://localhost:3000/auth/callback` (für Development)
- Weitere URIs je nach Deployment-Strategie

## Sicherheitshinweise

✅ **Sicher zu teilen:**
- Client ID (wird in der App eingebaut)

❌ **NIEMALS teilen:**
- Client Secret (wird für diese App NICHT benötigt)
- Access Tokens der Nutzer

## Testen

Nach dem Setup:
```bash
npm install
npm run dev
```

Klicke auf "Mit Twitch anmelden" - es sollte ein Popup-Fenster öffnen, wo du dich mit Twitch anmelden kannst.

## Troubleshooting

**Problem**: "Invalid Client ID"
- Lösung: Prüfe ob die Client ID korrekt in `src/config/twitch.config.ts` eingetragen ist

**Problem**: "Redirect URI mismatch"
- Lösung: Stelle sicher, dass `http://localhost:3000/auth/callback` in der Twitch Dev Console eingetragen ist

**Problem**: Popup wird blockiert
- Lösung: Erlaube Popups für localhost in deinem Browser
