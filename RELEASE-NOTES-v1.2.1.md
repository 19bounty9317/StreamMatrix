# 🚀 StreamMatrix v1.2.1 - Bugfix Release

**Release-Datum:** 31. Oktober 2025  
**Build-Zeit:** 18:31 Uhr

---

## 🐛 Bugfixes

### Live Viewer Liste
**Problem:** Liste blieb leer trotz aktiver Zuschauer  
**Lösung:**
- ✅ Integration mit Twitch Chatters API
- ✅ Lädt tatsächliche Chatters alle 60 Sekunden
- ✅ Trackt Viewer aus Chat-Nachrichten
- ✅ Entfernt inaktive Viewer nach 5 Minuten
- ✅ Zeigt Badges (Mod, VIP, Sub)

### Hype Train
**Problem:** Zeigte alte Hype Trains (Level 2) obwohl keiner aktiv  
**Lösung:**
- ✅ Prüft ob `event_type === 'hypetrain.progression'`
- ✅ Prüft ob `expires_at` in der Zukunft liegt
- ✅ Zeigt nur aktive Hype Trains
- ✅ Live-Countdown in MM:SS Format
- ✅ Aktualisiert sich jede Sekunde

### Aktivitätsfeed
**Problem:** Keine Live-Events für Subs, Bits, Raids  
**Lösung:**
- ✅ Live Follower-Tracking (alle 30 Sekunden)
- ✅ Live Bits/Cheers aus Chat-WebSocket
- ✅ Live Subs/Resubs aus Chat
- ✅ Live Gift Subs aus Chat
- ✅ Live Raids aus Chat
- ✅ Verhindert Duplikate
- ✅ Speichert in LocalStorage (max 50)

---

## 🔧 Verbesserungen

### Einnahmen-Übersicht
**Änderung:** Rechnet jetzt mit $1.99 pro Sub (statt $2.50)
- Realistischere Berechnung nach Gebühren/Steuern
- Aktualisiert in allen Bereichen:
  - Einnahmen-Kachel
  - Sub-Anzeige
  - Tooltip-Texte

---

## 📦 Build-Informationen

### Datei-Details
```
Dateiname:  StreamMatrix Setup 1.2.1.exe
Größe:      74,04 MB
Erstellt:   31.10.2025 18:31:08
```

### Hash-Verifizierung
```
Algorithmus: SHA-256
Hash:        E1822CA102306F674281B4DBACD5EBC545E058D4B3BB8E963C0BB743DB505BFC
```

### Bundle-Größe
```
index.html:                    0.41 kB (gzip: 0.28 kB)
index-CPApfMQn.css:           21.81 kB (gzip: 4.93 kB)
RefreshService-C_VdpOE0.js:    1.24 kB (gzip: 0.56 kB)
OBSService-DoP6zr0J.js:        4.52 kB (gzip: 1.77 kB)
index-CHBQ81G9.js:           358.53 kB (gzip: 107.74 kB)
```

---

## 🎯 Was funktioniert jetzt

### Live Viewer Liste
- ✅ Zeigt alle aktiven Chatters
- ✅ Aktualisiert sich automatisch
- ✅ Filter: Alle, Mods, VIPs, Subs
- ✅ Suchfunktion
- ✅ Badges werden angezeigt

### Hype Train
- ✅ Zeigt nur aktive Hype Trains
- ✅ Live-Countdown
- ✅ Fortschrittsbalken
- ✅ Level-Anzeige
- ✅ "Kein Hype Train" wenn inaktiv

### Aktivitätsfeed
- ✅ Live Follower (alle 30s)
- ✅ Live Bits/Cheers (Echtzeit)
- ✅ Live Subs (Echtzeit)
- ✅ Live Gift Subs (Echtzeit)
- ✅ Live Raids (Echtzeit)
- ✅ Zeitstempel ("vor 5m")
- ✅ Farbcodierte Icons
- ✅ Persistente Speicherung

### Einnahmen
- ✅ Realistische Sub-Berechnung ($1.99)
- ✅ Bits-Berechnung ($1 pro 100 Bits)
- ✅ Gesamt-Einnahmen
- ✅ Aufschlüsselung nach Typ

---

## 📋 Upgrade von v1.2.0

### Automatisches Update
Wenn du v1.2.0 installiert hast:
1. Einfach v1.2.1 Installer ausführen
2. Überschreibt alte Version
3. Alle Einstellungen bleiben erhalten
4. Twitch-Login bleibt erhalten

### Manuelle Installation
1. Alte Version deinstallieren (optional)
2. v1.2.1 Installer ausführen
3. Fertig!

---

## 🔍 Vergleich zu v1.2.0

### Was ist neu
```
v1.2.0: OBS-Integration, Dual-Mode Preview
v1.2.1: + Bugfixes für Viewer, Hype Train, Activity  ← NEU!
```

