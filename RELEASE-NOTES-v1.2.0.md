# 🚀 StreamMatrix v1.2.0 - OBS Integration Release

**Release-Datum:** 29. Oktober 2025

---

## 🎉 Hauptfeatures

### 🎥 OBS WebSocket Integration
Vollständige Integration mit OBS Studio über WebSocket 5.x Protokoll.

**Features:**
- ✅ Sichere SHA-256 Challenge-Response Authentifizierung
- ✅ Automatische Verbindung beim App-Start
- ✅ Automatischer Reconnect bei Verbindungsabbruch
- ✅ Echtzeit-Verbindungsstatus
- ✅ Konfigurierbar über Einstellungen

### 📺 Erweiterte Stream-Vorschau
Zwei Modi für maximale Flexibilität.

**Twitch-Modus:**
- Klassischer Twitch Player Embed
- ~10-20 Sekunden Verzögerung (normal für Twitch)
- Audio-Controls (Mute, Lautstärke)
- Vollbild-Unterstützung

**OBS-Modus:**
- Live-Screenshots direkt von OBS
- Nur 1 Sekunde Verzögerung
- Keine Audio-Verzögerung
- Perfekt für Szenen-Tests vor dem Stream

### ⚙️ OBS-Einstellungen
Einfache Konfiguration direkt in der App.

**Konfigurierbar:**
- Host (localhost oder Remote-IP)
- Port (Standard: 4455)
- Passwort (optional)
- Verbinden/Trennen mit einem Klick

**Hilfreiche Features:**
- Verbindungsstatus-Anzeige
- Detaillierte Fehlermeldungen
- Setup-Anleitung in der UI
- Automatisches Speichern der Konfiguration

---

## 🔧 Technische Verbesserungen

### Content Security Policy
- WebSocket-Verbindungen zu localhost erlaubt
- `ws://localhost:*` und `ws://127.0.0.1:*` whitelisted
- Sichere Konfiguration beibehalten

### Event-System
- Custom Events für OBS-Verbindungsänderungen
- Sofortige UI-Updates bei Statusänderungen
- Effiziente State-Synchronisation

### Performance
- Screenshot-Caching für bessere Performance
- Optimierte Update-Intervalle (2s für Status, 1s für Screenshots)
- Minimale CPU-Last im OBS-Modus

---

## 📚 Dokumentation

### Neue Dateien
- `OBS-INTEGRATION.md` - Detaillierte Einrichtungsanleitung
- `TEST-CHECKLISTE.md` - Vollständige Test-Anleitung
- `CHANGELOG.md` - Versionshistorie
- `WICHTIG-NEUSTART.md` - Neustart-Anleitung

### Aktualisierte Dateien
- `NUTZER-ANLEITUNG.md` - OBS-Sektion hinzugefügt
- `README.md` - Features aktualisiert

---

## 🐛 Bugfixes

- Verbesserte Fehlerbehandlung bei WebSocket-Verbindungen
- Korrekte Cleanup-Logik bei Verbindungsabbruch
- Promise-Resolve erst nach erfolgreicher Authentifizierung
- Timeout-Handling für langsame Verbindungen

---

## 📋 Anforderungen

### OBS Studio
- **Mindestversion:** OBS Studio 28.0+
- **WebSocket:** Version 5.x (in OBS 28+ integriert)
- **Betriebssystem:** Windows, macOS, Linux

### StreamMatrix
- **Node.js:** 16.x oder höher
- **Electron:** 27.x
- **React:** 18.x

---

## 🚀 Installation & Setup

### 1. OBS konfigurieren
```
1. OBS Studio öffnen
2. Tools → WebSocket Server Settings
3. "Enable WebSocket server" aktivieren
4. Port 4455 (Standard) notieren
5. Optional: Passwort setzen
6. OK klicken
```

### 2. StreamMatrix verbinden
```
1. StreamMatrix öffnen
2. Einstellungen (⚙️) öffnen
3. Zu "OBS Integration" scrollen
4. Host: localhost
5. Port: 4455
6. Passwort: (falls gesetzt)
7. "Mit OBS verbinden" klicken
```

### 3. Live-Vorschau nutzen
```
1. Stream-Vorschau Kachel öffnen
2. Auf "🎥 OBS ✓" Button klicken
3. Live-Bild ohne Verzögerung genießen!
```

---

## 🎯 Use Cases

### Für Streamer
- **Szenen-Test:** Teste Szenen bevor du live gehst
- **Overlay-Check:** Prüfe Overlays ohne Stream-Verzögerung
- **Quick-Preview:** Schneller Blick auf das aktuelle Bild
- **Offline-Setup:** Richte alles ein ohne zu streamen

### Für Moderatoren
- **Dual-View:** Twitch-Stream und OBS-Live parallel
- **Sync-Check:** Vergleiche Verzögerung zwischen OBS und Twitch
- **Quality-Control:** Prüfe Bildqualität in Echtzeit

---

## ⚠️ Bekannte Einschränkungen

### OBS WebSocket
- Nur lokale Verbindungen getestet (localhost)
- Remote-Verbindungen benötigen Firewall-Konfiguration
- WebSocket 4.x wird nicht unterstützt

### Screenshots
- Auflösung: 1280x720 (optimiert für Performance)
- Format: JPEG mit 85% Qualität
- Update-Rate: 1 Sekunde (nicht Echtzeit-Video)

### Browser-Kompatibilität
- Funktioniert nur in Electron (Desktop-App)
- Nicht im Web-Browser verfügbar

---

## 🔮 Roadmap (v1.3.0+)

### Geplante Features
- 🎬 **Szenen-Kontrolle:** Wechsle Szenen direkt aus StreamMatrix
- 📹 **Recording-Control:** Starte/Stoppe Aufnahmen
- 🎛️ **Audio-Mixer:** Steuere Audio-Quellen
- 📊 **Erweiterte Stats:** FPS, Dropped Frames, Bitrate
- 🎨 **Filter-Control:** Aktiviere/Deaktiviere Filter
- 🔴 **Stream-Control:** Starte/Stoppe Stream aus der App

### Community-Wünsche
- Multi-OBS Support (mehrere OBS-Instanzen)
- OBS-Szenen als Thumbnails
- Hotkey-Integration
- OBS-Event-Notifications

---

## 🙏 Credits

**Entwickelt mit:**
- React 18
- TypeScript
- Electron 27
- OBS WebSocket 5.x
- Twitch API

**Besonderer Dank an:**
- OBS Studio Team für das WebSocket-Protokoll
- Twitch für die API
- Die Streaming-Community für Feedback

---

## 📞 Support

### Bei Problemen
1. Prüfe `TEST-CHECKLISTE.md`
2. Lies `OBS-INTEGRATION.md`
3. Schau in die Browser-Console (F12)
4. Prüfe OBS WebSocket Settings

### Häufige Fehler
- **"Verbindung fehlgeschlagen"** → OBS läuft nicht oder WebSocket deaktiviert
- **"OBS ✗ Button grau"** → Keine Verbindung, prüfe Einstellungen
- **"Schwarzes Bild"** → Keine aktive Szene in OBS
- **"Timeout"** → Firewall blockiert Port 4455

---

## 📄 Lizenz

MIT License - Siehe LICENSE Datei

---

**Viel Spaß mit StreamMatrix v1.2.0!** 🎉🎥✨
