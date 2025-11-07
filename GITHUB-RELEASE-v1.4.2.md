# StreamMatrix v1.4.2 - Bugfix Release

## 🐛 Fehlerbehebungen

### Automatische Kachel-Migration
- **Neue Kacheln werden automatisch hinzugefügt**: Wenn neue Kacheln im Code hinzugefügt werden, erscheinen sie automatisch in der Sidebar
- **Raid-Ziele & Stream-Vorschau**: Diese Kacheln werden jetzt bei bestehenden Installationen automatisch hinzugefügt
- Keine manuelle localStorage-Manipulation mehr nötig

### Visuelle Effekte - Vollständige Integration
- **Sub-Bomben (5+ Gift Subs)**: Triggern jetzt massive Celebration-Effekte mit 💣 Emoji-Regen (80 Partikel!)
- **Hype Train Ende**: Dispatched jetzt Celebration-Events für visuelle Effekte
- **Hype Train Start**: Verbesserte Animation mit dynamischer Partikel-Anzahl basierend auf Level
- Alle Event-Typen triggern jetzt korrekt die visuellen Effekte im Live-Betrieb

### Event-System Verbesserungen
- **Sub-Bomb Event-Typ**: Neuer dedizierter Event-Typ für 5+ Gift Subs
- **Hype Train Details**: Level, totalSubs und totalBits werden jetzt korrekt übergeben
- **Celebration Mode**: Funktioniert jetzt mit allen Event-Typen (Full/Visual/Off)

### TypeScript-Fixes
- Alle Type-Errors in App.tsx behoben
- Verbesserte Type-Safety für Tile-Management

## 🎨 Visuelle Verbesserungen

### Sub-Bomben
- Spezielle pink-lila Farbgebung
- 💣 Emoji statt ⭐
- 80 Partikel für maximalen Effekt
- Spezielle Nachricht: "SUB-BOMBE!"

### Hype Train
- Dynamische Partikel-Anzahl: 40 + (Level × 10) Partikel
- Verbesserte Zug-Animation
- Korrekte Level-Anzeige in Nachrichten

## 📋 Technische Details

### Geänderte Dateien
- `src/App.tsx`: Automatische Tile-Migration implementiert
- `src/components/tiles/TileActivity.tsx`: Sub-Bomb und Hype Train Celebration-Events hinzugefügt
- `src/components/EventCelebration.tsx`: Sub-Bomb Event-Typ und verbesserte Hype Train Unterstützung
- `src/config/version.ts`: Version auf 1.4.2 aktualisiert
- `package.json`: Version auf 1.4.2 aktualisiert

### Event-Dispatching
Alle Events dispatchen jetzt korrekt `stream-celebration` Events:
- ✅ Follows
- ✅ Subs
- ✅ Gift Subs (1-4)
- ✅ Sub-Bomben (5+)
- ✅ Bits
- ✅ Raids
- ✅ Hype Train Start
- ✅ Hype Train Ende

## 🔄 Update-Hinweise

### Für bestehende Nutzer
- Die Raid-Ziele und Stream-Vorschau Kacheln werden automatisch hinzugefügt
- Keine manuelle Konfiguration nötig
- Alle visuellen Effekte funktionieren jetzt im Live-Betrieb

### Installation
1. Lade die neue Version herunter
2. Installiere über die alte Version (Einstellungen bleiben erhalten)
3. Starte die App neu
4. Die neuen Kacheln erscheinen automatisch in der Sidebar

## 🎯 Was funktioniert jetzt

### Celebration-System
- **Full Mode**: Alle Effekte (Benachrichtigung + Emoji-Regen + Animationen)
- **Visual Mode**: Nur Benachrichtigungen (kein Emoji-Regen)
- **Off Mode**: Keine visuellen Effekte

### Kachel-System
- Automatische Migration neuer Kacheln
- Bestehende Einstellungen bleiben erhalten
- Neue Kacheln werden mit Default-Werten hinzugefügt

---

**Vollständige Changelog**: v1.4.1...v1.4.2
