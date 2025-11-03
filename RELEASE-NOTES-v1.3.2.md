# 🎉 StreamMatrix v1.3.2 - Auto-Update & Emotes

**Release-Datum**: November 2025

## 🆕 Neue Features

### 🔄 Auto-Update-Funktion
- **Automatische Updates**: App prüft alle 10 Minuten nach neuen Versionen
- **GitHub-Integration**: Updates werden direkt von GitHub geladen
- **Hintergrund-Download**: Updates werden automatisch heruntergeladen
- **Einfache Installation**: Beim nächsten Start automatisch installiert
- **Update-Button**: Manuell nach Updates suchen in Settings
- **Benachrichtigung**: Banner zeigt verfügbare Updates an

### 😀 Emote-Unterstützung im Chat
- **Twitch Global Emotes**: Kappa, LUL, PogChamp, etc.
- **Twitch Channel Emotes**: Alle Subscriber-Emotes deines Channels
- **BTTV Emotes**: monkaS, KEKW, Sadge (Global + Channel)
- **FFZ Emotes**: FrankerFaceZ Channel-Emotes
- **7TV Emotes**: 7TV Global + Channel-Emotes
- **Automatisches Laden**: Alle Emotes beim Chat-Start
- **Inline-Darstellung**: Emotes als Bilder (28px) im Chat
- **Hover-Tooltip**: Emote-Name beim Hover

## 🔧 Verbesserungen

### Chat
- Verbesserte Emote-Parsing-Logik
- Position-basiertes Parsing für Twitch IRC Emotes
- Korrekte Behandlung von gemischten Emotes (Twitch + Third-Party)
- Optimierte Performance beim Emote-Rendering

### Updates
- Automatische Update-Checks im Hintergrund
- Keine manuelle Installation mehr nötig
- Immer die neueste Version

## 📦 Installation

### Neue Installation
1. Lade `StreamMatrix Setup 1.3.2.exe` herunter
2. Führe den Installer aus
3. Folge den Anweisungen
4. Fertig!

### Update von v1.3.1
- **Automatisch**: App erkennt Update und installiert beim nächsten Start
- **Manuell**: Lade neuen Installer und installiere über alte Version

### Update von v1.3.0 oder älter
1. Lade `StreamMatrix Setup 1.3.2.exe` herunter
2. Installiere über alte Version
3. Deine Einstellungen bleiben erhalten

## 🐛 Bekannte Probleme

- Keine bekannten kritischen Probleme

## 📝 Technische Details

### Neue Abhängigkeiten
- `electron-updater@6.6.2` - Auto-Update-Funktionalität

### Neue Dateien
- `electron/updater.ts` - Update-Service
- `src/services/EmoteService.ts` - Emote-Service
- `EMOTE-SUPPORT.md` - Emote-Dokumentation

### API-Integrationen
- Twitch Helix API (Chat Emotes)
- BetterTTV API (BTTV Emotes)
- FrankerFaceZ API (FFZ Emotes)
- 7TV API (7TV Emotes)
- GitHub Releases API (Auto-Updates)

## 🔗 Links

- **GitHub**: https://github.com/19bounty9317/StreamMatrix
- **Releases**: https://github.com/19bounty9317/StreamMatrix/releases
- **Issues**: https://github.com/19bounty9317/StreamMatrix/issues

## 📊 Statistiken

- **Version**: 1.3.2
- **Build-Größe**: ~200 MB
- **Unterstützte Plattform**: Windows 10/11 (x64)
- **Emotes geladen**: 1000+ (je nach Channel)

## 🙏 Danke

Vielen Dank an alle Tester und Nutzer für das Feedback!

---

**Vorherige Version**: [v1.3.1](RELEASE-NOTES-v1.3.1.md)  
**Nächste Version**: TBA
