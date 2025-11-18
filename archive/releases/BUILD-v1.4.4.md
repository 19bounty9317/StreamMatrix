# Build-Anleitung für StreamMatrix v1.4.4

## Vorbereitung

### 1. Abhängigkeiten installieren
```bash
npm install
```

### 2. Code-Qualität prüfen
```bash
# TypeScript-Fehler prüfen
npx tsc --noEmit

# Alle Dateien prüfen
npx tsc -p tsconfig.json --noEmit
npx tsc -p tsconfig.electron.json --noEmit
```

## Build erstellen

### Windows Build
```bash
npm run build:win
```

**Ausgabe**: `release/StreamMatrix-Setup-1.4.4.exe`

### Alle Plattformen
```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## Test vor Release

### 1. Development-Test
```bash
npm run dev
```

**Teste:**
- ✅ Menüleiste funktioniert
- ✅ `Strg+N` öffnet neues Fenster
- ✅ Kacheln können verschoben werden (Rechtsklick)
- ✅ Slow Mode & Emote-Only Buttons funktionieren
- ✅ UserCard-Aktionen funktionieren
- ✅ Theme wird in allen Fenstern synchronisiert

### 2. Production-Build-Test
```bash
npm run test:build
```

**Teste die gleichen Features wie oben**

### 3. Installer-Test
```bash
# Nach build:win
cd release
./StreamMatrix-Setup-1.4.4.exe
```

**Teste:**
- ✅ Installation funktioniert
- ✅ Desktop-Shortcut wird erstellt
- ✅ App startet korrekt
- ✅ Alle Features funktionieren

## Checkliste vor Release

- [ ] Version in `package.json` auf 1.4.4 aktualisiert
- [ ] `GITHUB-RELEASE-v1.4.4.md` erstellt
- [ ] Alle TypeScript-Fehler behoben
- [ ] Development-Build getestet
- [ ] Production-Build getestet
- [ ] Installer getestet
- [ ] Multi-Window Feature getestet
- [ ] Chat-Buttons getestet
- [ ] UserCard-Funktionen getestet
- [ ] Theme-Synchronisation getestet

## GitHub Release erstellen

### 1. Tag erstellen
```bash
git add .
git commit -m "Release v1.4.4 - Multi-Window & Chat-Verbesserungen"
git tag v1.4.4
git push origin main
git push origin v1.4.4
```

### 2. Release auf GitHub
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/releases/new
2. Tag: `v1.4.4`
3. Titel: `StreamMatrix v1.4.4 - Multi-Window & Chat-Verbesserungen`
4. Beschreibung: Kopiere Inhalt aus `GITHUB-RELEASE-v1.4.4.md`
5. Lade `StreamMatrix-Setup-1.4.4.exe` hoch
6. Veröffentliche Release

## Auto-Update

Nach dem Release wird die App automatisch Updates erkennen:
- Nutzer werden über neue Version informiert
- Download und Installation erfolgen automatisch
- Keine manuelle Aktion erforderlich

## Rollback (falls nötig)

Falls Probleme auftreten:

```bash
# Tag löschen
git tag -d v1.4.4
git push origin :refs/tags/v1.4.4

# Release auf GitHub löschen
# Manuell über GitHub-Interface
```

## Wichtige Hinweise

### Neue Dateien in v1.4.4
Stelle sicher, dass diese Dateien im Build enthalten sind:
- `src/services/WindowManager.ts`
- `src/components/TileWindow.tsx`
- `public/tile-window.html`
- `src/tile-window-main.tsx`

### Vite Multi-Page Build
Die `vite.config.ts` wurde aktualisiert für Multi-Page Support:
```typescript
rollupOptions: {
  input: {
    main: resolve(__dirname, 'index.html'),
    tileWindow: resolve(__dirname, 'public/tile-window.html')
  }
}
```

### Electron Menüleiste
Die `electron/main.ts` enthält jetzt die Menüleiste-Definition.
Teste alle Menü-Einträge vor dem Release!

## Support

Bei Problemen:
1. Prüfe die Console-Logs
2. Teste im Development-Modus
3. Prüfe GitHub Issues
4. Kontaktiere das Team

---

**Viel Erfolg beim Build! 🚀**
