# StreamMatrix v1.4.3 - Feature & Bugfix Release

## ✨ Neue Features

### 📅 Stream-Historie Kachel
Eine komplett neue Kachel zur Visualisierung deiner Stream-Statistiken!

#### Kalenderansicht
- **Monatsansicht** mit Navigation (← →)
- **Farbcodierte Tage**:
  - 🟢 Grün = Überdurchschnittlich (20%+ über Ø)
  - 🟡 Gelb = Durchschnittlich (±20% vom Ø)
  - 🔴 Rot = Unterdurchschnittlich (unter 80% vom Ø)
- **Hover-Vorschau**: Mini-Tooltip mit allen wichtigen Daten
- **Klick für Details**: Ausführliche Informationen zum ausgewählten Stream

#### Monats-Statistiken
- Anzahl Streams
- Durchschnittliche Dauer
- Durchschnittliche Zuschauer
- Gesamt Follower
- Gesamt Subs

#### 🔥 Streak-Anzeige
- Zeigt an wie viele Tage in Folge du gestreamt hast
- Motiviert zu regelmäßigem Streaming
- Orange Highlight mit Feuer-Emoji

#### 🔄 Twitch API Integration
- **Automatischer Sync**: Holt historische Daten von Twitch (letzte 100 VODs)
- **Intelligentes Merging**: Lokale Daten haben Priorität
- **Manueller Sync-Button**: Jederzeit aktualisieren
- **90-Tage-Historie**: Automatische Bereinigung alter Daten

#### Tag-Details
- Datum und Wochentag
- Stream-Dauer
- Durchschnittliche & Peak Zuschauer
- Startzeit
- Neue Follower
- Neue Subs

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

### Neue Dateien
- `src/components/tiles/TileStreamHistory.tsx`: Komplett neue Kachel für Stream-Historie

### Geänderte Dateien
- `src/components/tiles/TileChat.tsx`: 
  - Ref-Element am Ende der Nachrichten hinzugefügt
  - `scrollIntoView` statt `scrollTop` verwendet
  - Scroll-Listener vereinfacht (keine automatische Modus-Änderung)
- `src/components/tiles/TileViewerList.tsx`:
  - `lastMessage` Property hinzugefügt
  - Filter-Logik überarbeitet
  - Aktiv-Zähler korrigiert
- `src/services/StreamSessionTracker.ts`:
  - `saveToHistory()` Methode hinzugefügt
  - Automatisches Speichern von Sessions beim Stream-Ende
  - 90-Tage-Limit für Historie
- `src/App.tsx`: Stream-Historie Kachel registriert
- `src/components/Dashboard.tsx`: Stream-Historie Kachel hinzugefügt und Layout definiert
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

**v1.4.3 bringt ein großes neues Feature und wichtige Bugfixes:**
1. ✨ **Stream-Historie Kachel** - Visualisiere deine Stream-Performance
2. ✅ Chat scrollt korrekt nach unten
3. ✅ Live Viewer Filter funktioniert wie erwartet

**Die Stream-Historie Kachel ist perfekt um:**
- Deine Performance zu tracken
- Trends zu erkennen
- Dich zu motivieren (Streak!)
- Historische Daten zu analysieren

---

**Vollständige Changelog**: v1.4.2...v1.4.3
