# 💬 Chat-Befehle - StreamMatrix

## Übersicht

StreamMatrix unterstützt Slash-Commands direkt im Chat. Gib einfach `/help` ein um alle Befehle zu sehen!

---

## 🚀 Raid & Host

### /raid <username>
Starte einen Raid zu einem anderen Channel.

**Beispiel:**
```
/raid shroud
```

**Ergebnis:** Deine Zuschauer werden zu shroud geraidet.

---

### /unraid
Bricht einen laufenden Raid ab.

**Beispiel:**
```
/unraid
```

---

### /host <username>
Hoste einen anderen Channel.

**Beispiel:**
```
/host pokimane
```

---

### /unhost
Beendet das Hosting.

**Beispiel:**
```
/unhost
```

---

## 🛡️ Moderations-Befehle

### /mod <username>
Gibt einem User Moderator-Rechte.

**Beispiel:**
```
/mod john_doe
```

---

### /unmod <username>
Entfernt Moderator-Rechte.

**Beispiel:**
```
/unmod john_doe
```

---

### /vip <username>
Gibt einem User VIP-Status.

**Beispiel:**
```
/vip jane_doe
```

---

### /unvip <username>
Entfernt VIP-Status.

**Beispiel:**
```
/unvip jane_doe
```

---

## 🔨 Ban & Timeout

### /ban <username> [reason]
Bannt einen User permanent.

**Beispiel:**
```
/ban spammer Spam
/ban troll
```

---

### /unban <username>
Entbannt einen User.

**Beispiel:**
```
/unban reformed_user
```

---

### /timeout <username> <seconds> [reason]
Timeoutet einen User für X Sekunden.

**Beispiel:**
```
/timeout annoying_user 600 Zu laut
/timeout spammer 300
```

**Hinweis:** 600 Sekunden = 10 Minuten

---

## 🧹 Chat-Verwaltung

### /clear
Löscht alle Nachrichten im Chat.

**Beispiel:**
```
/clear
```

**Hinweis:** Nur für Mods/Broadcaster sichtbar.

---

## ⏱️ Chat-Modi

### /slow <seconds>
Aktiviert Slow-Mode (User können nur alle X Sekunden schreiben).

**Beispiel:**
```
/slow 30
/slow 10
```

**Standard:** 30 Sekunden

---

### /slowoff
Deaktiviert Slow-Mode.

**Beispiel:**
```
/slowoff
```

---

### /followers <minutes>
Aktiviert Follower-Only-Mode (nur Follower die X Minuten folgen können schreiben).

**Beispiel:**
```
/followers 10
/followers 0
```

**Hinweis:** 0 = alle Follower, 10 = nur Follower die 10+ Minuten folgen

---

### /followersoff
Deaktiviert Follower-Only-Mode.

**Beispiel:**
```
/followersoff
```

---

### /subscribers
Aktiviert Subscriber-Only-Mode (nur Subs können schreiben).

**Beispiel:**
```
/subscribers
```

---

### /subscribersoff
Deaktiviert Subscriber-Only-Mode.

**Beispiel:**
```
/subscribersoff
```

---

### /emoteonly
Aktiviert Emote-Only-Mode (nur Emotes erlaubt).

**Beispiel:**
```
/emoteonly
```

---

### /emoteonlyoff
Deaktiviert Emote-Only-Mode.

**Beispiel:**
```
/emoteonlyoff
```

---

## 📺 Werbung

### /commercial <seconds>
Startet eine Werbepause.

**Beispiel:**
```
/commercial 30
/commercial 60
/commercial 90
```

**Verfügbare Längen:** 30, 60, 90, 120, 150, 180 Sekunden

**Hinweis:** Nur für Partner/Affiliates verfügbar.

---

## ℹ️ Hilfe

### /help
Zeigt alle verfügbaren Befehle im Chat an.

**Beispiel:**
```
/help
```

---

## 🎯 Tipps & Tricks

### Auto-Complete
- Tippe `/` und drücke Tab für Vorschläge (geplant)
- Usernames mit @ autocompleten (geplant)

### Schnellzugriff
- **Raid:** `/raid <user>`
- **Timeout:** `/timeout <user> 600`
- **Clear:** `/clear`
- **Slow:** `/slow 30`

### Kombinationen
```
# Aktiviere mehrere Modi gleichzeitig
/slow 30
/followers 10
/emoteonly
```

### Häufige Szenarien

**Spam-Welle:**
```
/clear
/slow 60
/followers 10
```

**Raid vorbereiten:**
```
/commercial 180
/raid <target_channel>
```

**Chat aufräumen:**
```
/clear
/slowoff
/followersoff
```

---

## 🔐 Berechtigungen

### Broadcaster (Du)
- ✅ Alle Befehle verfügbar

### Moderatoren
- ✅ /ban, /unban, /timeout
- ✅ /clear
- ✅ /slow, /followers, /subscribers, /emoteonly
- ❌ /raid, /host, /commercial
- ❌ /mod, /unmod, /vip, /unvip

### VIPs
- ❌ Keine Moderations-Befehle

### Normale User
- ❌ Keine Befehle

---

## 🐛 Fehlerbehebung

### "Befehl nicht erkannt"
- Prüfe Schreibweise (alles kleingeschrieben)
- Prüfe ob du Broadcaster/Mod bist
- Manche Befehle benötigen Partner-Status

### "User nicht gefunden"
- Prüfe Schreibweise des Usernames
- Username ohne @ eingeben
- User muss im Chat gewesen sein

### "Keine Berechtigung"
- Nur Broadcaster kann raiden/hosten
- Nur Broadcaster kann Mods/VIPs vergeben
- Nur Partner können Werbung schalten

---

## 📋 Vollständige Befehlsliste

```
/raid <user>              - Raiden
/unraid                   - Raid abbrechen
/host <user>              - Hosten
/unhost                   - Host beenden
/mod <user>               - Mod geben
/unmod <user>             - Mod entfernen
/vip <user>               - VIP geben
/unvip <user>             - VIP entfernen
/ban <user> [reason]      - Bannen
/unban <user>             - Entbannen
/timeout <user> <sec>     - Timeout
/clear                    - Chat leeren
/slow <sec>               - Slow-Mode
/slowoff                  - Slow-Mode aus
/followers <min>          - Follower-Only
/followersoff             - Follower-Only aus
/subscribers              - Sub-Only
/subscribersoff           - Sub-Only aus
/emoteonly                - Emote-Only
/emoteonlyoff             - Emote-Only aus
/commercial <sec>         - Werbung
/help                     - Hilfe anzeigen
```

---

## 🔮 Geplante Features

### v1.3.0
- 🎯 Auto-Complete für Befehle
- 👥 Username-Vorschläge
- 📝 Befehlshistorie (Pfeiltasten)
- ⌨️ Keyboard-Shortcuts

### v1.4.0
- 🤖 Custom Bot-Commands
- 📊 Command-Statistiken
- 🎨 Command-Aliase
- 🔔 Command-Notifications

---

**Viel Spaß mit den Chat-Befehlen!** 💬✨
