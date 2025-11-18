# 🎁 StreamMatrix v1.4.6 - Channel Points Integration

**Release-Datum:** 18. November 2025

## 🎉 Neue Features

### 🎁 Kanalpunkte-Einlösungen in Alerts
- **Channel Points Redemptions werden jetzt in Alerts angezeigt**
  - Automatische Erkennung wenn Zuschauer Kanalpunkte einlösen
  - Anzeige im Chat als grünes Banner mit 💎 Icon
  - Anzeige in Alerts/Benachrichtigungen mit 🎁 Icon und gelbem Border
  - Desktop-Benachrichtigung mit eigenem Sound (700 Hz)
  - Zeigt Belohnungstitel und optionale Nachricht an

### 📊 Verbesserte Event-Übersicht
- Alle wichtigen Events an einem Ort:
  - 🚀 Raids
  - ⭐ Sub-Bomben (5+ Subs)
  - 🎁 Kanalpunkte-Einlösungen (NEU!)
- Bessere Übersicht über Community-Interaktionen
- Keine wichtigen Events mehr verpassen

## 🔧 Technische Verbesserungen

### NotificationService
- AlertEvent Interface um 'channel-points' Typ erweitert
- Eigener Sound für Channel Points (700 Hz Frequenz)
- Formatierte Benachrichtigungen mit Belohnungstitel

### TileChat
- Automatische Weiterleitung von Channel Points Events an NotificationService
- Verbesserte Event-Verarbeitung
- Duplikat-Prävention

### TileAlerts
- Optimierte Darstellung für Channel Points
- Gelber Border für bessere Sichtbarkeit
- Icon: 🎁 für Kanalpunkte-Einlösungen

## 📝 Verwendung

1. **Automatische Erkennung**: Wenn ein Zuschauer Kanalpunkte einlöst, wird das Event automatisch erkannt
2. **Chat-Anzeige**: Im Chat erscheint ein grünes Banner mit der Belohnung
3. **Alert-Anzeige**: In der Alerts-Tile erscheint das Event mit allen Details
4. **Benachrichtigung**: Optional Desktop-Benachrichtigung (wenn aktiviert)

## 🎯 Vorteile

- **Bessere Community-Interaktion**: Reagiere schnell auf Kanalpunkte-Einlösungen
- **Keine Events verpassen**: Alle wichtigen Interaktionen an einem Ort
- **Professionelles Streaming**: Zeige deiner Community, dass du ihre Aktionen wahrnimmst

## 🔄 Update-Hinweise

- Keine Breaking Changes
- Automatische Integration in bestehende Alerts
- Keine zusätzliche Konfiguration erforderlich

## 📦 Installation

1. Lade die neueste Version von unserem Discord-Server herunter
2. Installiere das Update
3. Starte StreamMatrix neu
4. Channel Points Redemptions werden automatisch erkannt!

## 🐛 Bugfixes

- Behoben: TypeScript-Fehler in TileAlerts (id possibly undefined)
- Verbessert: Event-Filterung in Test-Modus

## 🙏 Danke

Vielen Dank an alle Community-Mitglieder für das Feedback und die Feature-Requests!

---

**Download:** Verfügbar auf unserem Discord-Server
**Support:** Discord-Server für Hilfe und Feedback
**Dokumentation:** Siehe README.md für weitere Informationen
