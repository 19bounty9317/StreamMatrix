# StreamMatrix v1.4.3 - Bugfix Release

## 🐛 Fehlerbehebungen

### Chat Auto-Scroll
- **Scroll-Position korrigiert**: Chat scrollt jetzt korrekt nach ganz unten (nicht mehr zur Mitte)
- **Ref-Element hinzugefügt**: Unsichtbares Marker-Element am Ende der Nachrichten
- **Auto-Modus bleibt aktiv**: Hochscrollen deaktiviert Auto-Scroll nicht mehr automatisch
- **Nur manueller Toggle**: Auto-Scroll Modus ändert sich nur noch über den Button

### Live Viewer Filter
- **"Aktiv" vs "Alle" funktioniert jetzt korrekt**:
  - **🟢 Aktiv**: Zeigt nur Viewer die in den letzten 5 Minuten eine Chat-Nachricht geschrieben haben
  - **📺 Alle**: Zeigt alle Viewer im Chat (auch stille Zuschauer/Lurker)
- **Neue Tracking-Logik**: Unterscheidet zwischen `lastSeen` (im Chat) und `lastMessage` (hat geschrieben)
- **Präzisere Anzeige**: Aktive Viewer werden jetzt korrekt gefiltert

## 📋 Technische Details

### Geänderte Dateien
- `src/components/tiles/TileChat.tsx`: 
  - Ref-Element am Ende der Nachrichten hinzugefügt
  - `scrollIntoView` statt `scrollTop` verwendet
  - Scroll-Listener vereinfacht (keine automatische Modus-Änderung)
- `src/components/tiles/TileViewerList.tsx`:
  - `lastMessage` Property hinzugefügt
  - Filter-Logik überarbeitet
  - Aktiv-Zähler korrigiert
- `src/config/version.ts`: Version auf 1.4.3 aktualisiert
- `package.json`: Version auf 1.4.3 aktualisiert

## 🔄 Update-Hinweise

### Für bestehende Nutzer
- Alle Einstellungen bleiben erhalten
- Chat Auto-Scroll Einstellung wird übernommen
- Live Viewer Filter funktioniert jetzt wie erwartet

### Was sich ändert
- **Chat**: Scrollt jetzt immer ganz nach unten (nicht mehr zur Mitte)
- **Chat**: Auto-Scroll bleibt aktiv auch wenn du hochscrollst
- **Live Viewer**: "Aktiv" zeigt jetzt wirklich nur aktive Chatter

## 🎯 Zusammenfassung

**v1.4.3 behebt zwei wichtige Bugs:**
1. ✅ Chat scrollt korrekt nach unten
2. ✅ Live Viewer Filter funktioniert wie erwartet

**Keine neuen Features, nur Bugfixes!** 🔧

---

**Vollständige Changelog**: v1.4.2...v1.4.3
