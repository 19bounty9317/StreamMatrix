# 📝 Changelog

## Version 1.4.8 - Streamer Directory & Donations (19.11.2025)

### 🎉 Neue Features
- **🎮 Streamer-Verzeichnis**
  - Neue Seite: https://streammatrix.de/streamer
  - Zeigt alle StreamMatrix-Nutzer die opted-in haben
  - Live-Streamer mit Twitch-Video-Preview (muted)
  - Offline-Streamer mit "Letzter Stream vor X" Anzeige
  - Opt-In in Einstellungen: "Im Streamer-Verzeichnis anzeigen"
  - Firebase Cloud Functions für Auto-Updates (alle 5 Min)
  - DSGVO-konform mit Opt-In System

- **💜 Spendenkampagne**
  - PayPal-Integration auf Website
  - Spenden-Sektion in Einstellungen
  - Ziel: 400€ für Code-Signierungszertifikat
  - PayPal Campaign Card mit Fortschrittsanzeige
  - Transparente Verwendung der Spenden

- **🎁 Rewards Queue Kachel**
  - Verwalte Channel Points Redemptions im Dashboard
  - 3 Action-Buttons: Bestätigen, Ablehnen, Erstatten
  - Erstatten-Button funktioniert (gibt Punkte zurück!)
  - Chat-Integration für Redemptions
  - Auto-Refresh alle 10 Sekunden

### 🔧 Verbesserungen
- **Update-System**
  - "Später installieren" lässt blaues Banner sichtbar
  - Keine weiteren Popups nach "Später" klicken
  - Permanente, unaufdringliche Erinnerung

- **Website**
  - Google Analytics Integration (DSGVO-konform)
  - Spenden-Links im Banner und Hero-Bereich
  - Datenschutzerklärung aktualisiert
  - SEO-Optimierung

- **Backend**
  - Firebase Cloud Functions für Streamer-Status
  - Twitch API Integration (Client Credentials Flow)
  - Auto-Cleanup inaktiver Streamer (30 Tage)
  - Firestore Rules für Streamer Collection

### 🐛 Bugfixes
- Update-Benachrichtigungen: Keine doppelten Popups
- Firestore Rules korrekt konfiguriert
- Channel Points Events korrekt weitergeleitet

### 📊 Technische Details
- Neue Services: StreamerDirectoryService
- Neue Komponenten: TileRewardsQueue
- Firebase SDK 10.7.1
- Axios für Cloud Functions
- Twitch Backend App (Confidential)

---

## Version 1.4.6 - Channel Points Integration (18.11.2025)

### 🎉 Neue Features
- **🎁 Kanalpunkte-Einlösungen in Alerts**
  - Automatische Erkennung von Channel Points Redemptions
  - Anzeige im Chat als grünes Banner mit 💎 Icon
  - Anzeige in Alerts mit 🎁 Icon und gelbem Border
  - Desktop-Benachrichtigungen mit eigenem Sound (700 Hz)
  - Zeigt Belohnungstitel und optionale Nachricht an

### 📊 Verbesserungen
- **Alerts-Tile erweitert**
  - Zeigt jetzt Raids, Sub-Bomben (5+) und Kanalpunkte
  - Bessere Übersicht über alle wichtigen Events
  - Keine Community-Interaktionen mehr verpassen

### 🔧 Technische Änderungen
- NotificationService um 'channel-points' Typ erweitert
- TileChat leitet Channel Points Events an NotificationService weiter
- Verbesserte Event-Verarbeitung und Typisierung

### 🐛 Bugfixes
- Behoben: TypeScript-Fehler in TileAlerts (id possibly undefined)
- Verbessert: Event-Filterung in Test-Modus

---

## Version 1.4.5 - Web-Version & Discord-Integration (15.11.2025)

### 🎉 Neue Features
- **Web-Version (Beta)**
  - StreamMatrix jetzt auch im Browser nutzbar
  - Perfekt für iPad und Tablets
  - Twitch OAuth für Web konfiguriert
  - Deployment auf GitHub Pages

### 🌐 Website & Community
- **Discord-Integration**
  - Vollständige Discord-Server-Struktur
  - Download-Verwaltung über Discord
  - Community-Channels und Support
  - GitHub Webhook für Updates

### 🔧 Technische Änderungen
- Separate Vite-Konfiguration für Web-Version
- Runtime URL-Detection für OAuth
- Cache-Buster für Browser-Updates
- SEO-Optimierung mit Meta-Tags

