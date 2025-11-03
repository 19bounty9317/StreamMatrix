# 📺 StreamMatrix - Installations-Anleitung

## Was ist das?

Ein Desktop-Programm für Twitch-Streamer um:
- Live-Chat zu sehen und zu moderieren
- Follower, Subs, Bits zu überwachen
- Stream-Einstellungen zu ändern
- Kanalpunkte zu verwalten
- Alle wichtigen Infos auf einen Blick

---

## 💻 System-Anforderungen

- **Windows**: Windows 10 oder neuer (64-bit)
- **macOS**: macOS 10.13 oder neuer
- **Linux**: Ubuntu 18.04 oder neuer
- **RAM**: Mindestens 4 GB
- **Festplatte**: 500 MB freier Speicher
- **Internet**: Stabile Verbindung erforderlich

---

## 📥 Installation (Windows)

### Schritt 1: Download
1. Lade die Datei `StreamMatrix Setup.exe` herunter
2. Speichere sie in deinem Downloads-Ordner

### Schritt 2: Installation
1. Doppelklick auf die `.exe` Datei
2. Windows Defender Warnung erscheint (normal!)
   - Klicke auf "Weitere Informationen"
   - Klicke auf "Trotzdem ausführen"
3. Folge dem Installations-Assistenten
4. Klicke auf "Installieren"

### Schritt 3: Erste Nutzung
1. App startet automatisch nach Installation
2. Klicke auf "Mit Twitch anmelden"
3. Dein Browser öffnet sich
4. Melde dich mit deinem Twitch-Account an
5. Erlaube die Berechtigungen
6. Fertig! 🎉

---

## 🎮 Erste Schritte

### Dashboard-Übersicht
Nach dem Login siehst du verschiedene Kacheln:
- **📊 Stream-Statistiken** - Zuschauer, Follower, Subs
- **💬 Live-Chat** - Chatte mit deinen Zuschauern
- **📺 Stream-Vorschau** - Sieh deinen Stream (Twitch oder OBS)
- **⚡ Quick Actions** - Schnellzugriff auf wichtige Funktionen
- **🎯 Channel Points** - Verwalte Kanalpunkte-Belohnungen
- **⚙️ Stream-Einstellungen** - Titel, Kategorie, Tags ändern

### OBS Integration (Optional)
StreamMatrix kann sich mit OBS verbinden für:
- **Live-Vorschau ohne Verzögerung** (1s Refresh statt 10-20s)
- **Stream-Statistiken** (FPS, CPU, Bitrate)

**Einrichtung:**
1. Öffne OBS → Tools → WebSocket Server Settings
2. Aktiviere "Enable WebSocket server"
3. Notiere Port (4455) und Passwort
4. In StreamMatrix: Einstellungen → OBS Integration
5. Gib Host, Port und Passwort ein
6. Klicke "Mit OBS verbinden"

📖 **Detaillierte Anleitung:** Siehe `OBS-INTEGRATION.md`

---

## 🎮 Funktionen im Detail

### Dashboard anpassen
1. **Linke Sidebar**: Kacheln ein-/ausblenden
2. **Kacheln verschieben**: An der Titelleiste ziehen
3. **Kacheln vergrößern**: An den Ecken ziehen
4. **Schriftgröße**: A+/A- Buttons in jeder Kachel

### 🆕 Neue Features (v1.0.4)

#### Alerts & Benachrichtigungen 🔔
- Desktop-Benachrichtigungen für neue Follower, Subs, Bits, Raids
- Sound-Effekte für wichtige Events
- Alert-Historie der letzten 20 Events
- Ein-/Ausschalten von Benachrichtigungen und Sound

#### Viewer-Statistiken 📊
- Live-Viewer-Graph mit Verlauf
- Peak-Viewer-Anzeige
- Durchschnittliche Viewer-Zahl
- Aktualisiert sich alle 30 Sekunden

#### Quick Actions ⚡
- Vordefinierte Chat-Nachrichten
- Eigene Quick-Messages erstellen
- Mit einem Klick in den Chat senden
- Perfekt für "BRB", "Danke", etc.

