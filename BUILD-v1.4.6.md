# 🔨 Build-Anleitung für StreamMatrix v1.4.6

## 📋 Voraussetzungen

- Node.js 18+ installiert
- npm oder yarn
- Git
- Windows 10/11 (für Electron Build)

## 🚀 Build-Prozess

### 1. Repository klonen (falls noch nicht geschehen)
```bash
git clone https://github.com/dein-username/streammatrix.git
cd streammatrix
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Version prüfen
```bash
# Sollte 1.4.6 anzeigen
node -p "require('./package.json').version"
```

### 4. TypeScript kompilieren
```bash
npm run build
```

### 5. Electron App bauen
```bash
npm run electron:build
```

## 📦 Build-Ausgabe

Die fertigen Installer findest du in:
```
dist/
├── StreamMatrix Setup 1.4.6.exe    # Windows Installer
├── StreamMatrix-1.4.6.exe          # Portable Version
└── win-unpacked/                   # Entpackte App
```

## 🧪 Vor dem Release testen

### Desktop-Version testen
```bash
npm run dev
```

### Web-Version testen
```bash
npm run dev:web
```

### Build testen
```bash
# Nach dem Build die App starten
./dist/win-unpacked/StreamMatrix.exe
```

## ✅ Release-Checkliste

- [ ] Version in `package.json` auf 1.4.6 aktualisiert
- [ ] Version in `src/config/version.ts` auf 1.4.6 aktualisiert
- [ ] CHANGELOG.md aktualisiert
- [ ] Release Notes erstellt (RELEASE-NOTES-v1.4.6.md)
- [ ] GitHub Release Notes erstellt (GITHUB-RELEASE-v1.4.6.md)
- [ ] Build erfolgreich durchgeführt
- [ ] Desktop-Version getestet
- [ ] Channel Points Feature getestet
- [ ] Keine TypeScript-Fehler
- [ ] Keine Console-Errors

## 🧪 Feature-Tests

### Channel Points testen
1. Starte StreamMatrix
2. Verbinde mit Twitch
3. Öffne Chat-Tile
4. Öffne Alerts-Tile
5. Löse eine Kanalpunkte-Belohnung ein (oder lasse jemanden einlösen)
6. Prüfe:
   - [ ] Event erscheint im Chat (grünes Banner mit 💎)
   - [ ] Event erscheint in Alerts (🎁 Icon, gelber Border)
   - [ ] Desktop-Benachrichtigung erscheint (wenn aktiviert)
   - [ ] Sound wird abgespielt
   - [ ] Belohnungstitel wird korrekt angezeigt
   - [ ] Optionale Nachricht wird angezeigt

### Alerts-Tile testen
1. Öffne Alerts-Tile
2. Prüfe Anzeige von:
   - [ ] Raids (🚀, roter Border)
   - [ ] Sub-Bomben (⭐, lila Border)
   - [ ] Kanalpunkte (🎁, gelber Border)
3. Prüfe Celebration-Mode-Button
4. Prüfe Löschen-Button

## 📤 Upload-Prozess

### 1. GitHub Release erstellen
```bash
# Tag erstellen
git tag v1.4.6
git push origin v1.4.6

# Auf GitHub:
# - Gehe zu Releases
# - "Create new release"
# - Tag: v1.4.6
# - Title: "StreamMatrix v1.4.6 - Channel Points Integration"
# - Description: Inhalt von GITHUB-RELEASE-v1.4.6.md
# - Upload: StreamMatrix Setup 1.4.6.exe
```

### 2. Discord Upload
```bash
# Im Discord #downloads Channel:
# - Upload: StreamMatrix Setup 1.4.6.exe
# - Nachricht: Siehe RELEASE-NOTES-v1.4.6.md
```

### 3. Ankündigung
```bash
# Discord #announcements:
# - Neue Version verfügbar!
# - Hauptfeatures erwähnen
# - Link zum Download
```

## 🔧 Troubleshooting

### Build schlägt fehl
```bash
# Cache löschen
rm -rf node_modules
rm package-lock.json
npm install
```

### TypeScript-Fehler
```bash
# TypeScript neu kompilieren
npm run build
```

### Electron startet nicht
```bash
# Dev-Modus testen
npm run dev

# Logs prüfen
# Windows: %APPDATA%/streammatrix/logs
```

## 📊 Build-Statistiken

- **Build-Zeit:** ~2-3 Minuten
- **Installer-Größe:** ~150 MB
- **Entpackte Größe:** ~400 MB
- **Node Modules:** ~500 MB

## 🎯 Nächste Schritte nach Release

1. [ ] GitHub Release veröffentlichen
2. [ ] Discord-Ankündigung posten
3. [ ] Community-Feedback sammeln
4. [ ] Bug-Reports monitoren
5. [ ] Nächstes Update planen (v1.4.7)

## 📝 Notizen

- Immer auf einem sauberen Branch bauen
- Vor dem Build alle Tests durchführen
- Nach dem Build die App selbst testen
- Installer auf Virustotal prüfen (optional)
- Backup der alten Version behalten

---

**Viel Erfolg beim Build!** 🚀
