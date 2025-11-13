# 🌐 StreamMatrix Web-Version

## ✅ Was wurde erstellt:

### 1. **Web-App Struktur**
- `web/` - Neuer Ordner für Web-Version
- `web/AppWeb.tsx` - Web-spezifische App-Komponente
- `web/main.tsx` - Entry Point
- `web/index.html` - HTML Template
- `web/components/` - Web-spezifische Komponenten

### 2. **Konfiguration**
- `vite.config.web.ts` - Vite Config für Web-Build
- `src/config/twitch.config.web.ts` - OAuth Config für Web
- `package.json` - Neue Scripts hinzugefügt

### 3. **Komponenten**
- `LoginScreenWeb.tsx` - Web-OAuth Login
- `SettingsWeb.tsx` - Settings ohne Electron-Features

### 4. **Dokumentation**
- `WEB-VERSION-SETUP.md` - Setup-Anleitung
- `TWITCH-OAUTH-WEB-SETUP.md` - OAuth Konfiguration
- `WEB-VERSION-README.md` - Diese Datei

### 5. **Deployment**
- `deploy-web.bat` - Automatisches Deployment-Script
- `docs/app.html` - Landing Page für Web-Version
- `docs/index.html` - Link zur Web-Version hinzugefügt

## 🚀 Schnellstart

### Entwicklung:
```bash
npm run dev:web
```
→ Öffne http://localhost:5174

### Build:
```bash
npm run build:web
```
→ Output in `dist/web/`

### Deploy:
```bash
deploy-web.bat
```
→ Kopiert nach `docs/app/` für GitHub Pages

## 📋 Nächste Schritte

### 1. Twitch OAuth konfigurieren
Siehe: `TWITCH-OAUTH-WEB-SETUP.md`

**Wichtig:** Füge diese Redirect URI in Twitch Console hinzu:
```
https://19bounty9317.github.io/StreamMatrix/app
```

### 2. Testen
```bash
# Lokal testen
npm run dev:web

# Production Build testen
npm run build:web
cd dist/web
# Mit lokalem Server öffnen (z.B. Live Server in VS Code)
```

### 3. Deployen
```bash
# Automatisch
deploy-web.bat

# Manuell
npm run build:web
xcopy /E /I /Y dist\web docs\app
git add docs/app
git commit -m "Deploy web version"
git push
```

### 4. GitHub Pages aktivieren
1. Repository Settings → Pages
2. Source: `main` branch, `/docs` folder
3. Save
4. Warte 1-2 Minuten
5. Öffne: https://19bounty9317.github.io/StreamMatrix/app

## ✨ Features

### Was funktioniert:
- ✅ Twitch OAuth Login
- ✅ Dashboard mit allen Kacheln
- ✅ Chat, Activity, Stream-Info
- ✅ Event-Tracking & Celebrations
- ✅ Stream-Historie
- ✅ Themes & Settings
- ✅ Responsive (iPad/Tablet)

### Was NICHT funktioniert:
- ❌ System-Stats (CPU/GPU/RAM)
- ❌ Multi-Window
- ❌ OBS-Integration
- ❌ Auto-Updates
- ❌ Electron-APIs

## 🔧 Anpassungen

### Eigene Domain verwenden:
1. Bearbeite `src/config/twitch.config.web.ts`:
```typescript
REDIRECT_URI: 'https://deine-domain.de/app'
```

2. Füge in Twitch Console hinzu:
```
https://deine-domain.de/app
```

### Automatische URL-Erkennung:
```typescript
REDIRECT_URI: window.location.origin + window.location.pathname
```
→ Funktioniert automatisch für localhost UND production

## 📱 PWA (Progressive Web App)

Die Web-Version kann als App installiert werden:

1. Öffne im Browser
2. "Installieren" Button klicken
3. App läuft wie native App

### PWA Features hinzufügen:
- Service Worker für Offline-Support
- App Manifest für Installation
- Push Notifications (optional)

## 🐛 Bekannte Probleme

### OAuth funktioniert nicht:
→ Prüfe Redirect URI in Twitch Console

### Build-Fehler:
→ `npm install` ausführen

### Kacheln laden nicht:
→ Browser-Console prüfen (F12)

## 📊 Vergleich Desktop vs Web

| Feature | Desktop | Web |
|---------|---------|-----|
| Installation | Download | Keine |
| Updates | Automatisch | Browser-Refresh |
| Offline | ✅ | ❌ |
| System-Stats | ✅ | ❌ |
| Multi-Window | ✅ | ❌ |
| OBS | ✅ | ❌ |
| iPad/Tablet | ❌ | ✅ |
| Größe | ~150 MB | ~500 KB |

## 💡 Tipps

- **iPad:** Funktioniert perfekt im Landscape-Modus
- **Performance:** Web ist schneller als Desktop
- **Updates:** Einfach Seite neu laden
- **Mehrere Accounts:** Browser-Profile nutzen

## 🔗 Links

- Web-App: https://19bounty9317.github.io/StreamMatrix/app
- Desktop-App: https://github.com/19bounty9317/StreamMatrix/releases
- Discord: https://discord.gg/MeMEuu5tXU
- Twitch Dev: https://dev.twitch.tv/console

## 📞 Support

Bei Problemen:
1. Prüfe `TWITCH-OAUTH-WEB-SETUP.md`
2. Prüfe Browser-Console (F12)
3. Frage im Discord: https://discord.gg/MeMEuu5tXU
