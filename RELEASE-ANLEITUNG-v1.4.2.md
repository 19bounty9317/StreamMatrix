# Release v1.4.2 auf GitHub erstellen

## Automatisch (wenn GitHub CLI installiert ist)

```bash
gh release create v1.4.2 --title "v1.4.2 - Bugfix Release" --notes-file GITHUB-RELEASE-v1.4.2.md release\StreamMatrix-Setup-1.4.2.exe
```

## Manuell auf GitHub.com

### 1. Gehe zu GitHub Releases
https://github.com/19bounty9317/StreamMatrix/releases/new

### 2. Release-Informationen eingeben

**Tag:** `v1.4.2` (bereits erstellt und gepusht ✅)

**Release Title:** `v1.4.2 - Bugfix Release`

**Description:** Kopiere den Inhalt aus `GITHUB-RELEASE-v1.4.2.md`

### 3. Installer hochladen

Lade die Datei hoch:
- `release\StreamMatrix-Setup-1.4.2.exe` (ca. 100-150 MB)

### 4. Release veröffentlichen

Klicke auf "Publish release"

---

## Was wurde geändert in v1.4.2?

### 🐛 Fehlerbehebungen
- ✅ Automatische Kachel-Migration implementiert
- ✅ Raid-Ziele & Stream-Vorschau werden automatisch hinzugefügt
- ✅ Sub-Bomben (5+ Gift Subs) triggern jetzt Celebration-Effekte
- ✅ Hype Train Ende dispatched Celebration-Events
- ✅ Alle visuellen Effekte funktionieren im Live-Betrieb
- ✅ TypeScript-Fehler behoben

### 🎨 Visuelle Verbesserungen
- 💣 Sub-Bomben mit speziellem Emoji und 80 Partikeln
- 🚂 Hype Train mit dynamischer Partikel-Anzahl
- 🎨 Verbesserte Farben und Animationen

### 📋 Technische Details
- Automatische Tile-Migration in App.tsx
- Celebration-Events in TileActivity.tsx
- Sub-Bomb Event-Typ in EventCelebration.tsx
- Version auf 1.4.2 aktualisiert

---

## Git Status

✅ Code committed: `3e5ecd0`
✅ Tag erstellt: `v1.4.2`
✅ Branch gepusht: `feature/visual-effects-test`
✅ Tag gepusht: `v1.4.2`
✅ Installer erstellt: `release\StreamMatrix-Setup-1.4.2.exe`

**Nächster Schritt:** Release auf GitHub.com erstellen und Installer hochladen
