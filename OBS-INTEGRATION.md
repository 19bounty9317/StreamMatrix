# 🎥 OBS Integration - Anleitung

## Übersicht
StreamMatrix kann sich mit OBS Studio verbinden und bietet:
- **Live-Vorschau** ohne Verzögerung (1 Sekunde Refresh)
- **Stream-Statistiken** (FPS, CPU, Bitrate)
- **Szenen-Kontrolle** (geplant)

## Einrichtung

### 1. OBS WebSocket aktivieren

1. **OBS Studio öffnen**
2. Gehe zu **Tools → WebSocket Server Settings**
3. Aktiviere **"Enable WebSocket server"**
4. Notiere dir:
   - **Port** (Standard: 4455)
   - **Passwort** (optional, aber empfohlen)

### 2. StreamMatrix konfigurieren

1. Öffne **Einstellungen** (⚙️ Icon)
2. Scrolle zu **"🎥 OBS Integration"**
3. Gib ein:
   - **Host:** `localhost` (wenn OBS auf dem gleichen PC läuft)
   - **Port:** `4455` (oder dein gewählter Port)
   - **Passwort:** (falls in OBS gesetzt)
4. Klicke auf **"🔗 Mit OBS verbinden"**

### 3. Live-Vorschau nutzen

1. Öffne die **Stream-Vorschau Kachel**
2. Wechsle zwischen:
   - **📺 Twitch** - Zeigt deinen Twitch-Stream (10-20s Verzögerung)
   - **🎥 OBS** - Zeigt Live-Bild direkt von OBS (1s Refresh)

## Vorteile der OBS-Vorschau

✅ **Keine Verzögerung** - Siehst sofort was deine Zuschauer sehen werden
✅ **Offline-Vorschau** - Funktioniert auch wenn du nicht streamst
✅ **Szenen-Test** - Teste Szenen bevor du live gehst
✅ **Ressourcen-schonend** - Nur Screenshots, kein Video-Stream

## Fehlerbehebung

### "OBS nicht verbunden"
- ✅ Prüfe ob OBS läuft
- ✅ Prüfe ob WebSocket aktiviert ist (Tools → WebSocket Server Settings)
- ✅ Prüfe Port (Standard: 4455) und Passwort
- ✅ Firewall könnte Port blockieren
- ✅ Starte StreamMatrix neu nach OBS-Konfiguration

### "Verbindung fehlgeschlagen"
- ✅ Stelle sicher dass OBS WebSocket 5.x verwendet wird
- ✅ Ältere OBS-Versionen nutzen WebSocket 4.x (nicht kompatibel)
- ✅ Update OBS auf die neueste Version (28.0+)
- ✅ Prüfe ob der Port bereits von einem anderen Programm verwendet wird

### "CSP Fehler" (Content Security Policy)
- ✅ Wurde in Version 1.2.0 behoben
- ✅ Starte die App neu wenn du von einer älteren Version updatest
- ✅ Die App erlaubt jetzt WebSocket-Verbindungen zu localhost

### Schwarzes Bild
- Prüfe ob eine Szene aktiv ist
- Prüfe ob Quellen in der Szene vorhanden sind
- Versuche OBS neu zu starten

## Technische Details

- **Protokoll:** OBS WebSocket 5.x
- **Port:** 4455 (Standard)
- **Authentifizierung:** SHA-256 Challenge-Response
- **Update-Rate:** 1 Screenshot pro Sekunde
- **Auflösung:** 1280x720 (optimiert für Performance)
- **Format:** JPEG mit 85% Qualität
- **Verbindungs-Timeout:** 5 Sekunden

### Authentifizierungs-Flow:
1. WebSocket-Verbindung zu OBS
2. OBS sendet Hello-Message mit Challenge
3. StreamMatrix berechnet SHA-256 Hash
4. Identify-Message mit Auth-String
5. OBS bestätigt mit Identified-Message

## Geplante Features

🔜 **Szenen-Wechsel** - Wechsle Szenen direkt aus StreamMatrix
🔜 **Quellen-Kontrolle** - Schalte Quellen ein/aus
🔜 **Recording-Start** - Starte/Stoppe Aufnahmen
🔜 **Filter-Kontrolle** - Aktiviere/Deaktiviere Filter

---

**Hinweis:** OBS muss während der Nutzung geöffnet sein. Die Verbindung wird automatisch beim Start von StreamMatrix hergestellt, wenn die Konfiguration gespeichert ist.
