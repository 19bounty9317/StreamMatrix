# 🚀 StreamMatrix v1.3.6 - Bugfix-Release

**Release-Datum:** 05. November 2025

## 🐛 Bugfixes

### DevTools in Production
Endlich kannst du auch in Production-Builds debuggen!
- **F12** oder **Ctrl+Shift+I** öffnet/schließt DevTools
- Perfekt für Fehlersuche
- Console-Logs sichtbar
- Netzwerk-Analyse möglich

### Chat-Verbesserungen
Mehrere wichtige Chat-Fixes:
- ✅ **Eigene Nachrichten sichtbar** - Werden sofort angezeigt
- ✅ **Dashboard scrollt nicht mehr** - Bleibt an Position
- ✅ **Chat scrollt nur intern** - Andere Kacheln bleiben sichtbar
- ✅ **Bessere UX** - Flüssigeres Schreiben

### User-Card
Die User-Card ist jetzt perfekt:
- ✅ **Hintergrund hinzugefügt** - Keine Transparenz mehr
- ✅ **Theme-kompatibel** - Passt zu allen Themes
- ✅ **Bessere Lesbarkeit** - Klare Darstellung

### Activity Feed
Besseres Tracking für Subs:
- ✅ **Mehr Debug-Logs** - Sieh was ankommt
- ✅ **Mystery Gift Subs** - Masse-Geschenke werden erkannt
- ✅ **Monatszahl bei Resubs** - Zeigt wie lange subscribed
- ✅ **Bessere Fehlersuche** - Mit F12 debuggen

## 🔧 Technische Details

### Änderungen
- `scrollIntoView` → `scrollTop` (verhindert Dashboard-Scroll)
- Eigene Nachrichten mit User-Info sofort hinzugefügt
- Explizite Hintergründe für User-Card
- Verbesserte Event-Listener für DevTools

### Performance
- Keine Performance-Einbußen
- Gleiche Bundle-Größe
- Optimierte Scroll-Logik

## 📦 Installation

### Windows
```bash
# Installer (empfohlen)
StreamMatrix-Setup-1.3.6.exe

# Portable
StreamMatrix-1.3.6-win.zip
```

### macOS
```bash
# DMG
StreamMatrix-1.3.6.dmg

# Portable
StreamMatrix-1.3.6-mac.zip
```

### Linux
```bash
# AppImage
chmod +x StreamMatrix-1.3.6.AppImage
./StreamMatrix-1.3.6.AppImage

# Tar.gz
tar -xzf StreamMatrix-1.3.6-linux.tar.gz
```

## 🔄 Update von v1.3.5

### Automatisches Update
1. Öffne StreamMatrix v1.3.5
2. Warte auf Update-Benachrichtigung
3. Klicke auf "Jetzt aktualisieren"
4. App wird automatisch neu gestartet

### Manuelles Update
1. Lade v1.3.6 herunter
2. Installiere über v1.3.5
3. Einstellungen bleiben erhalten

## 💡 Neue Features nutzen

### DevTools öffnen
```
Drücke F12 oder Ctrl+Shift+I
→ DevTools öffnen sich
→ Gehe zum "Console" Tab
→ Sieh alle Logs
```

### Activity Feed debuggen
```
1. Öffne DevTools (F12)
2. Gehe zum Console Tab
3. Warte auf Sub/Bits/Raid
4. Sieh Debug-Logs:
   🎯 Activity Feed - Message empfangen
   📋 USERNOTICE msg-id erkannt
   ⭐ Sub erkannt
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

Vielen Dank für das Feedback und die Fehlerberichte!

---

**StreamMatrix v1.3.6** - Die professionelle Twitch-Dashboard-Lösung

Copyright © 2025 Michael Mader | StreamMatrix@web.de
