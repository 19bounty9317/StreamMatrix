# 📦 StreamMatrix v1.2.0 - Installation

## 🎉 Neue Version mit OBS-Integration!

**Datei:** `StreamMatrix Setup 1.2.0.exe`  
**Größe:** 74 MB  
**Datum:** 29. Oktober 2025  
**Plattform:** Windows 10/11 (64-bit)

---

## ✨ Was ist neu in v1.2.0?

### 🎥 OBS WebSocket Integration
- Verbinde StreamMatrix mit OBS Studio
- Live-Vorschau ohne Verzögerung (1s Refresh)
- Automatische Verbindung beim Start
- Konfigurierbar über Einstellungen

### 📺 Erweiterte Stream-Vorschau
- Umschaltbar zwischen Twitch und OBS
- Twitch: ~15s Verzögerung (normal)
- OBS: 1s Verzögerung (Live)
- Perfekt für Szenen-Tests

### ⚙️ Neue Einstellungen
- OBS Host, Port und Passwort
- Verbindungsstatus-Anzeige
- Hilfreiche Fehlermeldungen

---

## 📥 Installation

### Neu-Installation

1. **Download**
   - Datei: `StreamMatrix Setup 1.2.0.exe`
   - Speichere sie in deinem Downloads-Ordner

2. **Installation starten**
   - Doppelklick auf die `.exe` Datei
   - Windows Defender Warnung erscheint (normal!)
   - Klicke auf **"Weitere Informationen"**
   - Klicke auf **"Trotzdem ausführen"**

3. **Installations-Assistent**
   - Wähle Installationsordner (Standard: `C:\Program Files\StreamMatrix`)
   - Aktiviere "Desktop-Verknüpfung erstellen"
   - Aktiviere "Startmenü-Verknüpfung erstellen"
   - Klicke auf **"Installieren"**

4. **Fertig!**
   - App startet automatisch
   - Melde dich mit Twitch an
   - Fertig! 🎉

---

### Update von v1.1.0 oder älter

1. **Alte Version deinstallieren** (optional)
   - Windows Einstellungen → Apps
   - Suche "StreamMatrix"
   - Klicke "Deinstallieren"
   - **WICHTIG:** Deine Einstellungen bleiben erhalten!

2. **Neue Version installieren**
   - Folge den Schritten der Neu-Installation
   - Deine Twitch-Anmeldung bleibt erhalten
   - Alle Einstellungen werden übernommen

3. **OBS einrichten** (neu)
   - Öffne OBS Studio
   - Tools → WebSocket Server Settings
   - Aktiviere "Enable WebSocket server"
   - In StreamMatrix: Einstellungen → OBS Integration
   - Verbinde mit OBS

---

## 🚀 Erste Schritte nach Installation

### 1. Twitch-Anmeldung
```
1. App öffnen
2. "Mit Twitch anmelden" klicken
3. Browser öffnet sich
4. Bei Twitch anmelden
5. Berechtigungen erlauben
6. Zurück zur App
```

### 2. Dashboard erkunden
```
- 📊 Stream-Statistiken
- 💬 Live-Chat
- 📺 Stream-Vorschau (NEU: mit OBS!)
- ⚡ Quick Actions
- 🎯 Channel Points
- ⚙️ Stream-Einstellungen
```

### 3. OBS verbinden (optional)
```
1. OBS öffnen
2. Tools → WebSocket Server Settings
3. "Enable WebSocket server" aktivieren
4. Port 4455 notieren
5. In StreamMatrix: Einstellungen → OBS Integration
6. Verbinden!
```

---

## 🎯 OBS-Integration nutzen

### Voraussetzungen
- **OBS Studio 28.0+** installiert
- **WebSocket aktiviert** in OBS
- **Port 4455** (Standard) oder eigener Port

### Einrichtung
1. **OBS konfigurieren**
   ```
   Tools → WebSocket Server Settings
   ✓ Enable WebSocket server
   Port: 4455
   Password: (optional)
   ```

2. **StreamMatrix verbinden**
   ```
   Einstellungen (⚙️) → OBS Integration
   Host: localhost
   Port: 4455
   Password: (falls gesetzt)
   → "Mit OBS verbinden"
   ```