#### Live Viewer Liste 👥
- Zeigt alle aktiven Zuschauer
- Filter nach Mods, VIPs, Subs
- Suchfunktion
- Badges für Rollen

#### Rewards Queue 🎁
- Verbesserte Kanalpunkte-Verwaltung
- Mehrfachauswahl (Checkboxen)
- Bulk-Actions: Alle bestätigen/erstatten
- Schnellere Bearbeitung

### Stream-Qualität überwachen
In der unteren Statusleiste siehst du:
- **CPU**: Prozessor-Auslastung (grün = gut, gelb = mittel, rot = hoch)
- **RAM**: Arbeitsspeicher-Auslastung
- **GPU**: Grafikkarten-Auslastung
- **Bitrate**: Aktuelle Stream-Bitrate (nur wenn live)

Diese Werte helfen dir, die Performance deines Streams zu überwachen!

### Chat nutzen
1. Nachrichten werden automatisch angezeigt
2. Schreibe unten ins Eingabefeld
3. Hover über Nachrichten für Mod-Aktionen:
   - 🗑️ Nachricht löschen
   - ⏱️ Timeout (60s oder 10min)
   - 🚫 Permanent bannen

### Stream-Einstellungen ändern
1. Öffne "Stream-Einstellungen" Kachel
2. Ändere Titel oder Kategorie
3. Klicke "Auf Twitch speichern"
4. Änderungen sind sofort live!

### Kanalpunkte verwalten
1. Öffne "Kanalpunkte" Kachel
2. Siehst alle Einlösungen
3. Klicke "✓ Bestätigen" oder "↩ Erstatten"

---

## ⚙️ Einstellungen

### Sidebar einklappen
- Klicke auf ← Button oben rechts in der Sidebar
- Spart Platz auf dem Bildschirm

### Chat-Optionen
- **💬 Felder an/aus**: Hebt Nachrichten hervor
- **🕐 Uhrzeit an/aus**: Zeigt Zeitstempel
- **Zuschauerzahl**: Klick zum Ein-/Ausblenden

### Layout speichern
- Alle Positionen und Größen werden automatisch gespeichert
- Bleiben nach Neustart erhalten

---

## ❓ Häufige Fragen

**Q: Warum zeigt Windows eine Warnung?**
A: Die App ist nicht digital signiert. Das ist normal und sicher. Klicke auf "Trotzdem ausführen".

**Q: Funktioniert das mit OBS?**
A: Ja! Das Dashboard läuft parallel zu OBS und anderen Streaming-Tools.

**Q: Kann ich mehrere Accounts nutzen?**
A: Ja, einfach abmelden und mit anderem Account anmelden.

**Q: Werden meine Daten gespeichert?**
A: Nur lokal auf deinem PC. Keine Cloud, keine Server.

**Q: Kostet das etwas?**
A: Nein, komplett kostenlos!

**Q: Brauche ich Twitch Partner/Affiliate?**
A: Nein, funktioniert für alle Twitch-Accounts. Manche Features (Subs, Bits) nur für Partner/Affiliate.

---

## 🔧 Probleme lösen

**App startet nicht**
1. Rechtsklick auf App → "Als Administrator ausführen"
2. Windows neu starten
3. App neu installieren

**Login funktioniert nicht**
1. Prüfe Internet-Verbindung
2. Erlaube Popups im Browser
3. Versuche anderen Browser

**Chat zeigt keine Nachrichten**
1. Prüfe ob du live bist
2. Warte 30 Sekunden (Verbindung wird aufgebaut)
3. App neu starten

**Kacheln zeigen keine Daten**
1. Prüfe Internet-Verbindung
2. Melde dich ab und wieder an
3. Warte 1-2 Minuten

---

## 🆘 Support

Bei Problemen:
1. App neu starten
2. Neu anmelden
3. App neu installieren

---

## 🎉 Viel Erfolg beim Streamen!

Dein StreamMatrix Team
