# 📝 Changelog

## Version 1.3.1 - Bugfix-Release (31.10.2025)

### 🐛 Bugfixes
- **Aktivitätsfeed - Bits & Subs**
  - Tags werden jetzt korrekt geparst
  - Bits werden explizit hinzugefügt
  - USERNOTICE Messages für Subs/Raids
  - Debug-Logs hinzugefügt

- **Live Viewer Liste**
  - Fehlende Scopes hinzugefügt (`moderator:read:chatters`)
  - Bessere Error-Logs
  - API-Status wird angezeigt

- **Chat-Moderations-Befehle**
  - Delete, Timeout, Ban funktionieren jetzt für ALLE
  - Nicht nur lokale Löschung
  - System-Nachrichten als Feedback
  - Debug-Logs hinzugefügt

- **Viewer-Statistik**
  - Loading-State hinzugefügt
  - Bessere Offline-Anzeige
  - Debug-Logs hinzugefügt

### 🔧 Verbesserungen
- **Neue Scopes:**
  - `moderator:read:chatters` - Für Viewer-Liste
  - `moderator:manage:banned_users` - Für Ban/Timeout
  - `moderator:manage:chat_messages` - Für Message Delete

### ⚠️ Wichtig
**Neu-Anmeldung erforderlich!** Die neuen Scopes werden nur beim Login angefragt.

---

## Version 1.3.0 - Feature-Release (31.10.2025)

### ✨ Zusammenfassung aller Features seit v1.2.0
Diese Version kombiniert alle Verbesserungen und Bugfixes:

**OBS-Integration (v1.2.0):**
- 🎥 OBS WebSocket 5.x Integration
- 📺 Dual-Mode Stream-Vorschau (Twitch/OBS)
- 🔗 Automatische Verbindung beim Start

**Bugfixes (v1.2.1):**
- 🐛 Live Viewer Liste funktioniert
- 🐛 Hype Train zeigt nur aktive
- 🐛 Aktivitätsfeed vollständig live
- 🐛 Einnahmen mit $1.99 pro Sub

**Chat-Befehle (v1.2.2):**
- 💬 Slash-Commands im Chat
- 🚀 Raid, Host, Mod, VIP, Ban, Timeout
- 🧹 Chat-Verwaltung (Clear, Slow, Follower-Only, etc.)
- 📺 Werbung schalten
- ℹ️ /help für alle Befehle

### 📚 Dokumentation
- `OBS-INTEGRATION.md` - OBS-Setup
- `CHAT-BEFEHLE.md` - Alle Chat-Befehle
- `TEST-CHECKLISTE.md` - Vollständige Tests

---

## Version 1.2.2 - Chat-Befehle (31.10.2025)

### ✨ Neue Features
- **💬 Chat-Befehle (Slash-Commands)**
  - `/raid <user>` - Raiden
  - `/host <user>` - Hosten
  - `/mod <user>` - Mod geben/entfernen
  - `/vip <user>` - VIP geben/entfernen
  - `/ban <user>` - Bannen/Entbannen
  - `/timeout <user> <sec>` - Timeout
  - `/clear` - Chat leeren
  - `/slow <sec>` - Slow-Mode
  - `/followers <min>` - Follower-Only
  - `/subscribers` - Sub-Only
  - `/emoteonly` - Emote-Only
  - `/commercial <sec>` - Werbung
  - `/help` - Hilfe anzeigen

- **System-Nachrichten**
  - Feedback für jeden Befehl
  - Fehlerbehandlung mit Hinweisen
  - Verwendungs-Beispiele bei falscher Syntax

### 📚 Dokumentation
- Neue Datei: `CHAT-BEFEHLE.md` mit vollständiger Anleitung
- Beispiele für alle Befehle
- Tipps & Tricks für häufige Szenarien

---

## Version 1.2.1 - Bugfixes & Verbesserungen (29.10.2025)

### 🐛 Bugfixes
- **Live Viewer Liste** - Zeigt jetzt tatsächliche Chatters von Twitch API
  - Lädt Chatters alle 60 Sekunden
  - Trackt Viewer aus Chat-Nachrichten
  - Entfernt inaktive Viewer nach 5 Minuten

- **Hype Train** - Zeigt nur noch aktive Hype Trains
  - Prüft `event_type === 'hypetrain.progression'`
  - Prüft ob `expires_at` in der Zukunft liegt
  - Live-Countdown in MM:SS Format
  - Aktualisiert sich jede Sekunde

- **Aktivitätsfeed** - Vollständige Live-Integration
  - Live Follower-Tracking (alle 30s)
  - Live Bits/Cheers aus Chat
  - Live Subs/Resubs/Gift Subs aus Chat
  - Live Raids aus Chat
  - Verhindert Duplikate

