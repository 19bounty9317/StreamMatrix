# Twitch OAuth für Web-Version einrichten

## 🔐 Schritt-für-Schritt Anleitung

### 1. Twitch Developer Console öffnen

Gehe zu: https://dev.twitch.tv/console/apps

### 2. Deine App auswählen

Klicke auf deine bestehende App (die du für die Desktop-Version verwendest)

### 3. Redirect URIs hinzufügen

Scrolle zu "OAuth Redirect URLs" und füge folgende URLs hinzu:

#### Für lokale Entwicklung:
```
http://localhost:5174
```

#### Für GitHub Pages (Production):
```
https://19bounty9317.github.io/StreamMatrix/app
```

#### Für eigene Domain (falls du eine hast):
```
https://deine-domain.de/app
```

**WICHTIG:** 
- Jede URL muss einzeln hinzugefügt werden
- Klicke nach jeder URL auf "Add"
- Am Ende auf "Save" klicken

### 4. Config-Datei anpassen

Bearbeite `src/config/twitch.config.web.ts`:

```typescript
export const TWITCH_CONFIG_WEB = {
  CLIENT_ID: '29m9wd4tyae2dgkvgr8ddqv45rxpwk',
  
  // Für Production (GitHub Pages):
  REDIRECT_URI: 'https://19bounty9317.github.io/StreamMatrix/app',
  
  // Für lokale Entwicklung:
  // REDIRECT_URI: 'http://localhost:5174',
  
  // Automatisch (empfohlen):
  // REDIRECT_URI: window.location.origin + window.location.pathname,
  
  SCOPES: [...]
};
```

### 5. Testen

#### Lokal testen:
```bash
npm run dev:web
```

Öffne: http://localhost:5174

#### Production testen:
1. Build erstellen: `npm run build:web`
2. Deploy: `deploy-web.bat` ausführen
3. Öffne: https://19bounty9317.github.io/StreamMatrix/app

### 6. Troubleshooting

#### "redirect_uri_mismatch" Fehler:
- Prüfe ob die URL in Twitch Console EXAKT übereinstimmt
- Achte auf Groß-/Kleinschreibung
- Achte auf Trailing Slash (mit/ohne `/` am Ende)
- HTTPS vs HTTP

#### Login funktioniert nicht:
- Browser-Console öffnen (F12)
- Fehler-Meldungen prüfen
- Cookies/LocalStorage aktiviert?
- Popup-Blocker deaktiviert?

#### Token wird nicht gespeichert:
- LocalStorage verfügbar?
- Private/Inkognito-Modus?
- Browser-Einstellungen prüfen

## 📋 Checkliste

- [ ] Twitch Developer Console geöffnet
- [ ] Redirect URIs hinzugefügt (localhost + production)
- [ ] "Save" geklickt in Twitch Console
- [ ] `twitch.config.web.ts` angepasst
- [ ] Lokal getestet (`npm run dev:web`)
- [ ] Build erstellt (`npm run build:web`)
- [ ] Deployed (GitHub Pages oder eigener Server)
- [ ] Production getestet

## 🔗 Nützliche Links

- Twitch Dev Console: https://dev.twitch.tv/console/apps
- OAuth Dokumentation: https://dev.twitch.tv/docs/authentication
- GitHub Pages Setup: https://pages.github.com/

## 💡 Tipps

- **Mehrere Redirect URIs:** Du kannst beliebig viele hinzufügen (localhost, staging, production)
- **Automatische Erkennung:** `window.location.origin` erkennt automatisch die aktuelle URL
- **Sicherheit:** Client ID ist öffentlich, das ist OK. Client Secret wird NICHT benötigt für Implicit Flow
- **Testing:** Teste immer zuerst lokal, dann production