### Dateigröße
```
v1.2.0: 74,04 MB
v1.2.1: 74,04 MB (gleich)
```

### Bundle-Größe
```
v1.2.0: 355.11 kB (gzip: 106.65 kB)
v1.2.1: 358.53 kB (gzip: 107.74 kB)  (+3.42 kB wegen neuer Features)
```

---

## 🎉 Alle Features (v1.2.1)

### Kern-Features
- ✅ Twitch OAuth 2.0 Login
- ✅ Dashboard mit Live-Statistiken
- ✅ Live-Chat mit Moderations-Tools
- ✅ Quick Actions (Stream-Kontrolle)
- ✅ Channel Points Verwaltung
- ✅ Stream-Einstellungen Editor

### OBS-Integration (v1.2.0)
- ✅ OBS WebSocket 5.x Integration
- ✅ Dual-Mode Stream-Vorschau
- ✅ Live-Screenshots (1s Refresh)
- ✅ Automatische Verbindung
- ✅ SHA-256 Authentifizierung

### Bugfixes (v1.2.1)
- ✅ Live Viewer Liste funktioniert
- ✅ Hype Train zeigt nur aktive
- ✅ Aktivitätsfeed vollständig live
- ✅ Realistische Einnahmen-Berechnung

---

## 📚 Dokumentation

### Aktualisiert
- ✅ `CHANGELOG.md` - Version 1.2.1 hinzugefügt
- ✅ `RELEASE-NOTES-v1.2.1.md` - Diese Datei
- ✅ `package.json` - Version auf 1.2.1
- ✅ Settings UI - Version auf 1.2.1

### Bestehend
- ✅ `OBS-INTEGRATION.md` - OBS-Setup
- ✅ `TEST-CHECKLISTE.md` - Test-Anleitung
- ✅ `NUTZER-ANLEITUNG.md` - Benutzerhandbuch
- ✅ `INSTALLATION-v1.2.0.md` - Installation

---

## 🐛 Bekannte Probleme

### Nicht kritisch
- ⚠️ Windows Defender Warnung (normal, App nicht signiert)
- ⚠️ Twitch 429 Errors in Console (Rate Limiting, harmlos)
- ⚠️ React Router Future Flags (Warnungen, nicht kritisch)

### Workarounds
- Windows Defender: "Weitere Informationen" → "Trotzdem ausführen"
- Console-Warnungen: Können ignoriert werden

---

## 🔮 Roadmap

### v1.3.0 (geplant)
- 🎬 OBS Szenen-Kontrolle
- 📹 Recording Start/Stop
- 🎛️ Audio-Mixer Integration
- 📊 Erweiterte Stream-Analytics

### v1.4.0 (geplant)
- 🤖 Chatbot-Integration
- 🎁 Giveaway-System
- 📢 Alerts & Notifications
- 🎵 Spotify Integration

---

## 📞 Support

### Bei Problemen
1. Prüfe `TEST-CHECKLISTE.md`
2. Lies `CHANGELOG.md`
3. Schau in Console-Logs (F12)
4. Prüfe Twitch API Status

### Häufige Fragen

**Q: Muss ich v1.2.0 deinstallieren?**  
A: Nein, v1.2.1 überschreibt automatisch.

**Q: Gehen meine Einstellungen verloren?**  
A: Nein, alle Einstellungen bleiben erhalten.

**Q: Funktioniert OBS-Integration noch?**  
A: Ja, alle v1.2.0 Features bleiben erhalten.

**Q: Was ist der Unterschied zu v1.2.0?**  
A: Nur Bugfixes, keine neuen Features.

---

## ✅ Test-Checkliste

### Basis-Tests
- [ ] App startet ohne Fehler
- [ ] Twitch-Login funktioniert
- [ ] Dashboard wird angezeigt

### Bugfix-Tests
- [ ] Live Viewer Liste zeigt Chatters
- [ ] Hype Train zeigt "Kein Hype Train" wenn inaktiv
- [ ] Aktivitätsfeed zeigt Live-Events
- [ ] Einnahmen rechnen mit $1.99 pro Sub

### OBS-Tests (von v1.2.0)
- [ ] OBS-Verbindung funktioniert
- [ ] Stream-Vorschau umschaltbar
- [ ] OBS-Screenshots werden geladen

---

## 🎉 Viel Spaß mit v1.2.1!

**Wichtigste Verbesserungen:**
- ✅ Live Viewer Liste funktioniert endlich
- ✅ Hype Train zeigt nur aktive Trains
- ✅ Aktivitätsfeed ist vollständig live
- ✅ Realistische Einnahmen-Berechnung

**Upgrade empfohlen für alle v1.2.0 Nutzer!** 🚀

---

**Version:** 1.2.1  
**Build-Datum:** 31. Oktober 2025  
**Lizenz:** MIT