### 🔧 Verbesserungen
- **Einnahmen-Übersicht** - Rechnet jetzt mit $1.99 pro Sub (statt $2.50)
  - Realistischere Berechnung nach Gebühren
  - Aktualisierte Anzeige in allen Bereichen

### 📚 Dokumentation
- Alle Änderungen dokumentiert
- Test-Checkliste aktualisiert

---

## Version 1.2.0 - OBS Integration (29.10.2025)

### ✨ Neue Features
- **🎥 OBS WebSocket Integration**
  - Verbinde StreamMatrix mit OBS Studio
  - Live-Vorschau ohne Verzögerung (1s Refresh)
  - Stream-Statistiken direkt von OBS
  - Automatische Verbindung beim Start

- **📺 Erweiterte Stream-Vorschau**
  - Umschaltbar zwischen Twitch und OBS
  - Twitch: Klassische Vorschau mit ~15s Verzögerung
  - OBS: Live-Screenshots ohne Verzögerung
  - Visueller Verbindungsstatus

- **⚙️ OBS-Einstellungen**
  - Konfiguration in den Einstellungen
  - Host, Port und Passwort speicherbar
  - Verbindungsstatus-Anzeige
  - Hilfreiche Setup-Anleitung

### 📚 Dokumentation
- Neue Datei: `OBS-INTEGRATION.md` mit detaillierter Anleitung
- Erweiterte `NUTZER-ANLEITUNG.md` mit OBS-Sektion
- Fehlerbehebungs-Tipps

### 🔧 Technische Details
- OBS WebSocket 5.x Unterstützung
- Automatische Reconnect-Logik
- Screenshot-Caching für Performance
- Konfiguration in LocalStorage

---

## Version 1.1.0 - Themes & Einstellungen (28.10.2025)

### ✨ Neue Features
- **🎨 Theme-System**
  - 6 verschiedene Themes (Dark, Light, Purple, etc.)
  - Live-Vorschau beim Wechseln
  - Persistente Speicherung

- **⚙️ Erweiterte Einstellungen**
  - Auto-Refresh konfigurierbar (1-75 Sekunden)
  - Kompakt-Modus für kleinere Displays
  - Avatar-Anzeige ein/ausschaltbar
  - Einstellungen zurücksetzen

- **🔄 Refresh-Service**
  - Automatische Aktualisierung aller Daten
  - Konfigurierbares Intervall
  - Manueller Refresh-Button

### 🐛 Bugfixes
- Chat-Scroll-Verhalten verbessert
- Theme-Wechsel ohne Reload
- Performance-Optimierungen

---

## Version 1.0.0 - Initial Release (27.10.2025)

### ✨ Features
- **🔐 Twitch OAuth Login**
  - Sichere Authentifizierung
  - Token-Verwaltung
  - Auto-Refresh

- **📊 Dashboard**
  - Stream-Statistiken
  - Follower-Counter
  - Subscriber-Übersicht
  - Bits-Tracking

- **💬 Live-Chat**
  - Echtzeit-Nachrichten
  - Moderations-Tools
  - Emote-Unterstützung
  - User-Badges

- **⚡ Quick Actions**
  - Stream starten/stoppen
  - Titel ändern
  - Kategorie wechseln
  - Clips erstellen

- **🎯 Channel Points**
  - Belohnungen verwalten
  - Kosten anpassen
  - Aktivieren/Deaktivieren

- **⚙️ Stream-Einstellungen**
  - Titel bearbeiten
  - Kategorie suchen
  - Tags hinzufügen
  - Sprache ändern

### 🎨 Design
- Twitch-inspiriertes Dark Theme
- Responsive Layout
- Moderne UI-Komponenten
- Smooth Animations

### 🔧 Technisch
- Electron + React + TypeScript
- Twitch API Integration
- WebSocket für Chat
- LocalStorage für Einstellungen

---

## Geplante Features (Roadmap)

### Version 1.3.0 (geplant)
- 🎬 OBS Szenen-Kontrolle
- 📹 Recording Start/Stop
- 🎛️ Audio-Mixer Integration
- 📊 Erweiterte Stream-Analytics

### Version 1.4.0 (geplant)
- 🤖 Chatbot-Integration
- 🎁 Giveaway-System
- 📢 Alerts & Notifications
- 🎵 Spotify Integration

### Version 2.0.0 (Vision)
- 🌐 Multi-Plattform (YouTube, Kick)
- 📱 Mobile App
- ☁️ Cloud-Sync
- 👥 Multi-User Support

---

**Feedback & Bugs:** Bitte melde Probleme oder Vorschläge!
