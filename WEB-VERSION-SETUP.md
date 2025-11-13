# StreamMatrix Web-Version Setup

## 🌐 Übersicht

Die Web-Version von StreamMatrix ist eine Browser-basierte Variante des Twitch-Dashboards, die auf jedem Gerät (Desktop, Tablet, iPad) läuft.

## ✨ Features

### Was funktioniert:
- ✅ Twitch OAuth Login
- ✅ Alle Dashboard-Kacheln (Chat, Activity, Stream-Info, etc.)
- ✅ Event-Tracking & Celebrations
- ✅ Stream-Historie
- ✅ Themes & Einstellungen
- ✅ Responsive Design (funktioniert auf iPad/Tablet)
- ✅ PWA-fähig (kann als App installiert werden)

### Was NICHT funktioniert (nur Desktop-App):
- ❌ System-Monitoring (CPU/GPU/RAM)
- ❌ Multi-Window Support
- ❌ OBS-Integration
- ❌ Auto-Updates
- ❌ Electron-spezifische Features

## 🚀 Entwicklung

### Lokale Entwicklung starten:

```bash
npm run dev:web
```

Die App läuft dann auf: `http://localhost:5174`

### Build für Production:

```bash
npm run build:web
```

Output: `dist/web/`

## 🔧 Twitch OAuth Konfiguration

**WICHTIG:** Du musst in der Twitch Developer Console eine neue Redirect URI hinzufügen:

1. Gehe zu: https://dev.twitch.tv/console/apps
2. Wähle deine App aus
3. Füge folgende Redirect URIs hinzu:
   - Für lokale Entwicklung: `http://localhost:5174`
   - Für Production: `https://deine-domain.github.io/app` (oder deine eigene Domain)

### Redirect URI in Code anpassen:

Bearbeite `src/config/twitch.config.web.ts`:

```typescript
REDIRECT_URI: 'https://deine-domain.github.io/app'
```

## 📦 Deployment

### Option 1: GitHub Pages

1. **Build erstellen:**
   ```bash
   npm run build:web
   ```

2. **Zu GitHub Pages deployen:**
   ```bash
   # Kopiere dist/web nach docs/app
   xcopy /E /I /Y dist\web docs\app
   
   # Commit & Push
   git add docs/app
   git commit -m "Deploy web version"
   git push
   ```

3. **GitHub Pages aktivieren:**
   - Repository Settings → Pages
   - Source: `main` branch, `/docs` folder
   - Save

4. **Zugriff:**
   - URL: `https://dein-username.github.io/dein-repo/app`

### Option 2: Netlify/Vercel

1. **Build Command:** `npm run build:web`
2. **Publish Directory:** `dist/web`
3. **Environment Variables:** Keine nötig

### Option 3: Eigener Server

1. Build erstellen: `npm run build:web`
2. Inhalt von `dist/web/` auf Server hochladen
3. Webserver (nginx/Apache) konfigurieren
4. HTTPS aktivieren (für OAuth erforderlich!)

## 🔐 Sicherheit

- OAuth-Token werden nur im Browser-LocalStorage gespeichert
- Keine Server-seitige Speicherung
- HTTPS ist für Production PFLICHT (Twitch OAuth Requirement)
- Token werden nie an externe Server gesendet

## 📱 PWA Installation

Die Web-Version kann als Progressive Web App installiert werden:

1. Öffne die Web-App im Browser
2. Browser zeigt "Installieren" Button
3. Nach Installation: App läuft wie native App

### PWA Manifest anpassen:

Erstelle `web/manifest.json`:

```json
{
  "name": "StreamMatrix Web",
  "short_name": "StreamMatrix",
  "description": "Twitch Dashboard für Streamer",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0E0E10",
  "theme_color": "#9147FF",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🐛 Troubleshooting

### OAuth funktioniert nicht:
- Prüfe Redirect URI in Twitch Console
- Prüfe `REDIRECT_URI` in `twitch.config.web.ts`
- HTTPS muss aktiviert sein (außer localhost)

### Build-Fehler:
- `npm install` ausführen
- Node.js Version prüfen (min. v18)
- Cache löschen: `rm -rf node_modules dist`

### Kacheln laden nicht:
- Browser-Console öffnen (F12)
- Netzwerk-Tab prüfen
- Twitch API Rate Limits prüfen

## 📊 Unterschiede zur Desktop-App

| Feature | Desktop | Web |
|---------|---------|-----|
| Twitch API | ✅ | ✅ |
| Chat | ✅ | ✅ |
| Events | ✅ | ✅ |
| System-Stats | ✅ | ❌ |
| Multi-Window | ✅ | ❌ |
| OBS | ✅ | ❌ |
| Auto-Update | ✅ | ❌ |
| Offline-Modus | ✅ | ⚠️ (PWA) |

## 💡 Tipps

- **iPad/Tablet:** Funktioniert perfekt im Landscape-Modus
- **Performance:** Web-Version ist leichter als Desktop-App
- **Updates:** Einfach Seite neu laden (kein Download nötig)
- **Mehrere Accounts:** Verschiedene Browser-Profile nutzen

## 🔗 Links

- Desktop-App: [GitHub Releases](https://github.com/19bounty9317/StreamMatrix/releases)
- Twitch Dev Console: https://dev.twitch.tv/console
- Dokumentation: [README.md](../README.md)
