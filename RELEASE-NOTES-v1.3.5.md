# 🚀 StreamMatrix v1.3.5 - User-Card & Stream-Qualität

**Release-Datum:** 04. November 2025

## ✨ Neue Features

### 👤 User-Card im Chat
Endlich wie im Twitch Chat! Klicke auf einen Usernamen im Chat und erhalte:
- **Profilbild** - Sehe das Avatar des Users
- **Bio** - Lese die Kanalbeschreibung
- **Account-Alter** - Wie lange ist der User schon auf Twitch?
- **Follower-Anzahl** - Wie viele Follower hat der User?
- **Schnellaktionen:**
  - 🛡️ Mod geben
  - 💎 VIP geben
  - ⏱️ Timeout (1m / 10m)
  - 🚫 Permanent bannen
  - 📺 Kanal besuchen

### 📊 Stream-Qualität Live-Daten
Überwache deine Stream-Qualität in Echtzeit:
- **Echte Bitrate** - Direkt von OBS (wenn verbunden)
- **Dropped Frames** - Sieh sofort wenn Frames droppen
- **Dropped Frames %** - Prozentuale Anzeige
- **Farbcodierung:**
  - 🟢 Grün = Ausgezeichnet (>4 Mbps)
  - 🟡 Gelb = Gut (>2.5 Mbps)
  - 🔴 Rot = Probleme (<2.5 Mbps)

## 🔧 Technische Verbesserungen

### StreamQualityService
- OBS-Integration für präzise Daten
- Bitrate-Berechnung aus OBS output-bytes
- Frame-Drop-Tracking von OBS
- Automatischer Fallback auf Twitch API (geschätzte Werte)

### OBSService
- Neue `getStreamStats()` Methode
- Liefert alle Stream-Statistiken
- Output-Bytes, Frames, Dropped Frames
- CPU/Memory Usage Tracking

## 🎨 UI/UX Verbesserungen
- User-Card Popup im Twitch-Style
- Hover-Effekt auf Usernamen
- Smooth Animations
- Responsive Positionierung
- Farbcodierte Stream-Qualität

## 📦 Installation

### Windows
```bash
# Installer
StreamMatrix-Setup-1.3.5.exe

# Portable
StreamMatrix-1.3.5-win.zip
```

### macOS
```bash
# DMG
StreamMatrix-1.3.5.dmg

# Portable
StreamMatrix-1.3.5-mac.zip
```

### Linux
```bash
# AppImage
chmod +x StreamMatrix-1.3.5.AppImage
./StreamMatrix-1.3.5.AppImage

# Tar.gz
tar -xzf StreamMatrix-1.3.5-linux.tar.gz
```

## 🔄 Update von v1.3.4

### Automatisches Update
1. Öffne StreamMatrix
2. Warte auf Update-Benachrichtigung
3. Klicke auf "Jetzt aktualisieren"
4. App wird automatisch neu gestartet

### Manuelles Update
1. Lade die neue Version herunter
2. Installiere über die alte Version
3. Deine Einstellungen bleiben erhalten

## 📚 Dokumentation

- [CHANGELOG.md](CHANGELOG.md) - Vollständige Änderungshistorie
- [NUTZER-ANLEITUNG.md](NUTZER-ANLEITUNG.md) - Benutzerhandbuch
- [README.md](README.md) - Projekt-Übersicht

## 🐛 Bekannte Probleme

Keine bekannten Probleme in dieser Version.

## 💡 Tipps & Tricks

### User-Card optimal nutzen
- Klicke auf Usernamen für schnelle Moderation
- Nutze die Schnellaktionen für häufige Tasks
- Besuche interessante Kanäle direkt

### Stream-Qualität überwachen
- Verbinde OBS für echte Daten
- Achte auf rote Werte (Probleme!)
- Dropped Frames sollten unter 1% bleiben

## 🙏 Danke

Vielen Dank an alle Tester und Feedback-Geber!

## 📞 Support

- **E-Mail:** StreamMatrix@web.de
- **GitHub Issues:** [Issues erstellen](https://github.com/19bounty9317/StreamMatrix/issues)

---

**StreamMatrix v1.3.5** - Die professionelle Twitch-Dashboard-Lösung

Copyright © 2025 Michael Mader | StreamMatrix@web.de
