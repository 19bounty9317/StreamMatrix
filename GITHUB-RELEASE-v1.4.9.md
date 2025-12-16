# 🚀 StreamMatrix v1.4.9 - Bugfixes & Improvements

**Release-Datum:** 19. November 2025

## 🐛 Bugfixes

### Rewards Queue 403 Fehler behoben
- ✅ Fehlender OAuth Scope `channel:manage:redemptions` hinzugefügt
- ✅ Channel Points Redemptions können jetzt gelesen und verwaltet werden
- ✅ Bessere Fehleranzeige bei API-Problemen mit Retry-Button
- ✅ Automatisches Laden aller Custom Rewards

### Stream-Historie Verbesserungen
- ✅ "Keine Daten"-Meldung entfernt (blockierte Kalenderansicht)
- ✅ Details in Overlay-Fenster verschoben (bessere UX)
- ✅ Rotes X (✕) für nicht-gestreamte Tage im Kalender
- ✅ Automatische responsive Umschaltung zwischen Kalender- und Einzelansicht
- ✅ Bessere Filterung von Test-Daten

### Test-Daten Cleanup verbessert
- ✅ Filtert jetzt auch alte Daten ohne `isReal` Flag
- ✅ Entfernt Sessions mit > 50 Follower/Subs pro Session (unrealistisch)
- ✅ Besseres Logging für Debugging
- ✅ Konsistente Filter-Logik zwischen Cleanup und Anzeige

---

## ⚠️ Wichtig: Nach dem Update neu anmelden!

Um die Rewards Queue nutzen zu können, musst du dich **neu anmelden**:

1. **Abmelden** in StreamMatrix (Sidebar → Abmelden)
2. **Neu anmelden** mit Twitch
3. Twitch fragt nach **neuer Berechtigung**: `channel:manage:redemptions`
4. **Akzeptieren** → Rewards Queue funktioniert jetzt!

---

## 🔧 Weitere Verbesserungen

- Rewards Queue lädt alle Custom Rewards automatisch
- Bessere Fehlerbehandlung bei Twitch API Calls
- Verbesserte Fehleranzeige mit hilfreichen Hinweisen
- Optimierte Performance beim Laden von Redemptions

---

## 📦 Installation

### Windows
1. Download: `StreamMatrix-Setup-1.4.9.exe`
2. Ausführen und Installationsanweisungen folgen
3. Bei Sicherheitswarnung: "Weitere Informationen" → "Trotzdem ausführen"

### Nach der Installation
1. **Abmelden** und **neu anmelden** (wichtig für neue Berechtigungen!)
2. Optional: Test-Daten bereinigen (Einstellungen → "🧹 Test-Daten jetzt bereinigen")

---

## 🔗 Links

- **Website:** https://streammatrix.de
- **Streamer-Verzeichnis:** https://streammatrix.de/streamer
- **GitHub:** https://github.com/19bounty9317/StreamMatrix
- **Spenden:** https://www.paypal.com/donate?campaign_id=F69NRSXHU8W7N

---

## 📝 Vollständiges Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für alle Details.

---

## 🙏 Danke

Vielen Dank an alle Nutzer für das Feedback und die Bug-Reports!

**Viel Spaß mit StreamMatrix v1.4.9! 🎉**

Bei Fragen oder Problemen: StreamMatrix@web.de
