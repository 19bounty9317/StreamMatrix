# Icon Setup für StreamMatrix

## Schritte zum Hinzufügen des Icons:

### 1. Icon vorbereiten
Das hochgeladene Icon muss in zwei Formaten vorliegen:

**Für Windows (.ico):**
1. Gehe zu https://convertio.co/de/png-ico/
2. Lade das StreamMatrix Icon hoch
3. Wähle folgende Größen aus: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
4. Konvertiere zu .ico
5. Lade die `icon.ico` Datei herunter

**Für allgemeine Verwendung (.png):**
- Das Original-Icon als PNG (mindestens 512x512px)

### 2. Icon-Dateien platzieren
Kopiere die Dateien in den `build` Ordner:
```
twitch-Programm/
  build/
    icon.ico    (für Windows Installer)
    icon.png    (für Electron App)
```

### 3. Build erstellen
Nachdem die Icon-Dateien im `build` Ordner sind:
```bash
npm run build:win
```

### 4. Ergebnis
- Der Windows Installer zeigt das StreamMatrix Icon
- Die installierte App zeigt das Icon in der Taskleiste
- Das Icon erscheint in der Windows-Programmliste

## Hinweis
Die package.json ist bereits konfiguriert und zeigt auf `build/icon.ico`.
Du musst nur noch die Icon-Dateien in den `build` Ordner kopieren!
