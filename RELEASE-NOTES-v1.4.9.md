# 🚀 StreamMatrix v1.4.9 - Bugfixes & Improvements

**Release-Datum:** 19. November 2025

---

## 🎯 Hauptziel dieses Updates

Behebung kritischer Bugs:
- **Rewards Queue 403 Fehler** - Konnte keine Redemptions laden
- **Stream-Historie UI-Probleme** - "Keine Daten"-Meldung blockierte Ansicht
- **Test-Daten Vermischung** - Falsche Daten in der Historie

---

## 🐛 Behobene Bugs

### 1. Rewards Queue 403 Forbidden Fehler

**Problem:**
```
Failed to load resource: the server responded with a status of 403
Fehler beim Laden von Redemptions für Reward: Request failed with status code 403
```

**Ursache:**
- Fehlender OAuth Scope `channel:manage:redemptions`
- Token hatte keine Berechtigung zum Lesen/Verwalten von Redemptions

**Lösung:**
- ✅ Scope `channel:manage:redemptions` zu `twitch.config.ts` hinzugefügt
- ✅ Bessere Fehleranzeige mit Retry-Button
- ✅ Automatisches Laden aller Custom Rewards
- ✅ Verbesserte Fehlerbehandlung

**Wichtig:** Nach dem Update **neu anmelden** um neue Berechtigung zu erhalten!

---

### 2. Stream-Historie UI-Probleme

**Problem:**
- "Noch keine Stream-Daten vorhanden" Meldung blockierte Kalenderansicht
- Details nahmen zu viel Platz weg
- Keine visuelle Kennzeichnung für nicht-gestreamte Tage

**Lösung:**
- ✅ "Keine Daten"-Meldung komplett entfernt
- ✅ Details in Overlay-Popup verschoben (bessere UX)
- ✅ Rotes X (✕) für vergangene Tage ohne Stream
- ✅ Automatische responsive Umschaltung:
  - Große Kachel (≥400px Höhe) → Kalenderansicht
  - Kleine Kachel (<400px Höhe) → Einzelansicht
- ✅ Kein manueller Toggle-Button mehr nötig

---

### 3. Test-Daten Vermischung

**Problem:**
- Test-Daten wurden mit echten Stream-Daten vermischt
- Unrealistische Werte (z.B. 100+ Follower pro Session)
- Alte Daten ohne `isReal` Flag wurden nicht gefiltert

**Lösung:**
- ✅ Verbesserte Cleanup-Logik:
  - Entfernt Sessions mit > 50 Follower/Subs pro Session
  - Filtert Daten ohne `isReal: true` Flag
  - Entfernt Sessions mit Dauer < 1 Minute
- ✅ Konsistente Filter-Logik zwischen Cleanup und Anzeige
- ✅ Besseres Logging für Debugging

---

## 🔧 Verbesserungen

### Rewards Queue
- Lädt automatisch alle Custom Rewards
- Zeigt hilfreiche Fehlermeldungen
- Retry-Button bei Fehlern
- Bessere Performance

### Stream-Historie
- Responsive Design ohne manuelle Umschaltung
- Overlay-Details (klick außerhalb zum Schließen)
- Visuelles Feedback für nicht-gestreamte Tage
- Bessere Kalenderdarstellung

### Test-Daten Management
- Intelligentere Filterung
- Manueller Cleanup-Button in Einstellungen
- Automatische Verifizierung nach 10 Min live

---

## ⚠️ Breaking Changes

### Neu-Anmeldung erforderlich!

Nach dem Update musst du dich **neu anmelden**:

1. **Abmelden** in StreamMatrix (Sidebar → Abmelden)
2. **Neu anmelden** mit Twitch
3. Twitch fragt nach **neuer Berechtigung**:
   ```
   channel:manage:redemptions
   Manage Channel Points custom rewards and their redemptions
   ```
4. **Akzeptieren** → Rewards Queue funktioniert!

**Warum?**
- Twitch OAuth Tokens sind unveränderlich
- Neue Berechtigungen erfordern neues Token
- Nur einmalig nötig

---

## 📊 Technische Details

### Geänderte Dateien
```
src/config/twitch.config.ts              - Neuer OAuth Scope
src/components/tiles/TileStreamHistory.tsx - UI Verbesserungen
src/components/tiles/TileRewardsQueue.tsx  - Fehlerbehandlung
src/services/TwitchService.ts              - API Verbesserungen
src/services/TestModeManager.ts            - Cleanup-Logik
package.json                               - Version 1.4.9
src/config/version.ts                      - Version 1.4.9
CHANGELOG.md                               - Changelog aktualisiert
```

### Neue OAuth Scopes
```javascript
SCOPES: [
  // ... existing scopes
  'channel:read:redemptions',      // Bereits vorhanden
  'channel:manage:redemptions',    // ✨ NEU - Für Verwalten
]
```

### API Änderungen
```typescript
// Vorher: Fehler bei 403
getChannelPointRedemptions(broadcasterId, status)

// Nachher: Lädt alle Rewards automatisch
async getChannelPointRedemptions(broadcasterId, status) {
  const rewards = await this.getCustomRewards(broadcasterId);
  // Für jeden Reward: Lade Redemptions
  // Sammle und sortiere alle Redemptions
}
```

---

## 🧪 Getestet

- ✅ Windows 10/11 Installation
- ✅ Auto-Update von v1.4.8 → v1.4.9
- ✅ Neu-Anmeldung mit neuer Berechtigung
- ✅ Rewards Queue lädt Redemptions
- ✅ Stream-Historie responsive Design
- ✅ Test-Daten Cleanup
- ✅ Kalender zeigt rotes X

---

## 📦 Download

**Installer:** `StreamMatrix-Setup-1.4.9.exe` (~90 MB)

**Checksums:**
- SHA512: (siehe `StreamMatrix-Setup-1.4.9.exe.blockmap`)

**Auto-Update:**
- Funktioniert automatisch von v1.4.8
- Benötigt Neu-Anmeldung nach Update

---

## 🔗 Links

- **GitHub Release:** https://github.com/19bounty9317/StreamMatrix/releases/tag/v1.4.9
- **Website:** https://streammatrix.de
- **Dokumentation:** [TEST-MODE-SYSTEM.md](TEST-MODE-SYSTEM.md)
- **Support:** StreamMatrix@web.de

---

## 🙏 Credits

**Entwickelt von:** Michael Mader  
**Feedback von:** Community & Beta-Testern  
**Getestet von:** Live-Streamern

Vielen Dank an alle die Bugs gemeldet haben!

---

## 📝 Nächste Schritte

Nach der Installation:

1. ✅ **Neu anmelden** (wichtig!)
2. ✅ **Test-Daten bereinigen** (Einstellungen → "🧹 Test-Daten jetzt bereinigen")
3. ✅ **Rewards Queue testen** (sollte jetzt funktionieren)
4. ✅ **Stream-Historie prüfen** (sollte nur echte Daten zeigen)

---

**Viel Spaß mit StreamMatrix v1.4.9! 🎉**

Bei Problemen: StreamMatrix@web.de
