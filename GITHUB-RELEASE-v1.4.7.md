# StreamMatrix v1.4.7 - Analytics & Ban-System 🔒📊

## 🎉 Highlights

Diese Version bringt ein **komplettes Analytics- und Ban-System** mit Cloud Functions, Admin-Dashboard und automatischer Code-Validierung!

## ✨ Neue Features

### 📊 Analytics-System
- **Anonyme Nutzungsstatistiken** mit User-Einwilligung (DSGVO-konform)
- **Admin-Dashboard** zur Überwachung aller User
- **Tägliche Statistiken** (aktive User, Versionen, Plattformen)
- **Code-Integritätsprüfung** erkennt Manipulationen
- **Firebase Cloud Functions** für serverseitige Validierung

### 🔒 Ban-System
- **Admin kann User bannen/entbannen** im Dashboard
- **Sofortiger Logout** bei Ban
- **Login-Blockierung** für gebannte User
- **Ban-Grund wird angezeigt** mit Support-Kontakt
- **Automatische Bans** bei Code-Manipulation
- **Admin-Whitelist** für Entwickler

### 🛡️ Anti-Manipulations-System
- **Code-Hash-Validierung** bei jedem Analytics-Call
- **Automatische Erkennung** von Code-Änderungen
- **Automatische Sperre** bei Manipulation
- **Verhaltensanalyse** erkennt verdächtige Muster
- **Tägliche Inaktivitäts-Checks**

### 🚀 Automatischer Release-Prozess
- **GitHub Actions** aktualisiert Hash automatisch bei Version-Bump
- **Kein manuelles Hash-Update** mehr nötig
- **Automatisches Deployment** der Cloud Functions

## 🔧 Verbesserungen

- **System-Info in Analytics**: Zeigt echtes OS statt "unknown"
- **Verbesserte CSP**: Firebase und Emote-APIs hinzugefügt
- **System-Stats-Fix**: Keine Fehler mehr im Dev-Mode
- **Admin-Whitelist**: Entwickler sind von Bans ausgenommen

## 📋 Technische Details

### Cloud Functions (Firebase)
- `validateAnalytics`: Validiert jeden Analytics-Write
- `detectInactiveUsers`: Findet inaktive User (täglich)
- `generateDailyStats`: Erstellt Statistiken (täglich)
- `cleanupOldStats`: Löscht alte Stats (monatlich)

### Firestore Collections
- `users`: User-Analytics mit Ban-Status
- `stats`: Tägliche Statistiken

### Admin-Dashboard
- User-Liste mit Status (OK / Verdächtig / Gebannt)
- Ban/Unban-Buttons
- Statistiken-Übersicht
- Firebase Authentication

## 🔐 Sicherheit

- **DSGVO-konform**: User müssen zustimmen
- **Anonymisiert**: Nur Hash des Usernamens gespeichert
- **Opt-out möglich**: User können ablehnen
- **Transparent**: Ban-Grund wird angezeigt
- **Fair**: Support-Kontakt für Einsprüche

## 📚 Dokumentation

Neue Dokumentations-Dateien:
- `ANALYTICS-SYSTEM.md`: Komplette Analytics-Dokumentation
- `BAN-SYSTEM.md`: Ban-System Anleitung
- `ANTI-MANIPULATION-SYSTEM.md`: Schutzmaßnahmen
- `CLOUD-FUNCTIONS-SETUP.md`: Setup-Anleitung
- `RELEASE-PROCESS.md`: Release-Workflow

## 🐛 Bugfixes

- Fixed: System Stats Fehler im Dev-Mode
- Fixed: Firebase CSP-Fehler
- Fixed: BTTV/FFZ/7TV Emote-Loading
- Fixed: `require is not defined` in Analytics

## 📦 Installation

### Windows
1. Lade `StreamMatrix-Setup-1.4.7.exe` herunter
2. Führe den Installer aus
3. Starte StreamMatrix
4. Login mit Twitch
5. **Neu:** Analytics-Consent-Dialog erscheint

### Upgrade von v1.4.6
- Auto-Update funktioniert
- Oder: Installer herunterladen und installieren
- Einstellungen bleiben erhalten

## ⚠️ Wichtige Hinweise

### Für User
- **Analytics-Consent**: Beim ersten Start wird nach Zustimmung gefragt
- **Opt-out möglich**: In Einstellungen deaktivierbar
- **Keine persönlichen Daten**: Nur anonymisierte Statistiken
- **Support**: streammatrix@web.de oder Discord

### Für Admins
- **Firebase Setup erforderlich**: Siehe `FIREBASE-ADMIN-SETUP.md`
- **Cloud Functions deployen**: Siehe `CLOUD-FUNCTIONS-SETUP.md`
- **Admin-Dashboard**: `docs/admin/index.html`
- **Blaze-Plan nötig**: Aber kostenlos für normale Nutzung

## 🔄 Migration

### Von v1.4.6 zu v1.4.7
- Keine Breaking Changes
- Analytics ist opt-in
- Alle Features funktionieren wie vorher
- Neue Features sind optional

## 🎯 Roadmap

### Geplant für v1.4.8
- Erweiterte Statistiken im Admin-Dashboard
- Export-Funktion für Analytics
- Mehr Validierungs-Checks
- Performance-Optimierungen

## 💬 Support

- **Email**: streammatrix@web.de
- **Discord**: https://discord.gg/streammatrix
- **GitHub Issues**: https://github.com/19bounty9317/StreamMatrix/issues
- **Dokumentation**: Siehe Markdown-Dateien im Repo

## 🙏 Danke

Danke an alle Beta-Tester und die Community für das Feedback!

## 📝 Changelog

Siehe `CHANGELOG.md` für detaillierte Änderungen.

---

**Download**: [StreamMatrix-Setup-1.4.7.exe](https://github.com/19bounty9317/StreamMatrix/releases/download/v1.4.7/StreamMatrix-Setup-1.4.7.exe)

**Checksums**: Siehe `checksums.txt`

**Lizenz**: MIT

**Made with ❤️ by bounty9317**
