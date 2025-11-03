# 📺 StreamMatrix

Ein modernes Desktop-Dashboard für Twitch-Streamer mit OBS-Integration.

![Version](https://img.shields.io/badge/version-1.3.1-purple)
![Platform](https://img.shields.io/badge/platform-Windows-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 🎥 OBS-Integration
- Verbinde mit OBS Studio über WebSocket 5.x
- Dual-Mode Stream-Vorschau (Twitch/OBS)
- Live-Screenshots ohne Verzögerung (1s Refresh)
- Automatische Verbindung beim Start

### 💬 Live-Chat
- Echtzeit-Chat mit Twitch IRC
- Moderations-Tools (Delete, Timeout, Ban)
- 20+ Slash-Commands (/raid, /mod, /timeout, etc.)
- Badges (Mod, VIP, Sub)
- Emote-Unterstützung

### 📊 Live-Tracking
- Live Viewer Liste mit Chatters API
- Aktivitätsfeed (Follower, Subs, Bits, Raids)
- Hype Train mit Live-Countdown
- Viewer-Statistiken mit Graph

### 🎯 Stream-Verwaltung
- Stream-Einstellungen (Titel, Kategorie, Tags)
- Channel Points Verwaltung
- Quick Actions (Stream Start/Stop)
- Einnahmen-Übersicht

### 🎨 Anpassbar
- 6 verschiedene Themes
- Drag & Drop Dashboard
- Auto-Refresh konfigurierbar
- Kompakt-Modus

---

## 📥 Download

### Aktuelle Version: v1.3.1

**Windows (64-bit):**
- [StreamMatrix Setup 1.3.1.exe](https://github.com/DEIN-USERNAME/StreamMatrix/releases/latest) (74 MB)
- [StreamMatrix-v1.3.1.zip](https://github.com/DEIN-USERNAME/StreamMatrix/releases/latest) (74 MB)
- [StreamMatrix-Portable-v1.3.1.zip](https://github.com/DEIN-USERNAME/StreamMatrix/releases/latest) (105 MB)

**Andere Plattformen:**
- macOS: Geplant
- Linux: Geplant

---

## 🚀 Installation

### Windows

1. **Download** `StreamMatrix Setup 1.3.1.exe`
2. **Ausführen** - Doppelklick auf die Datei
3. **Windows Defender Warnung:**
   - Klicke "Weitere Informationen"
   - Klicke "Trotzdem ausführen"
4. **Installation** - Folge dem Assistenten
5. **Fertig!** - App startet automatisch

**Detaillierte Anleitung:** Siehe [INSTALLATION-v1.2.0.md](INSTALLATION-v1.2.0.md)

---

## 🎯 Erste Schritte

### 1. Twitch-Anmeldung
```
1. App öffnen
2. "Mit Twitch anmelden" klicken
3. Browser öffnet sich
4. Bei Twitch anmelden
5. Berechtigungen erlauben
```

### 2. OBS einrichten (Optional)
```
1. OBS öffnen
2. Tools → WebSocket Server Settings
3. "Enable WebSocket server" aktivieren
4. In StreamMatrix: Einstellungen → OBS Integration
5. Verbinden!
```

### 3. Dashboard nutzen
```
- 📊 Stream-Statistiken
- 💬 Live-Chat
- 📺 Stream-Vorschau
- ⚡ Quick Actions
- 🎯 Channel Points
- ⚙️ Stream-Einstellungen
```

---

## 📚 Dokumentation

- [OBS-INTEGRATION.md](OBS-INTEGRATION.md) - OBS-Setup Anleitung
- [CHAT-BEFEHLE.md](CHAT-BEFEHLE.md) - Alle Chat-Befehle
- [NUTZER-ANLEITUNG.md](NUTZER-ANLEITUNG.md) - Vollständiges Handbuch
- [CHANGELOG.md](CHANGELOG.md) - Versionshistorie
- [DOWNLOAD-ANLEITUNG.md](DOWNLOAD-ANLEITUNG.md) - Download-Hilfe

---

## 🛠️ Entwicklung

### Voraussetzungen
```
Node.js 16+
npm oder yarn
Git
```

### Installation
```bash
# Repository klonen
git clone https://github.com/DEIN-USERNAME/StreamMatrix.git
cd StreamMatrix

# Dependencies installieren
npm install

# Development starten
npm run dev
```

### Build
```bash
# Windows Build
npm run build:win

# Output: release/StreamMatrix Setup [version].exe
```

### Technologie-Stack
- **Frontend:** React 18 + TypeScript
- **Desktop:** Electron 28
- **Styling:** Tailwind CSS
- **APIs:** Twitch Helix API, OBS WebSocket 5.x
- **Build:** Vite + electron-builder

---

## 🔧 Konfiguration

### Twitch App erstellen

1. Gehe zu [Twitch Developer Console](https://dev.twitch.tv/console)
2. Erstelle neue App
3. Notiere **Client ID**
4. Setze **Redirect URI:** `http://localhost:3000/auth/callback`
5. Trage Client ID in `src/config/twitch.config.ts` ein

### OBS WebSocket

1. OBS Studio 28.0+ installieren
2. Tools → WebSocket Server Settings
3. "Enable WebSocket server" aktivieren
4. Port 4455 (Standard)

---

## 🤝 Contributing

Contributions sind willkommen! 

### Wie du beitragen kannst:
1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

---

## 🐛 Bug Reports

Gefunden einen Bug? [Erstelle ein Issue](https://github.com/DEIN-USERNAME/StreamMatrix/issues)

**Bitte inkludiere:**
- Beschreibung des Problems
- Schritte zum Reproduzieren
- Erwartetes vs. tatsächliches Verhalten
- Screenshots (falls relevant)
- Version (siehe Einstellungen)

---

## 🔮 Roadmap

### v1.4.0 (geplant)
- 🎬 OBS Szenen-Kontrolle
- 📹 Recording Start/Stop
- 🎛️ Audio-Mixer Integration
- 📊 Erweiterte Analytics

### v1.5.0 (geplant)
- 🤖 Chatbot-Integration
- 🎁 Giveaway-System
- 📢 Alerts & Notifications
- 🎵 Spotify Integration

### v2.0.0 (Vision)
- 🌐 Multi-Plattform (YouTube, Kick)
- 📱 Mobile App
- ☁️ Cloud-Sync
- 👥 Multi-User Support

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei

---

## 🙏 Credits

**Entwickelt mit:**
- React, TypeScript, Electron
- Twitch Helix API
- OBS WebSocket Protocol

**Besonderer Dank an:**
- OBS Studio Team
- Twitch Developer Community
- Alle Contributors

---

## 📞 Support

- **Dokumentation:** Siehe [Docs](NUTZER-ANLEITUNG.md)
- **Issues:** [GitHub Issues](https://github.com/DEIN-USERNAME/StreamMatrix/issues)
- **Discussions:** [GitHub Discussions](https://github.com/DEIN-USERNAME/StreamMatrix/discussions)

---

## ⭐ Star das Projekt!

Wenn dir StreamMatrix gefällt, gib dem Projekt einen Stern! ⭐

---

**Made with 💜 for the Streaming Community**
