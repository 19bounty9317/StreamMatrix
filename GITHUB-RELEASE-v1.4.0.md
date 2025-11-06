# 🚀 StreamMatrix v1.4.0

## Was ist neu?

### 🚂 Hype Train Kachel (NEU!)
Die brandneue Hype Train Kachel zeigt deinen aktiven Hype Train in Echtzeit:
- 📊 **Live-Anzeige** mit Level, Progress und Countdown
- 🎯 **Fortschrittsbalken** zum nächsten Level mit Prozentanzeige
- ⏱️ **Verbleibende Zeit** wird live aktualisiert (Minuten:Sekunden)
- 🎬 **Visuelle Effekte** beim Start (Zug fährt von rechts nach links, 5 Sekunden)
- 🎬 **Visuelle Effekte** beim Ende (Zug fährt gespiegelt von links nach rechts, 5 Sekunden)
- �  **Details im Activity Feed** nach Hype Train Ende (Level, Subs, Bits beigetragen)
- 🔄 **Automatische Aktualisierung** alle 10 Sekunden
- 🎨 **Animiertes Zug-Emoji** mit orangenem Glow-Effekt
- 📢 **Benachrichtigung** mit Animation bei Start und Ende
- ⚫ **Inaktiv-Anzeige** wenn kein Hype Train läuft

### � Komplaett überarbeitete Raid-Alerts
Raids bekommen jetzt die Aufmerksamkeit, die sie verdienen:
- 🎯 **Dedizierte Kachel** "Alerts & Benachrichtigungen" zeigt NUR noch Raids
- 📢 **Shoutout-Button** sendet automatisch `/shoutout` Befehl an Twitch
- � * *Zuschauerzahl** wird prominent in Rot angezeigt
- 🎨 **Rote Border** für bessere Sichtbarkeit
- ⚡ **Schnelle Reaktion** - Ein Klick für Shoutout
- � **Grörßere Darstellung** mit mehr Platz pro Raid
- ⏰ **Timestamp** wann der Raid kam
- 🔔 **Sound & Desktop-Benachrichtigung** (wenn aktiviert)

### � Aictivity Feed Komplett-Überarbeitung
Der Activity Feed wurde von Grund auf neu gestaltet:
- � **Hypev Train Ende** wird mit Details angezeigt:
  - Level erreicht
  - ⭐ Anzahl Subs beigetragen
  - � Aknzahl Bits beigetragen
- 📅 **Korrekte Sortierung** - neueste Events IMMER oben (war vorher buggy)
- 🎯 **Alle Events** außer Raids:
  - 👤 Follower
  - ⭐ Subs (normal & Gift Subs)
  - 💎 Bits/Cheers
  - 💵 Donations
  - 🚂 Hype Train Ende
- 🎨 **Bessere Übersichtlichkeit** durch optimierte Darstellung
- 🏷️ **Gift Sub Recipients** werden angezeigt (bei 5+ Subs zusammengefasst)
- ⏰ **Relative Zeitanzeige** (vor 2m, vor 1h, etc.)
- 🗑️ **Löschen-Button** zum Zurücksetzen des Feeds

### 👥 Live Viewer Kachel Erweiterung
Mehr Kontrolle über deine Viewer-Liste:
- 🟢 **Aktiv/Alle Schalter** - zeige nur aktive Viewer (letzte 5 Min) oder alle
- 💾 **Einstellung wird gespeichert** und beim nächsten Start wiederhergestellt
- 📊 **Zähler** zeigt aktuelle Anzahl aktiver/aller Viewer
- 🔄 **Schnellere Aktualisierung** alle 30 Sekunden (vorher 60s)
- 🎨 **Kompaktere Darstellung** des Schalters neben der Suchleiste
- 📝 **Info-Text** zeigt aktuelle Filterung an

### 🎯 Raid-Ziele Kachel Optimierung
Bessere Live-Updates für Raid-Entscheidungen:
- 🔄 **Schnellere Aktualisierung** alle 30 Sekunden (vorher 60s)
- 📊 **Aktuellere Daten** über Live/Offline Status
- 🎮 **Aktuelle Zuschauerzahlen** werden häufiger aktualisiert
- 🎨 **Bessere Performance** durch optimierte API-Calls

## 🎨 UI/UX Verbesserungen

### 📚 Komplett überarbeitetes Tutorial
Das Tutorial wurde von Grund auf neu geschrieben:
- 📖 **8 neue Schritte** mit allen aktuellen Features:
  1. Willkommen & Einführung
  2. Kacheln verwalten (Ein-/Ausblenden & Sortieren)
  3. Layout anpassen (Größe & Schriftgröße)
  4. Schalter & Filter (Live Viewer, Raid-Ziele, Test-Modus)
  5. Raid-Alerts mit Shoutout-Button
  6. Hype Train Kachel
  7. Einstellungen (Themes, OBS, Test-Modus)
  8. Fertig & Hinweis auf Tutorial-Button
- 🎬 **Nur beim ersten Start** automatisch angezeigt
- 🔄 **Jederzeit aufrufbar** über "❓ Tutorial" Button in der Sidebar
- 📝 **Detaillierte Erklärungen** für alle neuen Features
- 🎯 **Fokus auf praktische Nutzung** statt nur Theorie

### � Elegtante Update-Benachrichtigungen
Komplett neu gestaltete Update-Hinweise:
- � **Kormpakte Anzeige** im Footer (rechts unten) statt störendem Banner
- � **Cayan/Türkis Design** mit Glow-Effekt für bessere Sichtbarkeit
- ⏸️ **"Später" Button** - Update wird nicht mehr angezeigt bis zur nächsten Version
- 💾 **Speichert abgelehnte Version** in localStorage
- ❌ **Kein störendes Banner** mehr oben im Dashboard
- 🎯 **Pulsierender Text** für Aufmerksamkeit
- 🖱️ **Hover-Effekt** auf Button für besseres Feedback

