# 🔄 GitHub → Discord Webhook einrichten

## Automatische Updates bei neuen Releases

---

## 🎯 Was wird gepostet?

Wenn du ein neues Release auf GitHub veröffentlichst, wird automatisch eine Nachricht in Discord gepostet mit:
- 🎉 Release-Name & Version
- 📝 Changelog/Release Notes
- 🔗 Download-Link
- 👤 Wer hat es veröffentlicht

---

## 📋 Schritt-für-Schritt Anleitung

### Schritt 1: Discord Webhook erstellen

1. **Gehe in Discord** zu deinem Server
2. **Rechtsklick** auf den Kanal **#changelog** (oder #github-updates)
3. Klicke auf **"Kanal bearbeiten"**
4. Gehe zu **"Integrationen"** (linke Seite)
5. Klicke auf **"Webhooks"**
6. Klicke auf **"Neuer Webhook"**
7. **Name:** `GitHub Releases`
8. **Kanal:** #changelog
9. **Avatar:** (Optional) Lade das GitHub-Logo hoch
10. Klicke auf **"Webhook-URL kopieren"**
11. **WICHTIG:** Speichere diese URL! Sie sieht so aus:
    ```
    https://discord.com/api/webhooks/123456789/abcdefghijklmnop
    ```
12. Klicke auf **"Änderungen speichern"**

---

### Schritt 2: GitHub Webhook einrichten

1. **Gehe zu GitHub:** https://github.com/19bounty9317/StreamMatrix
2. Klicke auf **"Settings"** (oben rechts)
3. Klicke auf **"Webhooks"** (linke Seite)
4. Klicke auf **"Add webhook"**
5. **Payload URL:** Füge deine Discord-Webhook-URL ein + `/github` am Ende
   ```
   https://discord.com/api/webhooks/123456789/abcdefghijklmnop/github
   ```
   ⚠️ **Wichtig:** Das `/github` am Ende nicht vergessen!

6. **Content type:** Wähle `application/json`
7. **Which events would you like to trigger this webhook?**
   - Wähle **"Let me select individual events"**
   - ✅ Aktiviere **"Releases"**
   - ❌ Deaktiviere alles andere
8. ✅ **Active** - Haken setzen
9. Klicke auf **"Add webhook"**

---

### Schritt 3: Testen

1. **Erstelle ein Test-Release** auf GitHub:
   - Gehe zu: https://github.com/19bounty9317/StreamMatrix/releases
   - Klicke auf **"Draft a new release"**
   - Tag: `v1.4.5-test`
   - Title: `Test Release`
   - Description: `Dies ist ein Test`
   - ✅ **This is a pre-release** (Haken setzen)
   - Klicke auf **"Publish release"**

2. **Prüfe Discord:**
   - Gehe zu #changelog
   - Nach 1-2 Sekunden sollte eine Nachricht erscheinen!

3. **Test-Release löschen:**
   - Gehe zurück zu GitHub Releases
   - Klicke auf das Test-Release
   - Klicke auf **"Delete"**

---

## 🎨 Wie sieht die Nachricht aus?

```
GitHub
StreamMatrix

[Release] v1.4.5 - Multi-Window Support

📝 Changelog:
• Neue Features
• Bug Fixes
• Verbesserungen

🔗 Download: https://github.com/19bounty9317/StreamMatrix/releases/tag/v1.4.5
```

---

## 🔧 Erweiterte Optionen

### Mehrere Events aktivieren

Wenn du auch andere Updates willst:

**In GitHub Webhook-Einstellungen:**
- ✅ **Releases** - Neue Versionen
- ✅ **Issues** - Neue Issues (optional)
- ✅ **Pull requests** - Neue PRs (optional)
- ✅ **Stars** - Neue Stars (optional)

**Empfehlung:** Nur Releases aktivieren, sonst wird es zu viel!

---

### Separate Kanäle für verschiedene Events

**Releases → #changelog:**
- Webhook 1: Nur Releases
- Kanal: #changelog

**Issues & PRs → #github-updates:**
- Webhook 2: Issues + Pull Requests
- Kanal: #github-updates

---

## 🐛 Troubleshooting

**Problem: Keine Nachricht in Discord**
- ✅ Prüfe ob `/github` am Ende der URL steht
- ✅ Prüfe ob der Webhook "Active" ist
- ✅ Prüfe ob "Releases" aktiviert ist
- ✅ Warte 1-2 Minuten

**Problem: Fehler "Invalid Webhook Token"**
- ❌ Webhook-URL ist falsch
- ➡️ Erstelle einen neuen Webhook in Discord

**Problem: Zu viele Nachrichten**
- ➡️ Deaktiviere unnötige Events in GitHub
- ➡️ Nur "Releases" aktiviert lassen

---

## 💡 Tipps

**Ping bei Releases:**
Wenn du die @Updates Rolle bei neuen Releases pingen willst:

1. Gehe in Discord zu #changelog
2. Rechtsklick → Kanal bearbeiten → Integrationen
3. Bearbeite den Webhook
4. Füge in "Name" hinzu: `GitHub Releases <@&ROLE_ID>`
5. Ersetze `ROLE_ID` mit der ID der @Updates Rolle

**Rolle-ID finden:**
1. Server-Einstellungen → Rollen
2. Rechtsklick auf "Updates" → ID kopieren
3. Aktiviere "Entwicklermodus" in Discord-Einstellungen falls nötig

---

## ✅ Fertig!

Jetzt bekommst du automatisch Updates in Discord bei jedem neuen Release! 🎉

**Nächstes Release:**
1. Erstelle Release auf GitHub
2. Automatisch wird es in #changelog gepostet
3. Community wird benachrichtigt

---

## 📚 Weitere Infos

- Discord Webhooks: https://discord.com/developers/docs/resources/webhook
- GitHub Webhooks: https://docs.github.com/en/webhooks

Bei Problemen: Frag einfach! 💜
