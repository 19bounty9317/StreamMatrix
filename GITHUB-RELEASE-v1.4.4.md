# StreamMatrix v1.4.4 - Multi-Window & Chat-Verbesserungen

## 🎉 Neue Features

### 📺 Multi-Window Support
- **Mehrere Fenster für Kacheln**: Öffne zusätzliche Fenster für deine Kacheln
- **Menüleiste hinzugefügt**: Neue Menüleiste mit File, Edit, View, Window und Help
- **Drag & Drop zwischen Fenstern**: ⭐ NEU!
  - Ziehe Kacheln einfach zwischen Fenstern
  - Visueller Drop-Zone-Indikator
  - Funktioniert über alle offenen Fenster hinweg
  - Smooth Animations und Feedback
- **Alternative Verschiebe-Methoden**:
  - Rechtsklick auf Kachel-Header → Zielfenster auswählen
  - 📺-Button im Header für schnellen Zugriff
  - Automatische Synchronisation zwischen allen Fenstern
- **Tastenkombinationen**:
  - `Strg+N` / `Cmd+N`: Neues Kachel-Fenster öffnen
  - `Strg+,` / `Cmd+,`: Einstellungen öffnen
  - `F12` / `Strg+Shift+I`: DevTools öffnen

### 💬 Chat-Verbesserungen
- **Slow Mode Button**: Aktiviere/deaktiviere Slow Mode direkt aus dem Chat
  - Zeigt aktive Sekunden an (Standard: 30s)
  - Visuelles Feedback mit orangem Highlight
- **Emote-Only Button**: Aktiviere/deaktiviere Emote-Only Mode
  - Visuelles Feedback mit lila Highlight
  - Schneller Zugriff ohne Chat-Befehle

### 👤 UserCard-Verbesserungen
- **Verwarnen-Funktion**: Sende offizielle Twitch-Warnungen
- **Profil öffnen**: Öffnet das Twitch-Profil im Browser
- **Bestätigungsdialoge**: Sicherheitsabfrage beim Bannen
- **Fehler-Feedback**: Klare Fehlermeldungen mit Hinweisen auf benötigte Rechte
- **Bessere Positionierung**: UserCard bleibt immer im sichtbaren Bereich

## 🔧 Verbesserungen

### Performance
- Optimierte Fenster-Synchronisation
- Effizientes Kachel-Management
- Reduzierte Speichernutzung bei mehreren Fenstern

### Benutzerfreundlichkeit
- Intuitive Menüleiste für bessere Navigation
- Kontextmenü für schnellen Zugriff auf Funktionen
- Visuelle Indikatoren für aktive Modi (Slow, Emote-Only)
- Automatische Theme-Synchronisation in allen Fenstern

### Stabilität
- Verbesserte Fehlerbehandlung bei Moderator-Aktionen
- Automatisches Cleanup beim Schließen von Fenstern
- Robuste Konfigurationsspeicherung

## 📖 Verwendung

### Multi-Window Setup
1. Öffne ein neues Fenster: `Window` → `Neues Kachel-Fenster` oder `Strg+N`
2. **Drag & Drop** (empfohlen):
   - Klicke und halte den Kachel-Header
   - Ziehe die Kachel zum anderen Fenster
   - Lasse los wenn der Drop-Indikator erscheint
3. **Alternativ - Rechtsklick**:
   - Rechtsklick auf eine Kachel
   - Wähle "Verschieben nach: Fenster X"
4. Die Kachel erscheint sofort im neuen Fenster

**Perfekt für:**
- Dual-Monitor-Setups
- OBS Window Capture
- Flexible Stream-Layouts
- Separate Chat-Fenster

### Chat-Modi
- **Slow Mode**: Klicke auf 🐌 im Chat-Header
- **Emote-Only**: Klicke auf 😀 im Chat-Header
- Beide Modi zeigen visuelles Feedback wenn aktiv

### Moderator-Aktionen
- Klicke auf einen Benutzernamen im Chat
- Wähle die gewünschte Aktion:
  - 📺 Kanal besuchen
  - 🛡️ Mod / 💎 VIP geben
  - ⚠️ Verwarnen
  - ⏱️ Timeout (1m / 10m)
  - 🚫 Ban (mit Bestätigung)

## 🐛 Behobene Fehler

- UserCard wird nicht mehr außerhalb des Bildschirms angezeigt
- Kacheln werden korrekt zwischen Fenstern synchronisiert
- Theme-Einstellungen werden in allen Fenstern übernommen
- Menü-Events werden korrekt verarbeitet

## 📋 Technische Details

### Neue Dateien
- `src/services/WindowManager.ts` - Verwaltung mehrerer Fenster
- `src/components/TileWindow.tsx` - Komponente für zusätzliche Fenster
- `public/tile-window.html` - HTML für Kachel-Fenster
- `src/tile-window-main.tsx` - Entry Point für Kachel-Fenster
- `MULTI-WINDOW-ANLEITUNG.md` - Ausführliche Dokumentation

### Aktualisierte Komponenten
- `electron/main.ts` - Menüleiste und Fenster-Management
- `electron/preload.ts` - IPC-Handler für Fenster-Events
- `src/components/Dashboard.tsx` - Kontextmenü und Fenster-Integration
- `src/components/tiles/TileChat.tsx` - Slow Mode & Emote-Only Buttons
- `src/components/UserCard.tsx` - Erweiterte Moderator-Funktionen
- `vite.config.ts` - Multi-Page Build-Konfiguration

## 🔄 Migration von v1.4.3

Keine Migrations-Schritte erforderlich! Alle neuen Features sind sofort verfügbar.

**Hinweis**: Beim ersten Start werden keine zusätzlichen Fenster geöffnet. Nutze `Strg+N` oder das Window-Menü, um neue Fenster zu erstellen.

## 📦 Installation

### Windows
1. Lade `StreamMatrix-Setup-1.4.4.exe` herunter
2. Führe das Setup aus
3. Die App aktualisiert sich automatisch

### Manuelles Update
1. Deinstalliere die alte Version (optional)
2. Installiere v1.4.4
3. Deine Einstellungen bleiben erhalten

## 🙏 Danke

Vielen Dank an alle Tester und die Community für das Feedback!

## 📝 Bekannte Einschränkungen

- Maximale Anzahl Fenster: Unbegrenzt (empfohlen: 2-3 für beste Performance)
- Drag & Drop zwischen Fenstern: Aktuell nur via Kontextmenü
- Fenster-Positionen werden nicht gespeichert (geplant für v1.4.5)

## 🔮 Ausblick auf v1.4.5

- Gespeicherte Fenster-Layouts und -Positionen
- Fenster-Presets für verschiedene Szenarien
- Erweiterte Kachel-Konfiguration pro Fenster
- Performance-Optimierungen für viele Fenster

---

**Vollständiges Changelog**: https://github.com/19bounty9317/StreamMatrix/compare/v1.4.3...v1.4.4