### 🎉 Event Celebration Erweiterungen
Neue visuelle Effekte für Events:
- 🚂 **Hype Train Start** - 3 Züge fahren von rechts nach links (5 Sekunden)
- 🚂 **Hype Train Ende** - 3 Züge fahren gespiegelt von links nach rechts (5 Sekunden)
- 🎨 **Orangener Glow-Effekt** um die Züge
- 📢 **Benachrichtigungen** mit Hype Train Level
- 🎯 **Keine Emoji-Regen** für Hype Train (nur Zug-Animation)
- ⚙️ **Test-Buttons** in Settings für Hype Train Start & Ende

### 🔧 Sonstige Verbesserungen
- 📦 **Zentrale Versionsverwaltung** in `src/config/version.ts`
- 📊 **Version** wird in Footer (v1.4.0) und Einstellungen angezeigt
- 🎨 **Konsistenteres Design** über alle Komponenten
- 🔄 **Bessere Performance** durch optimierte Updates
- 📝 **Klarere Beschriftungen** in allen Kacheln
- 🎯 **Verbesserte Lesbarkeit** durch optimierte Schriftgrößen

## 🐛 Bugfixes

- ✅ **Activity Feed Sortierung** korrigiert - neueste Events stehen jetzt IMMER oben
- ✅ **Hype Train Events** werden nicht mehr in Alerts angezeigt (nur im Activity Feed)
- ✅ **Zuschauerzahl bei Raids** wird korrekt angezeigt und gespeichert
- ✅ **Tutorial Auto-Start** - wird nur noch beim ersten Start angezeigt
- ✅ **Update-Banner** verschwindet nicht mehr nach Reload
- ✅ **Live Viewer Filter** wird korrekt gespeichert und wiederhergestellt
- ✅ **Event Celebration** - Hype Train triggert keine doppelten Events mehr

## 📥 Download

**Windows (x64):**
- [StreamMatrix-Setup-1.4.0.exe](https://github.com/19bounty9317/StreamMatrix/releases/download/v1.4.0/StreamMatrix-Setup-1.4.0.exe) (~75 MB)

## 🔄 Update

Wenn du bereits StreamMatrix installiert hast, wirst du automatisch über das Update benachrichtigt. Die neue Version wird beim nächsten Start installiert.

**Hinweis:** Mit dem neuen "Später" Button kannst du Updates jetzt ablehnen - sie werden erst bei der nächsten Version wieder angezeigt.

## 🔧 Technische Details

- **Electron:** 28.3.3
- **React:** 18
- **Vite:** 5.4.20
- **TypeScript:** Latest
- **Neue Dateien:** 1 (`src/config/version.ts`)
- **Geänderte Dateien:** 14
- **Zeilen hinzugefügt:** 395
- **Zeilen entfernt:** 74

## 📋 Vollständige Änderungen

### Neue Features
- 🚂 Hype Train Kachel mit Live-Anzeige (Level, Progress, Countdown)
- 🎬 Hype Train Animationen (Start: rechts→links, Ende: links→rechts, je 5 Sekunden)
- 📝 Hype Train Details im Activity Feed (Level, Subs, Bits)
- 🚀 Raid-only Alerts & Benachrichtigungen Kachel
- 📢 Shoutout-Button für Raids (sendet `/shoutout` Befehl)
- 🟢 Aktiv/Alle Schalter in Live Viewer (letzte 5 Min Filter)
- 📦 Zentrale Versionsverwaltung (`src/config/version.ts`)
- 💎 Update-Benachrichtigungen im Footer (Cyan Design)
- ⏸️ "Später" Button für Updates (speichert Ablehnung)
- 🎯 Test-Buttons für Hype Train in Settings

### Verbesserungen
- 📚 Tutorial komplett überarbeitet (8 detaillierte Schritte)
- 📊 Activity Feed Sortierung (neueste immer oben)
- 🔄 Raid-Ziele Aktualisierungsintervall (30s statt 60s)
- 🔄 Live Viewer Aktualisierungsintervall (30s statt 60s)
- 🎨 UI-Konsistenz über alle Komponenten
- 📝 Klarere Beschriftungen und Info-Texte
- 🎯 Bessere Lesbarkeit durch optimierte Schriftgrößen
- 🔔 Verbesserte Event-Benachrichtigungen
- 💾 Mehr Einstellungen werden gespeichert

### Bugfixes
- ✅ Activity Feed Sortierung (neueste oben)
- ✅ Hype Train Events nicht mehr in Alerts
- ✅ Zuschauerzahl bei Raids korrekt angezeigt
- ✅ Tutorial Auto-Start nur beim ersten Mal
- ✅ Update-Banner Persistenz
- ✅ Live Viewer Filter Speicherung
- ✅ Event Celebration Duplikate

## 🐛 Bug Reports

Probleme gefunden? Erstelle ein [Issue auf GitHub](https://github.com/19bounty9317/StreamMatrix/issues).

## 📧 Kontakt

- **Email:** StreamMatrix@web.de
- **GitHub:** [19bounty9317/StreamMatrix](https://github.com/19bounty9317/StreamMatrix)

---

**Viel Spaß beim Streamen! 🎮✨**

*Changelog: [v1.3.8...v1.4.0](https://github.com/19bounty9317/StreamMatrix/compare/v1.3.8...v1.4.0)*
