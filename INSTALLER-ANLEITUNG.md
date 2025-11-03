# 🚀 Installer erstellen - Schritt für Schritt

## Voraussetzungen

✅ Node.js installiert
✅ Alle Dependencies installiert (`npm install`)
✅ Twitch Client ID eingetragen in `src/config/twitch.config.ts`

---

## 📦 Schritt 1: Build erstellen

Öffne ein Terminal und führe aus:

```bash
npm run build
```

Das kompiliert:
- TypeScript → JavaScript
- React → Optimierte Bundles
- Electron Main Process

**Dauer**: ~30-60 Sekunden

---

## 🪟 Schritt 2: Windows Installer erstellen

```bash
npm run build:win
```

**Was passiert:**
- Erstellt eine `.exe` Installer-Datei
- Packt alle Dependencies
- Erstellt Uninstaller
- Fügt Desktop-Verknüpfung hinzu

**Ergebnis**: `release/Twitch Streamer Dashboard Setup X.X.X.exe`

**Größe**: ~150-200 MB

---

## 🍎 Schritt 3: macOS Installer erstellen (optional)

```bash
npm run build:mac
```

**Ergebnis**: `release/Twitch Streamer Dashboard-X.X.X.dmg`

**Hinweis**: Auf Windows kannst du keine macOS-Builds erstellen!

---

## 🐧 Schritt 4: Linux Installer erstellen (optional)

```bash
npm run build:linux
```

**Ergebnis**: `release/Twitch Streamer Dashboard-X.X.X.AppImage`

---

## 📤 Schritt 5: Verbreiten

### Option A: Direkter Download
1. Lade die `.exe` Datei auf einen File-Hoster hoch:
   - Google Drive
   - Dropbox
   - WeTransfer
   - Mega.nz

2. Teile den Download-Link

### Option B: GitHub Releases
1. Erstelle ein GitHub Repository
2. Pushe deinen Code
3. Erstelle ein Release
4. Lade die `.exe` als Asset hoch

### Option C: Eigene Website
1. Hoste die `.exe` auf deinem Webspace
2. Erstelle eine Download-Seite

---

## ⚠️ Wichtige Hinweise

### Windows Defender / Antivirus
- Neue `.exe` Dateien werden oft als "unbekannt" markiert
- Das ist normal für nicht-signierte Apps
- Nutzer müssen "Trotzdem ausführen" wählen

### Code Signing (optional, kostet Geld)
Um die Warnung zu vermeiden:
1. Kaufe ein Code-Signing-Zertifikat (~300€/Jahr)
2. Signiere die `.exe` damit
3. Windows vertraut der App dann

### Größe reduzieren
Die App ist groß weil sie Chromium enthält. Das ist normal für Electron-Apps.

---

## 🎯 Schnellstart für Verteilung

```bash
# 1. Build erstellen
npm run build:win

# 2. Datei finden
cd release

# 3. Die .exe Datei hochladen und teilen!
```

---

## 📝 Was Nutzer tun müssen

1. `.exe` Datei herunterladen
2. Doppelklick auf die Datei
3. Installation durchführen (Next, Next, Install)
4. App starten
5. Mit Twitch anmelden
6. Fertig! 🎉

---

## 🔧 Troubleshooting

**"npm run build:win" funktioniert nicht**
- Lösung: Führe erst `npm install` aus

**Installer ist zu groß**
- Normal! Electron-Apps sind 100-200 MB
- Enthält kompletten Chromium-Browser

**Antivirus blockiert**
- Normal für neue, nicht-signierte Apps
- Nutzer müssen Ausnahme hinzufügen

**App startet nicht**
- Prüfe ob alle Dependencies installiert sind
- Prüfe ob Build erfolgreich war

---

## 📊 Dateigrößen (ungefähr)

- **Windows Installer**: ~150 MB
- **Installierte App**: ~250 MB
- **macOS DMG**: ~180 MB
- **Linux AppImage**: ~170 MB

Das ist normal für Electron-Apps!

---

## ✅ Checkliste vor Verteilung

- [ ] Client ID eingetragen
- [ ] App getestet (Login funktioniert)
- [ ] Alle Kacheln funktionieren
- [ ] Build erfolgreich
- [ ] Installer getestet
- [ ] README.md für Nutzer erstellt
- [ ] Download-Link bereit

---

## 🎁 Bonus: Auto-Update (fortgeschritten)

Für automatische Updates kannst du später hinzufügen:
- electron-updater
- GitHub Releases als Update-Server

Aber für den Start reicht manueller Download!