3. **Live-Vorschau nutzen**
   ```
   Stream-Vorschau Kachel
   → Klick auf "🎥 OBS ✓"
   → Live-Bild ohne Verzögerung!
   ```

---

## ⚙️ System-Anforderungen

### Minimum
- **OS:** Windows 10 (64-bit)
- **RAM:** 4 GB
- **Festplatte:** 500 MB frei
- **Internet:** Stabile Verbindung

### Empfohlen
- **OS:** Windows 11 (64-bit)
- **RAM:** 8 GB
- **Festplatte:** 1 GB frei
- **Internet:** Breitband (10+ Mbps)

### Für OBS-Integration
- **OBS Studio:** Version 28.0 oder höher
- **WebSocket:** Version 5.x (in OBS 28+ integriert)
- **Port:** 4455 muss frei sein

---

## 🐛 Bekannte Probleme

### Windows Defender Warnung
**Problem:** "Windows hat den PC geschützt"  
**Lösung:** 
1. Klicke "Weitere Informationen"
2. Klicke "Trotzdem ausführen"
3. Das ist normal für nicht-signierte Apps

### OBS-Verbindung schlägt fehl
**Problem:** "Verbindung fehlgeschlagen"  
**Lösung:**
1. Prüfe ob OBS läuft
2. Prüfe WebSocket Settings in OBS
3. Prüfe Port (4455) und Passwort
4. Firewall könnte Port blockieren

### App startet nicht
**Problem:** Nichts passiert beim Doppelklick  
**Lösung:**
1. Rechtsklick → "Als Administrator ausführen"
2. Prüfe ob alte Version noch läuft (Task Manager)
3. Neu installieren

---

## 📚 Dokumentation

### Hilfreiche Dateien
- `OBS-INTEGRATION.md` - Detaillierte OBS-Anleitung
- `TEST-CHECKLISTE.md` - Vollständige Tests
- `NUTZER-ANLEITUNG.md` - Benutzerhandbuch
- `CHANGELOG.md` - Alle Änderungen
- `RELEASE-NOTES-v1.2.0.md` - Release-Informationen

### Online-Ressourcen
- OBS WebSocket Docs: https://github.com/obsproject/obs-websocket
- Twitch API Docs: https://dev.twitch.tv/docs/api

---

## 🔄 Deinstallation

### Windows 10/11
```
1. Windows Einstellungen öffnen
2. Apps → Apps & Features
3. Suche "StreamMatrix"
4. Klicke "Deinstallieren"
5. Bestätige mit "Deinstallieren"
```

### Manuelle Deinstallation
```
1. Lösche Installationsordner:
   C:\Program Files\StreamMatrix

2. Lösche Benutzerdaten (optional):
   C:\Users\[Dein Name]\AppData\Roaming\streammatrix

3. Lösche Desktop-Verknüpfung
4. Lösche Startmenü-Verknüpfung
```

---

## 📞 Support

### Bei Problemen
1. Prüfe `TEST-CHECKLISTE.md`
2. Lies `OBS-INTEGRATION.md`
3. Schau in die Browser-Console (F12 in der App)
4. Prüfe OBS WebSocket Settings

### Häufige Fragen
**Q: Muss ich OBS nutzen?**  
A: Nein, OBS ist optional. Die App funktioniert auch ohne.

**Q: Funktioniert es mit OBS Studio 27?**  
A: Nein, mindestens OBS 28.0 wird benötigt (WebSocket 5.x).

**Q: Kann ich mehrere OBS-Instanzen verbinden?**  
A: Aktuell nur eine Instanz. Multi-OBS kommt in v1.3.0.

**Q: Funktioniert es auf Mac/Linux?**  
A: Aktuell nur Windows. Mac/Linux-Builds sind geplant.

---

## 🎉 Viel Spaß mit StreamMatrix v1.2.0!

**Neue Features:**
- ✅ OBS WebSocket Integration
- ✅ Live-Vorschau ohne Verzögerung
- ✅ Dual-Mode Stream-Vorschau
- ✅ Automatische OBS-Verbindung
- ✅ Erweiterte Einstellungen

**Feedback willkommen!** 💜

---

**Version:** 1.2.0  
**Build-Datum:** 29. Oktober 2025  
**Lizenz:** MIT
