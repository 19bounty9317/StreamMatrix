# StreamMatrix - Datenschutz-Fragebogen

## Antworten für Datenschutzerklärung

### 1. Wie heißt dein Programm?
**StreamMatrix**

### 2. Was genau macht es?
StreamMatrix ist ein professionelles Desktop-Dashboard für Twitch-Streamer mit folgenden Funktionen:

- **Live-Chat-Integration** mit Moderations-Tools (Timeout, Ban, Nachrichten löschen)
- **Stream-Statistiken** (Viewer-Zahlen, Follower, Subscriber, Bits)
- **Echtzeit-Benachrichtigungen** für Follows, Subs, Raids, Channel Points
- **Stream-Historie** mit Kalenderansicht und Session-Tracking
- **Multi-Window-Support** für Multi-Monitor-Setups
- **Anpassbares Dashboard** mit 16+ verschiedenen Kachel-Typen
- **Quick Actions** für schnellen Zugriff auf Stream-Funktionen
- **Optionale OBS-Integration** über WebSocket

### 3. Wer nutzt es?
- **Öffentlich verfügbar** - Das Programm wird als Freeware auf GitHub veröffentlicht
- **Zielgruppe:** Twitch-Streamer weltweit
- **Kostenlos** - Keine Registrierung oder Bezahlung erforderlich
- **Download:** Über GitHub Releases
- **Lizenz:** Proprietär (Freeware) - Quellcode einsehbar, aber geschützt

### 4. Speichert das Programm Daten lokal oder in der Cloud?
**Ausschließlich lokal:**
- Alle Daten werden im lokalen Speicher des Benutzers gespeichert (localStorage/Electron userData)
- **Keine Cloud-Speicherung**
- **Keine externe Datenbank**
- **Keine Übertragung von Nutzerdaten an Server des Entwicklers**

**Gespeicherte Daten:**
- Twitch OAuth Access Token (verschlüsselt im lokalen Speicher)
- Dashboard-Layout und Einstellungen
- Stream-Historie (Datum, Dauer, Viewer-Zahlen)
- Theme-Präferenzen
- Kachel-Konfigurationen

### 5. Gibt es eine Website oder nur eine lokale App?
- **Primär:** Lokale Desktop-Anwendung (Electron-basiert)
- **Website:** Geplant für Projektbeschreibung und Download (statische Seite, keine Datenverarbeitung)
- **GitHub:** Repository für Open Source Code und Releases

### 6. Sollen Twitch- oder Streamlabs-Logins über OAuth verwendet werden?
**Ja, OAuth 2.0 für Twitch:**

**Verwendete Twitch OAuth Scopes:**
- `user:read:email` - Benutzer-E-Mail lesen
- `chat:read` - Chat-Nachrichten lesen
- `chat:edit` - Chat-Nachrichten senden
- `channel:read:subscriptions` - Subscriber-Informationen
- `bits:read` - Bits-Transaktionen
- `channel:read:redemptions` - Channel Points Redemptions
- `moderator:read:followers` - Follower-Liste
- `moderator:read:chatters` - Live Viewer-Liste
- `channel:read:hype_train` - Hype Train Events
- `channel:manage:broadcast` - Stream-Einstellungen
- `channel:manage:raids` - Raid-Funktionen
- `moderator:manage:banned_users` - Ban/Timeout
- `moderator:manage:chat_messages` - Nachrichten löschen
- `moderator:manage:chat_settings` - Chat-Modi (Slow, Emote-Only)
- `moderator:manage:announcements` - Ankündigungen
- `moderator:manage:shield_mode` - Shield-Mode
- `moderator:manage:warnings` - Warnungen
- `user:read:follows` - Gefolgte Kanäle

**OAuth-Flow:**
1. Benutzer klickt auf "Mit Twitch verbinden"
2. Weiterleitung zu Twitch OAuth-Seite
3. Benutzer autorisiert die App
4. Twitch sendet Access Token zurück
5. Token wird **lokal** gespeichert (nicht auf Server)

**Keine Streamlabs-Integration** (aktuell)

---

## Zusätzliche Informationen

### Datenverarbeitung durch Dritte

**Twitch API:**
- StreamMatrix kommuniziert direkt mit der Twitch API
- Keine Zwischenspeicherung auf eigenen Servern
- Twitch-Datenschutzerklärung gilt: https://www.twitch.tv/p/legal/privacy-notice/

**GitHub (für Updates):**
- Auto-Updater prüft GitHub Releases auf neue Versionen
- Keine Übertragung von Nutzerdaten
- Nur Versions-Check

**OBS WebSocket (optional):**
- Lokale Verbindung zu OBS Studio
- Keine externe Datenübertragung
- Nur wenn vom Benutzer aktiviert

### Datenlöschung
- Benutzer kann jederzeit alle Daten löschen durch:
  - Abmelden in der App (löscht Token)
  - Deinstallation der App (löscht alle lokalen Daten)
  - Manuelles Löschen des userData-Ordners

### Benutzerrechte (DSGVO)
- **Auskunftsrecht:** Alle Daten sind lokal einsehbar
- **Löschrecht:** Jederzeit durch Abmelden/Deinstallation
- **Datenübertragbarkeit:** Daten sind im JSON-Format lokal gespeichert
- **Widerspruchsrecht:** Keine Datenverarbeitung ohne Zustimmung

### Entwickler/Verantwortlicher
- **Name:** [Dein Name/Pseudonym]
- **GitHub:** 19bounty9317
- **Repository:** https://github.com/19bounty9317/StreamMatrix
- **Kontakt:** [Deine E-Mail oder GitHub Issues]

### Lizenz und Transparenz
- **Lizenz:** Proprietär (Freeware) - Alle Rechte vorbehalten
- **Quellcode:** Auf GitHub einsehbar (für Transparenz und Sicherheit)
- **Nutzung:** Kostenlos für alle, aber Code ist geschützt
- **Community:** Öffentliche Issue-Tracker und Discussions
- **Schutz:** Code darf nicht kopiert, modifiziert oder in anderen Projekten verwendet werden

---

## Nächste Schritte

Mit diesen Informationen kann eine vollständige Datenschutzerklärung erstellt werden, die:
1. **DSGVO-konform** ist (für EU-Nutzer)
2. **Transparent** alle Datenverarbeitungen erklärt
3. **Benutzerrechte** klar darstellt
4. **In die App integriert** werden kann (z.B. in den Einstellungen)
5. **Auf der Website** veröffentlicht werden kann

---

*Hinweis: Diese Informationen basieren auf dem aktuellen Stand von StreamMatrix v1.4.4. Bei Änderungen der Funktionalität muss die Datenschutzerklärung aktualisiert werden.*
