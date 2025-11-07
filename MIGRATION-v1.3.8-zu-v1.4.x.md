# Migration von v1.3.8 zu v1.4.x

## Problem

Beim Update von v1.3.8 auf v1.4.0+ wurden manchmal nur 2 Kacheln angezeigt, obwohl in v1.3.8 mehr aktiviert waren.

## Ursache

- v1.3.8 hatte möglicherweise ein anderes localStorage-Format
- Oder `tiles-order` existierte nicht in v1.3.8
- Die Migration hat nicht alle aktivierten Kacheln übernommen

## Lösung in v1.4.2+

### Automatische Sicherheitsprüfungen:

1. **Format-Validierung**
   - Prüft ob `tiles-order` ein gültiges Array ist
   - Prüft ob alle Tiles das richtige Format haben (id, enabled, name)

2. **Mindest-Kachel-Check**
   - Wenn weniger als 3 Kacheln aktiviert sind
   - Werden automatisch die wichtigsten Kacheln aktiviert:
     - Chat
     - Aktivitätsfeed
     - Stream-Info
     - Follower
     - Alerts

3. **Detailliertes Logging**
   - Console zeigt genau was migriert wurde
   - Anzahl gespeicherter, gültiger und aktivierter Kacheln

### Console-Output Beispiel:

```
🔄 Kachel-Migration durchgeführt:
  📊 Gespeicherte Kacheln: 13
  ✅ Gültige Kacheln: 13
  🆕 Neue Kacheln: Raid-Ziele, Stream-Vorschau
  🎯 Aktivierte Kacheln: 9
```

## Manuelle Lösung (falls nötig)

### Option 1: localStorage zurücksetzen

1. Öffne Developer Console (F12)
2. Führe aus:
```javascript
localStorage.removeItem('tiles-order');
location.reload();
```

3. Alle Kacheln werden mit Defaults neu erstellt

### Option 2: Kacheln manuell aktivieren

1. Öffne die Sidebar (links)
2. Scrolle zur Kachel-Liste
3. Klicke auf die Kacheln, die du aktivieren möchtest
4. Sie werden sofort im Dashboard angezeigt

### Option 3: Debug-Tool verwenden

1. Öffne `debug-tiles.html` im Browser
2. Klicke "Tiles anzeigen" um zu sehen, welche Kacheln gespeichert sind
3. Klicke "Alle Tiles zurücksetzen" um neu zu starten

## Prävention

Ab v1.4.2 wird die Migration automatisch:
- ✅ Ungültige Formate erkennen
- ✅ Zu wenige aktivierte Kacheln erkennen
- ✅ Automatisch wichtige Kacheln aktivieren
- ✅ Detailliertes Logging für Debugging

## Für Entwickler

### Migrations-Logik in App.tsx:

```typescript
// 1. Format-Validierung
if (!Array.isArray(savedTiles) || savedTiles.length === 0) {
  return defaultTiles;
}

// 2. Struktur-Validierung
const hasValidFormat = savedTiles.every(t => 
  t && typeof t === 'object' && 'id' in t && 'enabled' in t
);

// 3. Mindest-Kachel-Check
const enabledCount = mergedTiles.filter(t => t.enabled).length;
if (enabledCount < 3) {
  // Aktiviere wichtige Kacheln
  mergedTiles.forEach(t => {
    if (['chat', 'activity', 'stream-info', 'followers', 'alerts'].includes(t.id)) {
      t.enabled = true;
    }
  });
}
```

## Testen

### Test-Szenario 1: Leeres localStorage
```javascript
localStorage.removeItem('tiles-order');
location.reload();
// Erwartung: Alle Default-Kacheln werden geladen
```

### Test-Szenario 2: Nur 2 Kacheln aktiviert
```javascript
const tiles = [
  { id: 'chat', name: 'Chat', enabled: true },
  { id: 'activity', name: 'Aktivitätsfeed', enabled: true },
  { id: 'stream-info', name: 'Stream-Info', enabled: false },
  // ... alle anderen disabled
];
localStorage.setItem('tiles-order', JSON.stringify(tiles));
location.reload();
// Erwartung: Mindestens 5 wichtige Kacheln werden aktiviert
```

### Test-Szenario 3: Ungültiges Format
```javascript
localStorage.setItem('tiles-order', 'invalid json');
location.reload();
// Erwartung: Fehler wird abgefangen, Defaults werden geladen
```

## Zusammenfassung

**Ab v1.4.2:**
- ✅ Automatische Format-Validierung
- ✅ Automatische Mindest-Kachel-Aktivierung
- ✅ Besseres Logging
- ✅ Fehlerbehandlung

**Keine manuellen Eingriffe mehr nötig!** 🎉
