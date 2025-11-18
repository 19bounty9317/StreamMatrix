# Release Checklist v1.4.4

## ✅ Vorbereitung

- [x] Version in `package.json` auf 1.4.4 aktualisiert
- [x] `GITHUB-RELEASE-v1.4.4.md` erstellt
- [x] `BUILD-v1.4.4.md` erstellt
- [x] `CHANGELOG.md` aktualisiert
- [x] `MULTI-WINDOW-ANLEITUNG.md` erstellt
- [x] Alle TypeScript-Warnungen behoben

## 🧪 Tests

### Development-Tests
- [ ] `npm run dev` startet ohne Fehler
- [ ] Menüleiste wird angezeigt
- [ ] `Strg+N` öffnet neues Fenster
- [ ] **Drag & Drop funktioniert zwischen Fenstern** ⭐
- [ ] Drop-Zone-Indikator wird angezeigt
- [ ] Kachel wird beim Drop verschoben
- [ ] Kacheln können per Rechtsklick verschoben werden
- [ ] 📺-Button erscheint bei mehreren Fenstern
- [ ] Slow Mode Button funktioniert (🐌)
- [ ] Emote-Only Button funktioniert (😀)
- [ ] UserCard öffnet sich bei Klick auf Username
- [ ] Verwarnen-Funktion sendet `/warn`
- [ ] Profil öffnen funktioniert
- [ ] Ban-Bestätigung erscheint
- [ ] Theme wird in allen Fenstern synchronisiert

### Build-Tests
- [ ] `npm run build` erfolgreich
- [ ] `npm run test:build` startet ohne Fehler
- [ ] Alle Features funktionieren im Production-Build
- [ ] tile-window.html wird korrekt geladen
- [ ] Menüleiste funktioniert im Build

### Installer-Tests
- [ ] `npm run build:win` erstellt Installer
- [ ] Installer startet ohne Fehler
- [ ] Installation funktioniert
- [ ] Desktop-Shortcut wird erstellt
- [ ] App startet nach Installation
- [ ] Alle Features funktionieren nach Installation
- [ ] Auto-Update-Mechanismus funktioniert

## 📦 Build erstellen

```bash
# 1. Dependencies installieren
npm install

# 2. TypeScript prüfen
npx tsc --noEmit
npx tsc -p tsconfig.electron.json --noEmit

# 3. Build erstellen
npm run build:win

# 4. Installer testen
cd release
./StreamMatrix-Setup-1.4.4.exe
```

## 🚀 Release-Prozess

### 1. Git Commit & Tag
```bash
git add .
git commit -m "Release v1.4.4 - Multi-Window & Chat-Verbesserungen"
git tag v1.4.4
git push origin main
git push origin v1.4.4
```

### 2. GitHub Release
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/releases/new
2. Tag auswählen: `v1.4.4`
3. Release-Titel: `StreamMatrix v1.4.4 - Multi-Window & Chat-Verbesserungen`
4. Beschreibung aus `GITHUB-RELEASE-v1.4.4.md` kopieren
5. Datei hochladen: `release/StreamMatrix-Setup-1.4.4.exe`
6. "Publish release" klicken

### 3. Verifizierung
- [ ] Release ist auf GitHub sichtbar
- [ ] Download-Link funktioniert
- [ ] Auto-Update erkennt neue Version
- [ ] Installer kann heruntergeladen werden

## 📋 Neue Features in v1.4.4

### Multi-Window
- WindowManager-Service mit Drag & Drop
- TileWindow-Komponente
- Menüleiste in Electron
- Kontextmenü im Dashboard
- **Drag & Drop zwischen Fenstern** ⭐
- Visueller Drop-Zone-Indikator
- Fenster-Synchronisation

### Chat-Verbesserungen
- Slow Mode Button (🐌)
- Emote-Only Button (😀)
- Visuelle Status-Anzeige

### UserCard
- Verwarnen-Funktion (⚠️)
- Profil öffnen (📺)
- Bestätigungsdialoge
- Fehler-Feedback
- Bessere Positionierung

## 🐛 Bekannte Probleme

Keine kritischen Probleme bekannt.

**Kleinere Einschränkungen:**
- Fenster-Positionen werden nicht gespeichert (geplant für v1.5.0)
- Drag & Drop funktioniert nur zwischen StreamMatrix-Fenstern

## 📞 Support

Bei Problemen während des Release-Prozesses:
1. Prüfe Console-Logs
2. Teste im Development-Modus
3. Prüfe GitHub Actions (falls konfiguriert)
4. Kontaktiere das Team

## 🎯 Nach dem Release

- [ ] Ankündigung in Discord/Community
- [ ] Social Media Post
- [ ] Dokumentation aktualisieren
- [ ] Feedback sammeln
- [ ] Issues auf GitHub beobachten

## 🔮 Nächste Schritte (v1.5.0)

- Gespeicherte Fenster-Layouts und -Positionen
- Fenster-Presets für verschiedene Szenarien
- Erweiterte Kachel-Konfiguration
- Performance-Optimierungen

---

**Release-Datum**: 08.11.2025
**Build-Version**: 1.4.4
**Status**: ✅ Bereit für Release
