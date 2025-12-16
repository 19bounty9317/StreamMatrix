# StreamMatrix v1.4.10 - Raid-Befehl Fix

## 🐛 Bugfixes

### Raid-Befehl funktioniert jetzt
- **Problem behoben**: `/raid` Befehl zeigte "Unrecognized command" Fehler
- **Lösung**: Raid-Funktion nutzt jetzt die offizielle Twitch Helix API statt IRC-Befehle
- Raids werden jetzt zuverlässig über die API gestartet
- Bessere Fehlerbehandlung mit benutzerfreundlichen Meldungen

## 🔧 Technische Änderungen

- Neue `startRaid()` Methode in TwitchService
- Verwendet `POST /helix/raids` API-Endpoint
- Automatische Fehlerbehandlung mit 5-Sekunden Auto-Hide

## 📦 Installation

1. Lade `StreamMatrix-Setup-1.4.10.exe` herunter
2. Führe das Setup aus
3. Die App wird automatisch aktualisiert

## ⚠️ Wichtig

Nach dem Update musst du dich eventuell neu einloggen, damit die Raid-Funktion korrekt funktioniert.

---

**Vollständiges Changelog**: https://github.com/19bounty9317/StreamMatrix/compare/v1.4.9...v1.4.10
