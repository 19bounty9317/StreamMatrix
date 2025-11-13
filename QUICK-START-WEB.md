# 🚀 StreamMatrix Web - Quick Start

## In 5 Minuten zur Web-Version!

### Schritt 1: Twitch OAuth konfigurieren (2 Min)

1. Öffne: https://dev.twitch.tv/console/apps
2. Wähle deine App
3. Füge Redirect URI hinzu:
   ```
   https://19bounty9317.github.io/StreamMatrix/app
   ```
4. Klicke "Save"

✅ **Fertig!** OAuth ist konfiguriert.

---

### Schritt 2: Lokal testen (1 Min)

```bash
npm run dev:web
```

Öffne: http://localhost:5174

✅ **Funktioniert?** Weiter zu Schritt 3!

---

### Schritt 3: Build erstellen (1 Min)

```bash
npm run build:web
```

✅ **Build erfolgreich?** Weiter zu Schritt 4!

---

### Schritt 4: Deployen (1 Min)

```bash
deploy-web.bat
```

Oder manuell:
```bash
xcopy /E /I /Y dist\web docs\app
git add docs/app
git commit -m "Deploy web version"
git push
```

✅ **Deployed!** Warte 1-2 Minuten...

---

### Schritt 5: Testen

Öffne: https://19bounty9317.github.io/StreamMatrix/app

✅ **Läuft?** 🎉 **FERTIG!**

---

## 🎯 Das war's!

Deine Web-Version ist jetzt live und funktioniert auf:
- 💻 Desktop (alle Browser)
- 📱 iPad/Tablet
- 🌐 Überall mit Internet

---

## 🔗 Wichtige Links

- **Web-App:** https://19bounty9317.github.io/StreamMatrix/app
- **Landing Page:** https://19bounty9317.github.io/StreamMatrix/app.html
- **Hauptseite:** https://19bounty9317.github.io/StreamMatrix/

---

## ❓ Probleme?

### OAuth funktioniert nicht:
→ Prüfe Redirect URI in Twitch Console (muss EXAKT übereinstimmen)

### Build-Fehler:
→ `npm install` ausführen

### Seite lädt nicht:
→ Warte 2-3 Minuten nach Push (GitHub Pages braucht Zeit)

---

## 💡 Nächste Schritte

1. **Teile den Link** mit deiner Community
2. **Teste auf iPad/Tablet**
3. **Feedback sammeln** im Discord
4. **Updates deployen** mit `deploy-web.bat`

---

## 🎉 Glückwunsch!

Du hast jetzt:
- ✅ Desktop-App (Windows)
- ✅ Web-App (Browser)
- ✅ Funktioniert auf iPad/Tablet
- ✅ Keine Server-Kosten
- ✅ Automatisches Hosting via GitHub Pages

**Perfekt für maximale Reichweite!** 🚀
