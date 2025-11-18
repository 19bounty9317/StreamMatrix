# 🔐 Firebase Admin-Account erstellen

## Schritt 1: Admin-Account in Firebase erstellen

1. **Gehe zu Firebase Console:** https://console.firebase.google.com
2. **Wähle dein Projekt:** "streammatrix-731e0"
3. **Im linken Menü:** "Authentication" (oder "Build" → "Authentication")
4. **Klicke:** "Get started" (falls noch nicht aktiviert)
5. **Wähle:** "Email/Password" als Sign-in method
6. **Aktiviere:** "Email/Password" (Toggle auf ON)
7. **Klicke:** "Save"

## Schritt 2: Ersten Admin-User erstellen

1. **Im Authentication-Tab:** Klicke "Add user"
2. **Email:** Deine Email (z.B. `streammatrix@web.de`)
3. **Password:** Ein sicheres Passwort (mindestens 6 Zeichen)
4. **Klicke:** "Add user"

✅ **Fertig!** Du kannst dich jetzt im Admin-Dashboard einloggen.

---

## Schritt 3: Firestore Security Rules setzen

1. **Im linken Menü:** "Firestore Database"
2. **Tab:** "Rules"
3. **Ersetze den Inhalt mit:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users Collection
    match /users/{userId} {
      // Jeder kann schreiben (App sendet Daten)
      allow write: if true;
      
      // Nur authentifizierte User (Admin) können lesen
      allow read: if request.auth != null;
    }
  }
}
```

4. **Klicke:** "Publish"

⚠️ **Wichtig:** Diese Rules erlauben der App, Daten zu schreiben, aber nur du (als Admin) kannst sie lesen!

---

## Schritt 4: Admin-Dashboard testen

1. **Öffne:** `docs/admin/index.html` in deinem Browser
   - Oder deploye es auf: `https://streammatrix.de/admin/`

2. **Login mit:**
   - Email: Deine Admin-Email
   - Passwort: Dein Admin-Passwort

3. **Du solltest sehen:**
   - Stats (Gesamt-User, Aktiv heute, etc.)
   - User-Tabelle (leer, bis erste User die App nutzen)

---

## Schritt 5: Admin-Dashboard deployen

### Option A: Auf GitHub Pages (streammatrix.de/admin/)

1. **Kopiere** `docs/admin/` Ordner nach `docs/admin/`
2. **Commit & Push:**
   ```bash
   git add docs/admin/
   git commit -m "Add admin dashboard"
   git push origin main
   ```
3. **Warte** ~1 Minute
4. **Öffne:** https://streammatrix.de/admin/

### Option B: Lokal testen

1. **Öffne** `docs/admin/index.html` direkt im Browser
2. **Login** mit deinen Credentials

---

## 🎯 Was du jetzt hast:

✅ Firebase-Projekt mit Firestore
✅ Admin-Account erstellt
✅ Security Rules gesetzt
✅ Admin-Dashboard bereit

## 📊 Was das Dashboard zeigt:

- **Gesamt-User:** Alle User die Analytics aktiviert haben
- **Aktiv heute:** User die heute die App genutzt haben
- **Aktiv diese Woche:** User die in den letzten 7 Tagen aktiv waren
- **Code-Verstöße:** User mit manipuliertem Code (⚠️)
- **Gebannte User:** User die du gebannt hast (🚫)
- **Opted-in:** User die Analytics zugestimmt haben

## 🔧 Admin-Funktionen:

- **User bannen:** Klicke "🚫 Bannen" bei einem User
- **User entbannen:** Klicke "✅ Entbannen" bei einem gebannten User
- **Suchen:** Suche nach Kanal-Namen
- **Filtern:** Filtere nach Status (OK, Verdächtig, Gebannt)
- **Auto-Refresh:** Dashboard aktualisiert sich alle 30 Sekunden

## ⚠️ Wichtig:

- **Gebannte User** können sich nicht mehr einloggen
- **Code-Verstöße** werden automatisch erkannt
- **Alle Daten** sind DSGVO-konform (nur mit Einwilligung)

---

## 🧪 Testen:

1. **Starte die App** (npm run dev)
2. **Login** mit Twitch
3. **Akzeptiere** Analytics im Consent-Dialog
4. **Warte** 30 Sekunden
5. **Öffne** Admin-Dashboard
6. **Du solltest** deinen Kanal sehen!

---

## 🚀 Nächste Schritte:

1. ✅ Admin-Account erstellt
2. ✅ Security Rules gesetzt
3. ✅ Dashboard getestet
4. 🔄 App testen
5. 🔄 Ersten User sehen
6. 🔄 Ban-Funktion testen

**Viel Erfolg!** 🎉
