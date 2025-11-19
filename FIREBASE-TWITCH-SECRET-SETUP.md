# 🔑 Twitch Client Secret für Firebase Functions

## ⚠️ Wichtig: Client Secret setzen!

Die Cloud Functions benötigen deinen **Twitch Client Secret** um die Twitch API aufzurufen.

## 🚀 So setzt du den Secret:

### 1. Twitch Client Secret holen:

1. Gehe zu: https://dev.twitch.tv/console/apps
2. Wähle deine App: **StreamMatrix**
3. Klicke auf **"Manage"**
4. Kopiere den **"Client Secret"**
   - Falls nicht sichtbar: Klicke "New Secret"

### 2. Secret in Firebase setzen:

```bash
firebase functions:config:set twitch.client_secret="DEIN_CLIENT_SECRET_HIER"
```

**Beispiel:**
```bash
firebase functions:config:set twitch.client_secret="abc123def456ghi789jkl012mno345"
```

### 3. Functions neu deployen:

```bash
firebase deploy --only functions
```

## ✅ Prüfen ob es funktioniert:

### Manueller Test:

```bash
curl https://us-central1-streammatrix-731e0.cloudfunctions.net/triggerStreamerUpdate
```

**Erwartete Antwort:** `✅ Streamer-Update erfolgreich`

### Logs prüfen:

```bash
firebase functions:log
```

**Suche nach:**
- `🔑 Hole neuen Twitch Access Token...`
- `✅ Twitch Access Token erhalten`
- `🎮 Starte Streamer-Status-Update...`

## 🐛 Troubleshooting:

### "❌ Fehler beim Holen des Twitch Access Token"

**Ursache:** Client Secret falsch oder nicht gesetzt

**Lösung:**
1. Prüfe ob Secret gesetzt ist:
   ```bash
   firebase functions:config:get
   ```
   
2. Sollte zeigen:
   ```json
   {
     "twitch": {
       "client_secret": "abc123..."
     }
   }
   ```

3. Falls leer, setze erneut:
   ```bash
   firebase functions:config:set twitch.client_secret="DEIN_SECRET"
   firebase deploy --only functions
   ```

### "Invalid Client Secret"

**Ursache:** Secret ist abgelaufen oder falsch

**Lösung:**
1. Gehe zu Twitch Dev Console
2. Generiere neuen Secret
3. Setze in Firebase
4. Deploy erneut

## 📝 Wichtige Hinweise:

- ⚠️ **Niemals** den Client Secret in Git committen!
- 🔒 Der Secret wird nur in Firebase gespeichert
- 🔄 Functions müssen nach Secret-Änderung neu deployed werden
- ⏰ Der Secret läuft nicht ab (außer du generierst einen neuen)

## ✅ Fertig!

Sobald der Secret gesetzt ist, laufen die Cloud Functions automatisch:
- ⏰ Alle 5 Minuten: `updateStreamerStatus`
- 🧹 Täglich 03:00: `cleanupInactiveStreamers`

**Streamer-Verzeichnis ist dann voll funktionsfähig!** 🎮
