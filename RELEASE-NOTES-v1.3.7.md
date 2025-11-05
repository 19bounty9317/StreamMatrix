# 🚀 StreamMatrix v1.3.7 - Activity Feed & Chat Verbesserungen

**Release-Datum:** 05. November 2025

## ✨ Neue Features

### 💎 Bits im Activity Feed
Endlich werden Bits/Cheers angezeigt!
- **Bits-Anzeige** - Sieh wer Bits gibt
- **Gelbes Icon** - 💎 für Bits
- **Anzahl angezeigt** - Wie viele Bits
- **Live-Tracking** - Sofort sichtbar

### 🎁 Gruppierte Gift Subs
Intelligente Gruppierung von Massen-Gifts:
- **5+ Subs** werden automatisch gruppiert
- **Recipients als Badges** - Schöne Darstellung
- **3-Sekunden-Timeout** - Sammelt alle Subs
- **Einzelne Subs** (<5) bleiben einzeln

**Beispiel:**
```
⭐ MaxMustermann
   hat 10 Subs verschenkt!
   10 Subs
   
   Recipients:
   [User1] [User2] [User3] [User4] [User5]
   [User6] [User7] [User8] [User9] [User10]
```

### 📜 Intelligenter Chat-Scroll
Besseres Scroll-Verhalten wie im echten Twitch Chat:
- **Am Ende?** → Scrollt automatisch bei neuen Nachrichten
- **Nach oben gescrollt?** → Bleibt dort, damit du lesen kannst
- **150px Toleranz** - Smooth Verhalten
- **Keine Dashboard-Störung** - Nur Chat scrollt

## 🔧 Technische Details

### Activity Feed
- Gift Sub Tracking mit Map
- 3-Sekunden-Timeout für Gruppierung
- Recipients als Array gespeichert
- Automatische Duplikat-Vermeidung

### Chat
- `scrollBottom` Berechnung
- `isNearBottom` Check (150px)
- `requestAnimationFrame` für smooth scroll
- Nur Container-Scroll, kein Dashboard-Scroll

## 📦 Installation

### Windows
```bash
# Installer (empfohlen)
StreamMatrix-Setup-1.3.7.exe

# Portable
StreamMatrix-1.3.7-win.zip
```

### macOS
```bash
# DMG
StreamMatrix-1.3.7.dmg

# Portable
StreamMatrix-1.3.7-mac.zip
```

### Linux
```bash
# AppImage
chmod +x StreamMatrix-1.3.7.AppImage
./StreamMatrix-1.3.7.AppImage

# Tar.gz
tar -xzf StreamMatrix-1.3.7-linux.tar.gz
```

## 🔄 Update von v1.3.6

### Automatisches Update
1. Öffne StreamMatrix v1.3.6
2. Warte auf Update-Benachrichtigung
3. Klicke auf "Jetzt aktualisieren"
4. App wird automatisch neu gestartet

### Manuelles Update
1. Lade v1.3.7 herunter
2. Installiere über v1.3.6
3. Einstellungen bleiben erhalten

## 💡 Neue Features nutzen

### Activity Feed
```
1. Öffne Activity Feed Kachel
2. Warte auf Bits/Subs
3. Bits werden sofort angezeigt
4. 5+ Gift Subs werden gruppiert
5. Recipients als Badges sichtbar
```

### Chat-Scroll
```
1. Scrolle nach unten → Auto-Scroll aktiv
2. Scrolle nach oben → Bleibt dort
3. Scrolle wieder nach unten → Auto-Scroll wieder aktiv
```

## 📚 Dokumentation

- [CHANGELOG.md](CHANGELOG.md) - Vollständige Änderungshistorie
- [NUTZER-ANLEITUNG.md](NUTZER-ANLEITUNG.md) - Benutzerhandbuch
- [README.md](README.md) - Projekt-Übersicht

## 🐛 Bekannte Probleme

Keine bekannten Probleme in dieser Version.

## 📞 Support

- **E-Mail:** StreamMatrix@web.de
- **GitHub Issues:** [Issues erstellen](https://github.com/19bounty9317/StreamMatrix/issues)

## 🙏 Danke

Vielen Dank für das Feedback und die Feature-Requests!

---

**StreamMatrix v1.3.7** - Die professionelle Twitch-Dashboard-Lösung

Copyright © 2025 Michael Mader | StreamMatrix@web.de
