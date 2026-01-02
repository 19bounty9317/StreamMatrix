# StreamMatrix v1.4.12

## 🎉 Neue Features

### User-Moderation-Modal als separates Fenster
- **Separates Moderations-Fenster**: Rechtsklick auf einen Username im Chat öffnet jetzt ein separates Electron-Fenster
- **User-Informationen**: Zeigt Profilbild, Bio, Account-Erstellungsdatum und weitere Details
- **Nachrichten-Verlauf**: Alle Nachrichten des Users werden angezeigt (persistente Speicherung)
- **Statistiken**: Zeigt Gesamtanzahl der Nachrichten, Mod-Aktionen und Kommentare
- **Twitch-ähnliches Layout**: Linke Seite zeigt User-Info, rechte Seite Mod-Aktionen und Nachrichten

### Mod-Aktionen funktionieren jetzt live auf Twitch
Alle Moderations-Aktionen werden jetzt korrekt über IRC an Twitch gesendet:
- ⏱️ **Timeout**: 5 Sekunden, 2 Minuten, 10 Minuten, 1 Tag, 14 Tage
- 🚫 **Ban / Unban**: Permanenter Ban mit optionalem Grund
- ⭐ **Mod / Unmod**: Moderator-Status vergeben/entfernen
- 💎 **VIP / Un-VIP**: VIP-Status vergeben/entfernen
- 📢 **Shoutout**: Shoutout für einen User senden
- ✅ **Permit**: User darf einmalig Links posten

### Chat-Benachrichtigungen
- **System-Nachrichten**: Nach jeder Mod-Aktion erscheint eine Bestätigungs-Nachricht im Chat
- **Sofortiges Feedback**: Du siehst direkt, ob die Aktion erfolgreich war
- **Farbcodiert**: System-Nachrichten sind lila (#9147FF) und leicht erkennbar

### Persistente Message-History
- **UserMessageHistoryService**: Neuer Service speichert alle Chat-Nachrichten pro User
- **Bis zu 1000 Nachrichten pro User**: Automatische Begrenzung
- **Über Sessions hinweg**: Nachrichten bleiben auch nach Neustart erhalten
- **Automatische Speicherung**: Jede neue Nachricht wird sofort gespeichert

## 🐛 Bugfixes

### Chat-Nachrichten
- **Eigene Nachrichten sichtbar**: Eigene Chat-Nachrichten werden jetzt korrekt angezeigt
- **Duplikat-Prüfung entfernt**: Twitch-Echo wird nicht mehr als Duplikat erkannt
- **Message-Delete korrigiert**: Nachrichten-Löschung verwendet jetzt die richtige IRC-Syntax

### TypeScript-Fehler behoben
- **Electron API Typen**: Alle neuen Electron-Funktionen haben jetzt korrekte TypeScript-Definitionen
- **Optional Chaining**: Alle `window.electron` Zugriffe sind jetzt sicher
- **Event-Handler**: Korrekte Signaturen für alle Event-Listener

### IPC-Kommunikation
- **Chat-Befehle**: User-Modal-Fenster kann jetzt Befehle an das Hauptfenster senden
- **Bidirektionale Kommunikation**: Hauptfenster führt Befehle aus und sendet Feedback zurück
- **System-Nachrichten**: Spezielle `__SYSTEM__:` Nachrichten für interne Kommunikation

## 🔧 Technische Verbesserungen

### Neue Dateien
- `src/userModalWindow.tsx`: React Entry Point für User-Modal-Fenster
- `src/components/UserModerationModal.tsx`: Haupt-Komponente für Moderation
- `src/services/UserMessageHistoryService.ts`: Service für persistente Message-Speicherung
- `user-modal-window.html`: HTML Entry Point für User-Modal-Fenster
- `src/types/electron.d.ts`: Erweiterte TypeScript-Definitionen

### Geänderte Dateien
- `electron/main.ts`: Neue IPC-Handler für User-Modal und Chat-Befehle
- `electron/preload.ts`: Neue Electron API Funktionen
- `src/components/tiles/TileChat.tsx`: Integration von User-Modal und Message-History
- `package.json`: Version auf 1.4.12 erhöht

## 📥 Installation

### Windows
1. Lade `StreamMatrix-Setup-1.4.12.exe` herunter
2. Führe das Setup aus
3. Folge den Installationsanweisungen

### Erste Schritte
1. Starte StreamMatrix
2. Melde dich mit deinem Twitch-Account an
3. Rechtsklick auf einen Username im Chat öffnet das Moderations-Fenster
4. Alle Mod-Aktionen funktionieren jetzt live auf Twitch!

## 🔄 Update von v1.4.11

Wenn du bereits v1.4.11 installiert hast:
1. Deinstalliere die alte Version (Einstellungen bleiben erhalten)
2. Installiere v1.4.12
3. Deine Einstellungen und Layouts werden automatisch übernommen

## 📝 Bekannte Einschränkungen

- **Chat-History**: Nur Nachrichten seit dem Öffnen der App werden gespeichert (Twitch API Limitation)
- **Message-Delete**: Benötigt Moderator-Rechte im Channel
- **Shoutout**: Funktioniert nur als Broadcaster oder Moderator

## 🙏 Danke

Vielen Dank an alle Tester und Nutzer für das Feedback!

---

**Vollständiger Changelog**: https://github.com/19bounty9317/StreamMatrix/compare/v1.4.11...v1.4.12
