# 📋 Release v1.4.9 - Upload Anleitung

## Dateien für GitHub Release

Folgende Dateien müssen zu GitHub Releases hochgeladen werden:

### 1. Installer
- `release/StreamMatrix-Setup-1.4.9.exe` (Hauptinstaller)

### 2. Update-Dateien
- `release/StreamMatrix-Setup-1.4.9.exe.blockmap` (für Auto-Update)
- `release/latest.yml` (Update-Manifest)

---

## GitHub Release erstellen

### Schritt 1: Neues Release erstellen
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/releases/new
2. **Tag:** `v1.4.9`
3. **Release-Titel:** `StreamMatrix v1.4.9 - Bugfixes & Improvements`

### Schritt 2: Release-Beschreibung
Kopiere den Inhalt aus `GITHUB-RELEASE-v1.4.9.md`

### Schritt 3: Dateien hochladen
Lade diese 3 Dateien hoch:
- ✅ `StreamMatrix-Setup-1.4.9.exe`
- ✅ `StreamMatrix-Setup-1.4.9.exe.blockmap`
- ✅ `latest.yml`

### Schritt 4: Veröffentlichen
- ✅ "Set as the latest release" aktivieren
- ✅ Klicke auf "Publish release"

---

## Nach dem Release

### 1. Alte Releases aufräumen (optional)
Lösche alte Test-Releases oder Pre-Releases um Übersicht zu behalten.

### 2. Website aktualisieren
- Update Download-Link auf streammatrix.de
- Changelog auf Website aktualisieren

### 3. Ankündigung
- Discord/Community benachrichtigen
- Social Media Post (optional)

---

## Wichtige Hinweise für Nutzer

⚠️ **Nach dem Update müssen sich Nutzer neu anmelden!**

Grund: Neue OAuth-Berechtigung `channel:manage:redemptions` für Rewards Queue

### Anleitung für Nutzer:
1. Abmelden in StreamMatrix
2. Neu anmelden mit Twitch
3. Neue Berechtigung akzeptieren
4. Optional: Test-Daten bereinigen

---

## Changelog Highlights

### Bugfixes
- Rewards Queue 403 Fehler behoben
- Stream-Historie verbessert (kein "Keine Daten" mehr)
- Test-Daten Cleanup verbessert

### Verbesserungen
- Rotes X für nicht-gestreamte Tage
- Automatische responsive Kalenderansicht
- Bessere Fehleranzeige

---

## Technische Details

### Neue OAuth Scopes
```
channel:manage:redemptions
```

### Geänderte Dateien
- `src/config/twitch.config.ts` - Neuer Scope hinzugefügt
- `src/components/tiles/TileStreamHistory.tsx` - UI Verbesserungen
- `src/components/tiles/TileRewardsQueue.tsx` - Bessere Fehlerbehandlung
- `src/services/TwitchService.ts` - Rewards API verbessert
- `src/services/TestModeManager.ts` - Cleanup-Logik verbessert

---

## Testen vor Release

- [ ] Installer funktioniert
- [ ] Auto-Update funktioniert (von v1.4.8 → v1.4.9)
- [ ] Neu-Anmeldung fordert neue Berechtigung an
- [ ] Rewards Queue zeigt Redemptions an
- [ ] Stream-Historie zeigt Kalender korrekt
- [ ] Test-Daten Cleanup funktioniert

---

**Release erstellt am:** 19. November 2025
**Build-Zeit:** ~3 Sekunden
**Installer-Größe:** ~90 MB