---

## Version 1.4.4 - Multi-Window & Chat-Verbesserungen (08.11.2025)

### 🎉 Neue Features
- **Multi-Window Support**
  - Mehrere Fenster für Kacheln
  - **Drag & Drop zwischen Fenstern** ⭐
  - Visueller Drop-Zone-Indikator
  - Kacheln auch per Rechtsklick verschieben
  - Automatische Synchronisation
  - Perfekt für Dual-Monitor-Setups
  - `Strg+N` für neues Fenster

- **Menüleiste**
  - File, Edit, View, Window, Help
  - Tastenkombinationen (Strg+N, Strg+,, F12)
  - Professionelles Interface

- **Chat-Modi Buttons**
  - 🐌 Slow Mode Button mit Sekundenanzeige
  - 😀 Emote-Only Button
  - Visuelles Feedback (orange/lila)
  - Schneller Zugriff ohne Befehle

- **UserCard-Verbesserungen**
  - ⚠️ Verwarnen-Funktion
  - 📺 Profil im Browser öffnen
  - Bestätigungsdialoge beim Bannen
  - Fehler-Feedback mit Hinweisen
  - Bessere Positionierung

### 🔧 Verbesserungen
- Optimierte Fenster-Synchronisation
- Effizientes Kachel-Management
- Theme-Synchronisation in allen Fenstern
- Intuitive Kontextmenüs
- Robuste Fehlerbehandlung

### 📖 Dokumentation
- `MULTI-WINDOW-ANLEITUNG.md` - Ausführliche Anleitung
- `BUILD-v1.4.4.md` - Build-Anleitung
- `GITHUB-RELEASE-v1.4.4.md` - Release Notes

---

## Version 1.3.7 - Activity Feed & Chat Verbesserungen (05.11.2025)

### ✨ Neue Features
- **Activity Feed - Bits Anzeige**
  - Bits/Cheers werden jetzt angezeigt
  - Gelbes Icon für Bits
  - Zeigt Username und Anzahl

- **Activity Feed - Gruppierte Gift Subs**
  - 5+ Gift Subs werden automatisch gruppiert
  - Recipients werden als Badges angezeigt
  - Intelligente 3-Sekunden-Gruppierung
  - Einzelne Subs (<5) bleiben einzeln

### 🔧 Verbesserungen
- **Chat Auto-Scroll**
  - Scrollt nur wenn User am Ende ist (150px)
  - Bleibt an Position beim Lesen alter Nachrichten
  - Wie im echten Twitch Chat
  - Bessere UX

### 🐛 Bugfixes
- Chat scrollt nicht mehr das gesamte Dashboard
- Intelligentes Auto-Scroll-Verhalten
- Recipients werden schön formatiert

---

## Version 1.3.6 - Bugfix-Release (05.11.2025)

### 🐛 Bugfixes
- **DevTools in Production**
  - F12 oder Ctrl+Shift+I öffnet DevTools
  - Auch in Production-Builds verfügbar
  - Besseres Debugging möglich

- **Chat-Verbesserungen**
  - Eigene Nachrichten werden sofort angezeigt
  - Dashboard scrollt nicht mehr automatisch
  - Chat scrollt nur innerhalb des Containers
  - Bessere UX beim Schreiben

- **User-Card**
  - Hintergrund hinzugefügt
  - Bessere Sichtbarkeit
  - Theme-kompatibel

- **Activity Feed**
  - Mehr Debug-Logs für Subs
  - Mystery Gift Subs hinzugefügt
  - Monatszahl bei Resubs
  - Bessere Fehlersuche

### 🔧 Technische Verbesserungen
- scrollIntoView durch scrollTop ersetzt
- Eigene Nachrichten mit User-Info
- Explizite Hintergründe für User-Card
- Verbesserte Event-Listener

---

## Version 1.3.5 - User-Card & Stream-Qualität (04.11.2025)

### ✨ Neue Features
- **👤 User-Card im Chat**
  - Klick auf Username öffnet Info-Card
  - Zeigt Profilbild, Bio, Account-Alter
  - Follower-Anzahl des Users
  - Schnellaktionen: Mod, VIP, Timeout, Ban
  - Link zum Twitch-Kanal
  - Wie im Twitch Chat!

