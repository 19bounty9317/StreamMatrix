# Einstellungen-Migration bei Updates

## ✅ Was wird bei Updates automatisch übernommen?

### 1. Kachel-Einstellungen
- ✅ **Aktivierte/Deaktivierte Kacheln** - Deine Auswahl bleibt erhalten
- ✅ **Reihenfolge der Kacheln** - Sidebar-Reihenfolge bleibt gleich
- ✅ **Neue Kacheln** - Werden automatisch am Ende hinzugefügt
- ✅ **Gelöschte Kacheln** - Werden automatisch entfernt
- ✅ **Aktualisierte Namen** - Namen werden aktualisiert, Einstellungen bleiben

**Gespeichert in:** `localStorage: tiles-order`

### 2. Dashboard-Layout
- ✅ **Position der Kacheln** - X/Y Koordinaten bleiben erhalten
- ✅ **Größe der Kacheln** - Breite/Höhe bleibt erhalten
- ✅ **Neue Kacheln** - Bekommen Default-Position
- ✅ **Entfernte Kacheln** - Werden aus Layout entfernt

**Gespeichert in:** `localStorage: dashboard-layout`

### 3. Kachel-Schriftgrößen
- ✅ **Individuelle Schriftgrößen** - Pro Kachel gespeichert
- ✅ **Zoom-Level** - Bleibt für jede Kachel erhalten

**Gespeichert in:** `localStorage: tile-font-sizes`

### 4. App-Einstellungen
- ✅ **Theme** - Dein gewähltes Theme bleibt aktiv
- ✅ **Kompakt-Modus** - Ein/Aus Einstellung bleibt
- ✅ **Avatar anzeigen** - Sidebar-Avatar Einstellung bleibt
- ✅ **Celebration-Modus** - Full/Visual/Off bleibt erhalten
- ✅ **Celebration-Dauer** - Sekunden-Einstellung bleibt

**Gespeichert in:** `localStorage: app-settings`

### 5. Chat-Einstellungen
- ✅ **Zeitstempel anzeigen** - Ein/Aus bleibt erhalten
- ✅ **Nachrichten hervorheben** - Ein/Aus bleibt erhalten
- ✅ **Zuschauerzahl anzeigen** - Ein/Aus bleibt erhalten
- ✅ **Auto-Scroll** - Ein/Aus bleibt erhalten

**Gespeichert in:** `localStorage: chat-*`

### 6. Viewer-List Einstellungen
- ✅ **Filter (Active/All)** - Deine Auswahl bleibt
- ✅ **Aktivitäts-Schwellwert** - 5-Minuten Einstellung bleibt

**Gespeichert in:** `localStorage: viewer-list-*`

### 7. Raid-Targets Einstellungen
- ✅ **Nur Live anzeigen** - Filter-Einstellung bleibt

**Gespeichert in:** `localStorage: raid-targets-*`

### 8. Sidebar-Einstellungen
- ✅ **Eingeklappt/Ausgeklappt** - Zustand bleibt erhalten

**Gespeichert in:** `localStorage: sidebar-collapsed`

### 9. Activity Feed
- ✅ **Letzte 50 Events** - Werden gespeichert und bleiben erhalten

**Gespeichert in:** `localStorage: activity-feed`

### 10. Stream-Session Stats
- ✅ **Session-Daten** - Aktuelle Stream-Session bleibt
- ✅ **Start-Werte** - Follower/Subs beim Stream-Start

**Gespeichert in:** `localStorage: stream-session-stats`

### 11. Update-Benachrichtigungen
- ✅ **Abgelehnte Updates** - Welche Updates du "Später" geklickt hast

**Gespeichert in:** `localStorage: dismissed-update-version`

### 12. Tutorial
- ✅ **Tutorial gesehen** - Wird nicht mehr automatisch angezeigt

**Gespeichert in:** `localStorage: tutorial-completed`

## 🔄 Wie funktioniert die Migration?

### Bei jedem App-Start:
1. **Lade gespeicherte Einstellungen** aus localStorage
2. **Vergleiche mit Default-Werten** aus dem Code
3. **Merge Einstellungen:**
   - Behalte User-Einstellungen (enabled/disabled, Positionen, etc.)
   - Füge neue Kacheln mit Default-Werten hinzu
   - Entferne gelöschte Kacheln
   - Aktualisiere Namen/Labels
4. **Speichere aktualisierte Einstellungen** zurück

### Beispiel:
```
Vor Update:
- Chat: enabled ✅
- Activity: enabled ✅
- Raid-Targets: ❌ existiert nicht

Nach Update v1.4.2:
- Chat: enabled ✅ (beibehalten)
- Activity: enabled ✅ (beibehalten)
- Raid-Targets: enabled ✅ (neu hinzugefügt mit Default)
```

## 🛡️ Sicherheit

### Fehlerbehandlung:
- ✅ **Try-Catch** um localStorage-Fehler abzufangen
- ✅ **Fallback zu Defaults** wenn localStorage korrupt ist
- ✅ **Console-Logs** für Debugging

### Backup:
- localStorage wird vom Browser verwaltet
- Einstellungen bleiben auch nach App-Neustart erhalten
- Bei Deinstallation werden Einstellungen gelöscht

## 📝 Für Entwickler

### Neue Kachel hinzufügen:
1. Füge Kachel zu `defaultTiles` in `App.tsx` hinzu
2. Füge Layout zu `layoutMap` in `Dashboard.tsx` hinzu
3. Erstelle Komponente in `src/components/tiles/`
4. Registriere in `tileComponents` in `Dashboard.tsx`

**Die Migration passiert automatisch!** ✨

### Kachel entfernen:
1. Entferne aus `defaultTiles` in `App.tsx`
2. Entferne aus `layoutMap` in `Dashboard.tsx`
3. Lösche Komponente (optional)

**Die Migration entfernt sie automatisch aus User-Einstellungen!** ✨

### Kachel umbenennen:
1. Ändere `name` in `defaultTiles` in `App.tsx`

**Der neue Name wird automatisch übernommen, enabled-Status bleibt!** ✨

## 🎯 Zusammenfassung

**Alles wird automatisch übernommen!** 🎉

Du musst **nichts manuell konfigurieren** nach einem Update. Die App:
- ✅ Behält alle deine Einstellungen
- ✅ Fügt neue Features automatisch hinzu
- ✅ Entfernt veraltete Features automatisch
- ✅ Aktualisiert Namen und Labels
- ✅ Migriert Daten sicher

**Einfach installieren und weitermachen!** 🚀
