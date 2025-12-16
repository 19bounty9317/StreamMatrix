# Test-Modus System mit automatischer Daten-Verifizierung

## Übersicht

Das neue Test-Modus System unterscheidet automatisch zwischen echten Stream-Daten und Test-Daten.

## Wie es funktioniert

### 1. Automatische Verifizierung echter Daten

**Wenn dein Stream 10+ Minuten live ist:**
- ✅ Alle Daten werden automatisch als `isReal: true` markiert
- ✅ Diese Daten bleiben dauerhaft erhalten
- ✅ Gilt für: Stream-Sessions, Activity Feed, Follower/Subs

**Prüfung alle 30 Sekunden:**
- Der `TestModeManager` prüft via Twitch API ob Stream live ist
- Nach 10 Minuten durchgehend live → Daten werden als echt markiert

### 2. Test-Modus (5 Minuten Auto-Cleanup)

**Aktivierung:**
- Test-Modus in Einstellungen aktivieren
- Timer startet automatisch: 5 Minuten

**Nach 5 Minuten:**
- ⏰ 30-Sekunden Countdown startet automatisch
- 📊 Visueller Timer wird angezeigt (oben rechts + in Einstellungen)
- 🗑️ Nach 30 Sekunden: Alle Daten OHNE `isReal: true` Flag werden gelöscht
- ✅ Echte Daten (mit `isReal: true`) bleiben erhalten

**Manuelles Beenden:**
- Test-Modus ausschalten → 30 Sekunden Countdown
- Button "Jetzt sofort löschen" → Sofortiges Cleanup

### 3. Was wird gelöscht?

**Gelöscht werden:**
- ❌ Activity Feed Einträge ohne `isReal: true`
- ❌ Stream-Sessions ohne `isReal: true`
- ❌ Test-Follower/Subs (Session-Stats ohne `isReal: true`)

**Behalten werden:**
- ✅ Alle Daten mit `isReal: true` Flag
- ✅ Stream-Sessions von echten Streams (10+ Min live)
- ✅ Echte Follower/Subs aus verifizierten Sessions

## Verwendung

### Für Entwickler/Tester

1. **Test-Modus aktivieren** in Einstellungen
2. **Teste Features** (max. 5 Minuten)
3. **Automatisches Cleanup** nach 5 Min
4. Oder: **Manuell beenden** mit Cleanup-Button

### Für echte Streams

1. **Stream starten** (normal, ohne Test-Modus)
2. **Nach 10 Minuten** werden Daten automatisch als echt markiert
3. **Alle Daten bleiben erhalten** auch nach App-Neustart

## Technische Details

### TestModeManager Service

**Verantwortlich für:**
- Live-Check alle 30 Sekunden
- Automatisches Markieren als `isReal: true` nach 10 Min
- 5-Minuten Timer für Test-Modus
- Cleanup von Test-Daten

**Initialisierung:**
```typescript
// In App.tsx beim Login
import('./services/TestModeManager').then(({ default: TestModeManager }) => {
  TestModeManager.getInstance();
});
```

### Datenstruktur

**Stream-Session mit isReal Flag:**
```typescript
{
  date: "2025-11-19",
  duration: 228, // Minuten
  avgViewers: 15,
  newFollowers: 5,
  newSubs: 2,
  isReal: true // ← Markiert als echt
}
```

**Activity Feed mit isReal Flag:**
```typescript
{
  id: "activity-123",
  type: "follow",
  username: "NewFollower",
  timestamp: "2025-11-19T10:30:00Z",
  isReal: true // ← Markiert als echt
}
```

## Vorteile

✅ **Automatisch:** Keine manuelle Markierung nötig
✅ **Sicher:** Echte Daten werden nie gelöscht
✅ **Praktisch:** Test-Modus für Entwicklung ohne Datenmüll
✅ **Transparent:** Klare Unterscheidung zwischen Test und Echt

## Hinweise

- **10 Minuten Schwelle:** Verhindert dass kurze Test-Streams als echt markiert werden
- **5 Minuten Test-Modus:** Genug Zeit zum Testen, aber nicht zu lange
- **30 Sekunden Countdown:** Zeit zum Abbrechen falls versehentlich deaktiviert
- **Abwärtskompatibilität:** Alte Daten ohne `isReal` Flag werden als echt behandelt

## Beispiel-Szenario

### Szenario 1: Echter Stream
1. Stream startet um 20:00 Uhr
2. Um 20:10 Uhr → Daten werden als `isReal: true` markiert
3. Stream endet um 23:00 Uhr
4. **Ergebnis:** Alle Daten bleiben dauerhaft erhalten

### Szenario 2: Test-Modus
1. Test-Modus aktiviert um 15:00 Uhr
2. Teste Features, simuliere Events
3. Um 15:05 Uhr → 30-Sekunden Countdown startet
4. Um 15:05:30 Uhr → Automatisches Cleanup
5. **Ergebnis:** Alle Test-Daten gelöscht, echte Daten bleiben

### Szenario 3: Gemischt
1. Stream läuft seit 20:00 Uhr (echt, `isReal: true`)
2. Um 21:00 Uhr → Test-Modus aktiviert für Feature-Test
3. Um 21:05 Uhr → 30s Countdown startet
4. Um 21:05:30 Uhr → Test-Modus Cleanup
5. **Ergebnis:** Test-Daten gelöscht, Stream-Daten von 20:00-21:00 bleiben erhalten

## Fehlerbehebung

**Problem:** Echte Daten wurden gelöscht
- **Ursache:** Stream war < 10 Minuten live
- **Lösung:** Warte 10+ Minuten bevor du Test-Modus aktivierst

**Problem:** Test-Daten bleiben erhalten
- **Ursache:** Stream war 10+ Minuten live während Test-Modus
- **Lösung:** Manueller Cleanup-Button in Einstellungen

**Problem:** Test-Modus endet nicht automatisch
- **Ursache:** App wurde geschlossen/neugestartet
- **Lösung:** Test-Modus manuell deaktivieren

## UI-Komponenten

### TestModeCleanupNotification
- **Position:** Oben rechts (fixed)
- **Anzeige:** Automatisch nach 5 Min Test-Modus
- **Countdown:** 30 Sekunden mit visuellem Progress Bar
- **Animation:** Slide-in von rechts

### Settings - Cleanup Anzeige
- **Automatischer Countdown:** Orange, nach 5 Min Test-Modus
- **Manueller Countdown:** Rot, beim manuellen Ausschalten
- **Progress Bar:** Visueller Fortschritt von 30s → 0s

## Zukünftige Erweiterungen

- [x] Countdown-Anzeige für Test-Modus (✅ Implementiert)
- [ ] Anzeige des Live-Status in UI
- [ ] Statistik: Anzahl echter vs. Test-Sessions
- [ ] Export/Import von echten Daten
- [ ] Pause-Button für Countdown (falls versehentlich)
