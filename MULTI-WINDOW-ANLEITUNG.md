# Multi-Window Feature - Anleitung

## Übersicht

StreamMatrix unterstützt jetzt mehrere Fenster für Kacheln. Du kannst zusätzliche Fenster öffnen und Kacheln zwischen dem Hauptfenster und den zusätzlichen Fenstern verschieben.

## Neues Fenster öffnen

Es gibt zwei Möglichkeiten, ein neues Kachel-Fenster zu öffnen:

1. **Über die Menüleiste**: `Window` → `Neues Kachel-Fenster`
2. **Tastenkombination**: `Strg+N` (Windows/Linux) oder `Cmd+N` (Mac)

## Kacheln zwischen Fenstern verschieben

Es gibt vier Möglichkeiten, Kacheln zwischen Fenstern zu verschieben:

### 1. Drag & Drop (NEU! ⭐)
- Klicke und halte den Kachel-Header (Titelleiste)
- Ziehe die Kachel zum Zielfenster
- Ein visueller Indikator zeigt die Drop-Zone
- Lasse los um die Kachel zu verschieben
- **Funktioniert zwischen allen offenen Fenstern!**

### 2. Rechtsklick-Menü
- Rechtsklick auf den Kachel-Header (Titelleiste)
- Wähle "Verschieben nach:" und das Zielfenster
- Die Kachel wird sofort verschoben

### 3. Button im Header
- Klicke auf den 📺-Button im Kachel-Header
- Wähle das Zielfenster aus dem Menü
- Nur sichtbar wenn mehrere Fenster offen sind

### 4. Schließen und neu öffnen
- Schließe die Kachel mit dem X-Button
- Sie kehrt automatisch zum Hauptfenster zurück
- Öffne sie dort erneut und verschiebe sie

## Verwendungszwecke

### Dual-Monitor-Setup
- Hauptfenster auf Monitor 1: Dashboard mit wichtigen Kacheln
- Zusätzliches Fenster auf Monitor 2: Chat und Viewer-Liste

### OBS-Integration
- Zusätzliches Fenster für spezifische Kacheln
- Window Capture in OBS für einzelne Kacheln

### Flexible Layouts
- Erstelle mehrere Fenster für verschiedene Streaming-Szenarien
- Jedes Fenster kann individuell positioniert und dimensioniert werden

## Technische Details

- Fenster werden automatisch geschlossen, wenn das Hauptfenster geschlossen wird
- Kachel-Konfigurationen werden im LocalStorage gespeichert
- Jedes Fenster hat eine eindeutige ID
- Theme-Einstellungen werden automatisch synchronisiert

## Bekannte Einschränkungen

- Fenster-Positionen werden nicht gespeichert (geplant für v1.5.0)
- Maximale Anzahl zusätzlicher Fenster: Unbegrenzt (aber empfohlen: 2-3 für beste Performance)

## Fehlerbehebung

### Fenster öffnet sich nicht
- Stelle sicher, dass Popup-Blocker deaktiviert sind
- Prüfe ob genug Arbeitsspeicher verfügbar ist

### Kacheln werden nicht angezeigt
- Schließe das zusätzliche Fenster und öffne es erneut
- Prüfe die Browser-Konsole auf Fehler

### Performance-Probleme
- Reduziere die Anzahl der offenen Fenster
- Deaktiviere nicht benötigte Kacheln
