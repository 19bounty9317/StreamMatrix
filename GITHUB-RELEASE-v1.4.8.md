# 🎉 StreamMatrix v1.4.8 - Streamer Directory & Donations

## 🆕 Neue Features

### 🎮 Streamer-Verzeichnis
- **Entdecke die Community!** Alle StreamMatrix-Nutzer können sich jetzt im Streamer-Verzeichnis anzeigen lassen
- **Live-Streams:** Sieh wer gerade live ist mit Twitch-Video-Preview
- **Offline-Kanäle:** "Letzter Stream vor X Stunden" Anzeige
- **Opt-In System:** Aktiviere in den Einstellungen → "Im Streamer-Verzeichnis anzeigen"
- **Besuche:** https://streammatrix.de/streamer
- **DSGVO-konform:** Nur öffentliche Twitch-Daten, jederzeit widerrufbar

### 💜 Spendenkampagne
- **Unterstütze StreamMatrix!** Hilf uns, ein Code-Signierungszertifikat zu finanzieren (400€/Jahr)
- **PayPal-Integration:** Direkte Spendenmöglichkeit auf der Website
- **Spenden-Sektion in Einstellungen:** Erklärung + Spenden-Button
- **Transparenz:** 100% der Spenden gehen in das Zertifikat
- **Ziel:** Keine Windows-Sicherheitswarnung mehr beim Download!

### 🎁 Rewards Queue (Channel Points)
- **Neue Kachel:** Verwalte Channel Points Redemptions direkt im Dashboard
- **3 Action-Buttons:**
  - ✅ Bestätigen - Reward erfüllt
  - ❌ Ablehnen - Reward abgelehnt
  - 💰 Erstatten - Punkte zurückgeben (funktioniert!)
- **Chat-Integration:** Redemptions werden im Chat angezeigt
- **Auto-Refresh:** Alle 10 Sekunden neue Redemptions

## 🔧 Verbesserungen

### Update-System
- **Besseres Update-Verhalten:** "Später installieren" lässt das blaue Info-Banner sichtbar
- **Keine nervigen Popups mehr:** Nach "Später" klicken erscheinen keine weiteren Dialoge
- **Permanente Erinnerung:** Blaues Banner bleibt als unaufdringliche Info

### Website
- **Google Analytics:** Tracking für bessere Insights (DSGVO-konform mit IP-Anonymisierung)
- **Spenden-Sektion:** Prominente Platzierung mit PayPal Campaign Card
- **Streamer-Verzeichnis:** Neue Seite mit Live/Offline-Ansicht
- **SEO-Optimierung:** Bessere Meta-Tags und Beschreibungen

### Backend (Firebase)
- **Cloud Functions:** Automatische Updates alle 5 Minuten für Streamer-Status
- **Twitch API Integration:** Holt Live-Status, Viewer-Zahlen, Stream-Titel
- **Auto-Cleanup:** Inaktive Streamer werden nach 30 Tagen entfernt
- **Firestore Rules:** Sichere Datenbankzugriffe

## 🐛 Bugfixes

- **Update-Benachrichtigungen:** Keine doppelten Popups mehr
- **Firestore Rules:** Streamer Collection jetzt korrekt konfiguriert
- **Chat-Service:** Channel Points Events werden korrekt weitergeleitet

## 📊 Technische Details

### Neue Dateien:
- `src/services/StreamerDirectoryService.ts` - Opt-In/Out & Heartbeat
- `src/components/tiles/TileRewardsQueue.tsx` - Rewards Management
- `docs/streamer/index.html` - Streamer-Verzeichnis-Seite
- `functions/index.js` - Cloud Functions für Twitch API

### Aktualisierte Dateien:
- `src/components/Settings.tsx` - Spenden + Streamer-Verzeichnis Sektionen
- `src/components/Footer.tsx` - Verbessertes Update-Banner
- `src/App.tsx` - StreamerDirectoryService Initialisierung
- `docs/index.html` - Google Analytics + Spenden-Sektion
- `firestore.rules` - Streamer Collection Rules

### Dependencies:
- Firebase SDK 10.7.1
- Axios (für Cloud Functions)
- Keine Breaking Changes

## 🚀 Installation

### Neu-Installation:
1. Download `StreamMatrix-Setup-1.4.8.exe`
2. Ausführen (Windows SmartScreen: "Weitere Informationen" → "Trotzdem ausführen")
3. Fertig!

### Update von v1.4.7:
- **Automatisch:** App zeigt Update-Benachrichtigung
- **Manuell:** Download und Installation überschreibt alte Version

## ⚠️ Wichtige Hinweise

### Windows SmartScreen Warnung:
Die App ist **sicher**, aber nicht code-signiert (Zertifikat kostet 400€/Jahr).
- Klicke auf "Weitere Informationen"
- Dann "Trotzdem ausführen"
- **Hilf uns mit einer Spende**, das Zertifikat zu finanzieren!

### Streamer-Verzeichnis:
- **Opt-In erforderlich:** Aktiviere in Einstellungen
- **Heartbeat:** App sendet alle 5 Min ein Update
- **Inaktivität:** Nach 30 Tagen ohne App-Nutzung wirst du automatisch entfernt
- **Datenschutz:** Nur öffentliche Twitch-Daten werden angezeigt

### Rewards Queue:
- **Benötigt Scopes:** `channel:read:redemptions` + `channel:manage:redemptions`
- **Affiliate/Partner:** Nur für Twitch Affiliates/Partner verfügbar
- **Erstatten funktioniert:** CANCELED Status gibt automatisch Punkte zurück

## 🙏 Danke!

Vielen Dank an alle Nutzer für das Feedback und die Unterstützung!

**Besonderer Dank an:**
- Alle Beta-Tester
- Die Discord-Community
- Alle die Bugs gemeldet haben

## 💜 Unterstütze StreamMatrix

StreamMatrix ist 100% kostenlos und Open Source. Hilf uns, die Windows-Warnung zu entfernen:

**Spende via PayPal:** https://www.paypal.com/donate?campaign_id=F69NRSXHU8W7N

**Ziel:** 400€ für Code-Signierungszertifikat

**Jeder Betrag hilft!** Auch 5€ bringen uns dem Ziel näher. ☕

## 🔗 Links

- **Website:** https://streammatrix.de/
- **Streamer-Verzeichnis:** https://streammatrix.de/streamer
- **Discord:** https://discord.gg/MeMEuu5tXU
- **GitHub:** https://github.com/19bounty9317/StreamMatrix
- **Spenden:** https://www.paypal.com/donate?campaign_id=F69NRSXHU8W7N

## 📝 Changelog

Vollständiges Changelog: [CHANGELOG.md](CHANGELOG.md)

---

**Version:** 1.4.8  
**Release-Datum:** 19. November 2025  
**Build:** Windows x64  
**Größe:** ~150 MB  

**SHA-256 Checksumme:** (wird nach Build generiert)

---

## 🐛 Bekannte Probleme

- Windows SmartScreen Warnung (kein Code-Signing)
- Twitch API Rate Limits bei vielen Streamern (Cloud Functions)
- Erste Installation kann länger dauern (Electron Download)

## 🔮 Nächste Version (v1.4.9)

Geplante Features:
- 🔍 Suche im Streamer-Verzeichnis
- 🏆 Top-Streamer nach Viewern
- 🎨 Filter nach Kategorie/Game
- ⭐ Favoriten-System
- 📱 Mobile-Optimierung der Website
- 🌐 Mehrsprachigkeit (EN)

---

**Viel Spaß mit StreamMatrix v1.4.8!** 🎮💜
