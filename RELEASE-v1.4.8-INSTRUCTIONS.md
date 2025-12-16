# 🚀 Release v1.4.8 - Build & Deploy Anleitung

## ✅ Was wurde bereits gemacht:

1. ✅ Version auf 1.4.8 aktualisiert (`package.json` + `version.ts`)
2. ✅ CHANGELOG.md aktualisiert
3. ✅ Release Notes erstellt (`GITHUB-RELEASE-v1.4.8.md`)
4. ✅ Code committed und gepusht
5. ✅ Git Tag erstellt

## 📦 Nächste Schritte: Build & Release

### 1. App builden:

```bash
npm run build
```

**Erwartete Ausgabe:**
- `dist/` Ordner mit kompiliertem Code
- `StreamMatrix-Setup-1.4.8.exe` im Root-Verzeichnis

### 2. GitHub Release erstellen:

1. **Gehe zu:** https://github.com/19bounty9317/StreamMatrix/releases/new

2. **Tag auswählen:** `v1.4.8`

3. **Release Title:**
   ```
   v1.4.8 - Streamer Directory, Donations & Rewards Queue
   ```

4. **Description:** Kopiere aus `GITHUB-RELEASE-v1.4.8.md`

5. **Upload Binary:**
   - Datei: `StreamMatrix-Setup-1.4.8.exe`
   - Drag & Drop in "Attach binaries"

6. **Klicke "Publish release"**

### 3. Alte Releases löschen (nur 3 behalten):

**Aktuelle Releases:**
- v1.4.8 (neu) ✅
- v1.4.7 ✅
- v1.4.6 ✅
- v1.4.5 ❌ LÖSCHEN
- v1.4.4 ❌ LÖSCHEN
- Ältere ❌ LÖSCHEN

**So löschst du:**
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/releases
2. Bei v1.4.5 klicke auf "..." → "Delete release"
3. Bestätige mit "Delete this release"
4. Wiederhole für v1.4.4 und ältere

**Wichtig:** Tags bleiben erhalten (nur Release wird gelöscht)

### 4. Discord-Announcement:

```markdown
🎉 **StreamMatrix v1.4.8 ist da!**

**Neue Features:**
🎮 Streamer-Verzeichnis - Entdecke die Community auf streammatrix.de/streamer
💜 Spendenkampagne - Hilf uns, das Code-Signing-Zertifikat zu finanzieren
🎁 Rewards Queue - Verwalte Channel Points Redemptions im Dashboard

**Verbesserungen:**
✨ Besseres Update-System (Banner bleibt nach "Später" sichtbar)
📊 Google Analytics Integration
🌐 Neue Streamer-Verzeichnis-Seite

**Download:**
https://github.com/19bounty9317/StreamMatrix/releases/tag/v1.4.8

**Changelog:**
https://github.com/19bounty9317/StreamMatrix/blob/main/CHANGELOG.md

Viel Spaß! 🚀
```

## 🧹 Cleanup nach Release:

### Optional: Alte Release-Docs archivieren

```bash
# Verschiebe alte Release-Docs
mkdir -p archive/releases
mv GITHUB-RELEASE-v1.4.5.md archive/releases/
mv GITHUB-RELEASE-v1.4.4.md archive/releases/
```

## ✅ Checkliste:

- [ ] `npm run build` ausgeführt
- [ ] `StreamMatrix-Setup-1.4.8.exe` erstellt
- [ ] GitHub Release erstellt
- [ ] Binary hochgeladen
- [ ] Release veröffentlicht
- [ ] Alte Releases gelöscht (nur 3 behalten)
- [ ] Discord-Announcement gepostet
- [ ] Website geprüft (streammatrix.de)
- [ ] Streamer-Verzeichnis getestet (streammatrix.de/streamer)

## 🎯 Nach dem Release:

### Testen:
1. **Download testen:** Release-Link öffnen und downloaden
2. **Installation testen:** Setup ausführen
3. **Update testen:** Von v1.4.7 auf v1.4.8 updaten
4. **Neue Features testen:**
   - Streamer-Verzeichnis Opt-In
   - Rewards Queue Kachel
   - Spenden-Button in Einstellungen

### Monitoring:
- **GitHub:** Prüfe Download-Zahlen
- **Firebase:** Prüfe Cloud Functions Logs
- **Website:** Prüfe Google Analytics
- **Discord:** Beantworte Fragen

## 🐛 Bekannte Probleme:

- Windows SmartScreen Warnung (kein Code-Signing)
- Erste Installation kann länger dauern
- Twitch API Rate Limits bei vielen Streamern

## 📝 Notizen:

### Build-Probleme?

**Fehler: "Cannot find module"**
```bash
npm install
npm run build
```

**Fehler: "Electron Builder failed"**
```bash
rm -rf node_modules
npm install
npm run build
```

**Setup.exe nicht erstellt:**
- Prüfe `electron-builder.json`
- Prüfe `package.json` scripts
- Prüfe Logs in Console

### Release-Probleme?

**Tag existiert bereits:**
```bash
git tag -d v1.4.8
git push origin :refs/tags/v1.4.8
git tag -a v1.4.8 -m "Release v1.4.8"
git push origin v1.4.8
```

**Binary zu groß (>2GB):**
- GitHub erlaubt max 2GB pro File
- Komprimiere mit 7zip falls nötig

## 🎉 Fertig!

Nach erfolgreichem Release:
- ✅ v1.4.8 ist live
- ✅ Nutzer können updaten
- ✅ Neue Features verfügbar
- ✅ Nur 3 Releases auf GitHub

**Viel Erfolg! 🚀**
