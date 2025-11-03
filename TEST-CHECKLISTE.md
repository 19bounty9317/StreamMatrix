# ✅ Test-Checkliste - OBS Integration v1.2.0

## Vorbereitung

### OBS Studio
- [ ] OBS Studio ist installiert und geöffnet
- [ ] Tools → WebSocket Server Settings geöffnet
- [ ] "Enable WebSocket server" ist aktiviert
- [ ] Port notiert (Standard: 4455)
- [ ] Passwort notiert (falls gesetzt)

### StreamMatrix
- [ ] App läuft (`npm run dev`)
- [ ] Mit Twitch eingeloggt
- [ ] Dashboard ist sichtbar

---

## Test 1: UI-Elemente

### Stream-Vorschau Kachel
- [ ] Kachel ist sichtbar im Dashboard
- [ ] Zwei Buttons oben links:
  - [ ] **📺 Twitch** (lila/aktiv)
  - [ ] **🎥 OBS ✗** (grau/inaktiv)
- [ ] Twitch Player wird angezeigt
- [ ] Audio-Controls sind sichtbar (🔇, Lautstärke-Slider)

### Einstellungen
- [ ] ⚙️ Icon unten links klickbar
- [ ] Einstellungen öffnen sich
- [ ] Sektion "🎥 OBS Integration" ist vorhanden
- [ ] Felder sichtbar:
  - [ ] Host (localhost)
  - [ ] Port (4455)
  - [ ] Passwort
- [ ] Button "🔗 Mit OBS verbinden" ist sichtbar

---

## Test 2: OBS-Verbindung

### Verbindung herstellen
- [ ] In Einstellungen: Host = `localhost`
- [ ] Port = `4455` (oder dein Port)
- [ ] Passwort eingeben (falls in OBS gesetzt)
- [ ] Klick auf "🔗 Mit OBS verbinden"
- [ ] Alert erscheint: "✅ Erfolgreich mit OBS verbunden!"
- [ ] Status ändert sich zu "✓ Mit OBS verbunden"
- [ ] Button wird zu "🔌 Verbindung trennen"

### Console-Logs prüfen
Öffne Browser DevTools (F12) und prüfe:
- [ ] `🎥 TileStreamPreview: OBS Connection Check wird initialisiert`
- [ ] `OBS WebSocket verbunden`
- [ ] `✅ OBS Authenticated`
- [ ] `🎥 OBS Connection Status: true`
- [ ] `OBS Connected Event empfangen`

### Stream-Vorschau aktualisiert
- [ ] Schließe Einstellungen
- [ ] **🎥 OBS ✗** Button wird zu **🎥 OBS ✓** (grün)
- [ ] Button ist jetzt klickbar (nicht mehr disabled)

---

## Test 3: OBS-Vorschau

### Umschalten auf OBS
- [ ] Klick auf **🎥 OBS ✓** Button
- [ ] Button wird lila/aktiv
- [ ] **📺 Twitch** Button wird grau/inaktiv
- [ ] Audio-Controls verschwinden
- [ ] Status rechts: "OBS Live"

### OBS-Bild wird angezeigt
- [ ] OBS-Screenshot wird geladen
- [ ] Bild aktualisiert sich (alle 1 Sekunde)
- [ ] Bild zeigt aktuelle OBS-Szene
- [ ] Info unten: "OBS Live-Vorschau ohne Verzögerung (1s Refresh)"

### Zurück zu Twitch
- [ ] Klick auf **📺 Twitch** Button
- [ ] Twitch Player wird wieder angezeigt
- [ ] Audio-Controls erscheinen wieder
- [ ] Status rechts: "Twitch (~15s)"

---

## Test 4: Verbindung trennen

### Disconnect
- [ ] Öffne Einstellungen
- [ ] Klick auf "🔌 Verbindung trennen"
- [ ] Status ändert sich zu "OBS nicht verbunden"
- [ ] Button wird wieder zu "🔗 Mit OBS verbinden"

### Stream-Vorschau reagiert
- [ ] **🎥 OBS ✓** wird zu **🎥 OBS ✗**
- [ ] Button wird grau/disabled
- [ ] Falls OBS-Modus aktiv: Zeigt "OBS nicht verbunden" Meldung

---

## Test 5: Fehlerbehandlung

### OBS nicht geöffnet
- [ ] Schließe OBS Studio
- [ ] Versuche zu verbinden
- [ ] Alert: "❌ Verbindung fehlgeschlagen!"
- [ ] Hilfreiche Fehlermeldung wird angezeigt

### Falscher Port
- [ ] Gib falschen Port ein (z.B. 9999)
- [ ] Versuche zu verbinden
- [ ] Verbindung schlägt fehl
- [ ] Timeout nach 5 Sekunden

### Falsches Passwort
- [ ] Gib falsches Passwort ein
- [ ] Versuche zu verbinden
- [ ] Verbindung schlägt fehl
- [ ] OBS lehnt Authentifizierung ab

---

## Test 6: Auto-Reconnect

### App-Neustart
- [ ] Verbinde mit OBS
- [ ] Schließe StreamMatrix
- [ ] Starte StreamMatrix neu
- [ ] Nach 2 Sekunden: Automatische Verbindung zu OBS
- [ ] **🎥 OBS ✓** Button ist aktiv

### OBS-Neustart
- [ ] Verbinde mit OBS
- [ ] Schließe OBS
- [ ] **🎥 OBS ✓** wird zu **🎥 OBS ✗**
- [ ] Starte OBS neu
- [ ] Nach ~2 Sekunden: Automatische Reconnect
- [ ] **🎥 OBS ✓** ist wieder aktiv

---

## Test 7: Performance

### CPU/RAM
- [ ] OBS-Modus verbraucht wenig CPU
- [ ] Keine Memory-Leaks bei langer Nutzung
- [ ] Screenshots werden gecacht

### Netzwerk
- [ ] Nur lokale WebSocket-Verbindung
- [ ] Keine externen API-Calls
- [ ] Schnelle Reaktionszeit (<100ms)

---

## Bekannte Probleme (können ignoriert werden)

### Console-Warnungen
- ⚠️ Twitch 429 Errors (Rate Limiting) - Normal
- ⚠️ React Router Future Flags - Harmlos
- ⚠️ Twitch Fingerprinting Errors - Harmlos

### Nicht kritisch
- Twitch Player Autoplay-Warnung
- WebGPU Adapter Warnung
- Cache-Fehler bei Electron

---

## Erfolg! ✅

Wenn alle Tests bestanden sind:
- ✅ OBS-Integration funktioniert vollständig
- ✅ Umschalten zwischen Twitch und OBS klappt
- ✅ Live-Vorschau ohne Verzögerung
- ✅ Automatische Verbindung beim Start
- ✅ Fehlerbehandlung funktioniert

**Version 1.2.0 ist produktionsreif!** 🚀

---

## Bei Problemen

1. **Console-Logs prüfen** (F12 → Console → Filter: "OBS")
2. **OBS WebSocket Settings prüfen** (Tools → WebSocket Server Settings)
3. **Firewall prüfen** (Port 4455 erlauben)
4. **OBS Version prüfen** (Mindestens 28.0 für WebSocket 5.x)
5. **App neu starten** (Stoppen und `npm run dev`)

---

**Viel Erfolg beim Testen!** 🎉