- **📊 Stream-Qualität Live-Daten**
  - Echte Bitrate von OBS (wenn verbunden)
  - Dropped Frames Anzeige (echt von OBS)
  - Dropped Frames Prozent
  - Farbcodierung: Grün (gut), Gelb (mittel), Rot (schlecht)
  - Fallback auf geschätzte Werte ohne OBS

### 🔧 Verbesserungen
- **StreamQualityService erweitert**
  - OBS-Integration für echte Daten
  - Bitrate-Berechnung aus OBS output-bytes
  - Frame-Drop-Tracking von OBS
  - Automatischer Fallback auf Twitch API

- **OBSService erweitert**
  - `getStreamStats()` Methode hinzugefügt
  - Liefert alle Stream-Statistiken
  - Output-Bytes, Frames, Dropped Frames
  - CPU/Memory Usage

### 🎨 UI/UX
- User-Card Popup mit Twitch-Style
- Hover-Effekt auf Usernamen
- Smooth Animations
- Responsive Positionierung

### 📚 Dokumentation
- README.md aktualisiert für v1.3.5
- Alle Features dokumentiert

---

## Version 1.3.4 - Copyright & Schutz (04.11.2025)

### 🛡️ Rechtlicher Schutz
- **Copyright-Hinweis im UI**
  - Anzeige unten rechts: © 2025 StreamMatrix
  - Link zu GitHub Repository
  - Dezent aber sichtbar

- **Proprietäre Lizenz**
  - LICENSE Datei hinzugefügt
  - Vollständiger Copyright-Schutz
  - Autor: Michael Mader
  - Kontakt: StreamMatrix@web.de

- **Neue Dokumentation**
  - COPYRIGHT.md - Copyright-Informationen
  - SECURITY.md - Sicherheitsdokumentation
  - SCHUTZ-ANLEITUNG.md - Projekt-Schutz
  - LICENSE-GPL - Alternative GPL-Lizenz

### 🧹 Projekt aufgeräumt
- Alte Entwicklungs-Docs entfernt (9 Dateien)
- Alte Builds gelöscht (~1.5 GB gespart)
- Saubere Projekt-Struktur
- Nur aktuelle Builds behalten

### 📦 Technisch
- package.json: UNLICENSED + private
- Copyright-Komponente in App integriert
- Alle Versionsnummern auf 1.3.4

---

## Version 1.3.3 - Auto-Update Test (03.11.2025)

### 🔄 Auto-Update Verbesserungen
- Verbesserte Update-Status-Anzeige
- Download-Fortschritt wird angezeigt
- Besseres Feedback beim Update-Check
- Detaillierte Status-Meldungen

### 🐛 Bugfixes
- Auto-Update nur in Production-Builds
- Prüfung ob App gepackt ist (app.isPackaged)
- Bessere Logging für Debugging
- Fehler-Handling verbessert

### 📚 Dokumentation
- AUTO-UPDATE-TEST.md - Test-Anleitung
- Konsistente Dateinamen für Updates

---

## Version 1.3.2 - Auto-Update & Emotes (03.11.2025)

### 🔄 Auto-Update-Funktion
- **Automatische Updates**
  - Prüft alle 10 Minuten nach Updates
  - GitHub-Integration für Updates
  - Hintergrund-Download
  - Installation beim nächsten Start

- **Update-UI**
  - Update-Button in Settings
  - Live-Status-Anzeige
  - Update-Benachrichtigung im UI
  - Manueller Update-Check

### 😀 Emote-Unterstützung
- **Twitch Emotes**
  - Global Emotes (Kappa, LUL, PogChamp, etc.)
  - Channel Emotes (Subscriber-Emotes)
  - Automatisches Laden beim Chat-Start

- **Third-Party Emotes**
  - BTTV Emotes (Global + Channel)
  - FFZ Channel Emotes
  - 7TV Emotes (Global + Channel)
  - Über 1000+ Emotes verfügbar

- **Emote-Rendering**
  - Inline-Darstellung als Bilder (28px)
  - Hover-Tooltip mit Emote-Namen
  - Position-basiertes Parsing
  - Gemischte Emotes (Twitch + Third-Party)

### 📚 Dokumentation
- EMOTE-SUPPORT.md - Emote-Dokumentation
- RELEASE-NOTES-v1.3.2.md - Release Notes

### 🔧 Technische Details
- electron-updater@6.6.2 integriert
- EmoteService für alle Emote-Plattformen
- GitHub Releases für Auto-Update
- Update-Events und Status-Tracking

---

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
