# Release-Prozess für StreamMatrix

## 🚀 Automatischer Prozess (Empfohlen)

### Setup (Einmalig)

1. **Firebase Token generieren:**
```bash
firebase login:ci
```

Kopiere den Token.

2. **GitHub Secret erstellen:**
- Gehe zu: https://github.com/19bounty9317/StreamMatrix/settings/secrets/actions
- Klicke "New repository secret"
- Name: `FIREBASE_TOKEN`
- Value: [Dein Firebase Token]
- Klicke "Add secret"

### Release erstellen

1. **Version in package.json erhöhen:**
```json
{
  "version": "1.4.7"  // ← Neue Version
}
```

2. **Commit und Push:**
```bash
git add package.json
git commit -m "Bump version to 1.4.7"
git push origin main
```

3. **GitHub Actions macht automatisch:**
   - ✅ Erkennt neue Version
   - ✅ Berechnet Hash
   - ✅ Fügt Hash zu Cloud Functions hinzu
   - ✅ Deployed Cloud Functions
   - ✅ Committed Änderungen

4. **Warte 2-3 Minuten**, dann:
```bash
git pull origin main
npm run build
npm run dist
```

5. **Release auf GitHub erstellen**

**Fertig! 🎉**

---

## 🔧 Manueller Prozess (Fallback)

Falls GitHub Actions nicht funktioniert:

### 1. Version erhöhen

In `package.json`:
```json
{
  "version": "1.4.7"
}
```

In `src/services/AnalyticsService.ts` (2 Stellen):
```typescript
appVersion: '1.4.7',  // Zeile ~155
const appVersion = '1.4.7'; // Zeile ~75
```

### 2. Hash berechnen

Öffne Node.js Console:
```bash
node
```

Dann:
```javascript
const crypto = require('crypto');
const version = '1.4.7';
const hash = crypto.createHash('sha256').update(version).digest('hex').substring(0, 16);
console.log(`Hash für v${version}: ${hash}`);
```

Kopiere den Hash.

### 3. Hash zu Cloud Functions hinzufügen

In `functions/index.js`:
```javascript
const VALID_CODE_HASHES = {
  '1.4.6': 'b8c5a2d1e3f4a5b6',
  '1.4.7': 'DEIN_HASH_HIER', // ← Hier einfügen
  // Neue Versionen hier hinzufügen
};
```

### 4. Cloud Functions deployen

```bash
firebase deploy --only functions:validateAnalytics
```

### 5. Build und Release

```bash
npm run build
npm run dist
```

### 6. Commit und Push

```bash
git add .
git commit -m "Release v1.4.7"
git push origin main
```

### 7. GitHub Release erstellen

---

## 📋 Release-Checkliste

### Vor dem Release

- [ ] Alle Tests laufen durch
- [ ] Changelog aktualisiert
- [ ] Version in package.json erhöht
- [ ] Version in AnalyticsService.ts aktualisiert (2 Stellen)
- [ ] Hash berechnet
- [ ] Hash zu Cloud Functions hinzugefügt
- [ ] Cloud Functions deployed
- [ ] Build erfolgreich (`npm run build`)

### Release

- [ ] GitHub Release erstellt
- [ ] Release Notes geschrieben
- [ ] Installer hochgeladen
- [ ] Discord-Announcement gepostet

### Nach dem Release

- [ ] Prüfe Analytics-Dashboard (keine "suspicious" User)
- [ ] Prüfe Cloud Functions Logs (`firebase functions:log`)
- [ ] Prüfe ob User updaten können
- [ ] Prüfe ob neue Version im Dashboard erscheint

---

## 🔍 Troubleshooting

### User werden als "suspicious" markiert

**Problem:** Hash stimmt nicht überein.

**Lösung:**
1. Prüfe Hash in Cloud Functions: `functions/index.js`
2. Prüfe Version in App: `src/services/AnalyticsService.ts`
3. Berechne Hash neu und deploye

### Cloud Functions Deployment schlägt fehl

**Problem:** Firebase Token abgelaufen.

**Lösung:**
```bash
firebase login:ci
# Neuen Token in GitHub Secrets eintragen
```

### GitHub Actions läuft nicht

**Problem:** Workflow ist deaktiviert.

**Lösung:**
1. Gehe zu: https://github.com/19bounty9317/StreamMatrix/actions
2. Wähle "Update Analytics Hash on Release"
3. Klicke "Enable workflow"

---

## 📊 Monitoring nach Release

### 1. Prüfe Cloud Functions Logs

```bash
firebase functions:log --only validateAnalytics
```

Suche nach:
- ✅ `Validierung abgeschlossen` - Alles OK
- ⚠️ `Unbekannte Version` - Hash fehlt
- 🚨 `Code-Manipulation erkannt` - Falscher Hash

### 2. Prüfe Analytics-Dashboard

Öffne: `docs/admin/index.html`

Prüfe:
- Keine "suspicious" User mit neuer Version
- "validHash" ist true für neue Version
- Neue Version erscheint in Statistiken

### 3. Prüfe User-Feedback

- Discord-Server
- GitHub Issues
- Analytics-Dashboard

---

## 🎯 Best Practices

### 1. Teste vor Release

```bash
# Lokaler Build
npm run build

# Teste die App
npm run dev

# Prüfe Analytics in Console (F12)
# Sollte sehen: "✅ Analytics gesendet"
```

### 2. Staged Rollout

Für große Updates:
1. Release als "Pre-release" auf GitHub
2. Teste mit kleiner User-Gruppe
3. Prüfe Analytics-Dashboard
4. Wenn alles OK: Veröffentliche als "Latest release"

### 3. Rollback-Plan

Falls etwas schief geht:
1. Alten Hash wieder hinzufügen zu Cloud Functions
2. Deploye Cloud Functions
3. User können alte Version weiter nutzen

---

## 🤖 Automatisierung (Zukünftig)

### Ideen für weitere Automatisierung:

1. **Auto-Release auf GitHub**
   - Bei Version-Bump automatisch Release erstellen
   - Changelog automatisch generieren

2. **Auto-Build**
   - Installer automatisch bauen
   - Zu GitHub Release hochladen

3. **Auto-Notification**
   - Discord-Announcement automatisch posten
   - User in App benachrichtigen

4. **Auto-Testing**
   - E2E-Tests vor Release
   - Analytics-Tests

---

## ✅ Zusammenfassung

**Automatischer Prozess:**
1. Version in `package.json` erhöhen
2. Push zu GitHub
3. GitHub Actions macht den Rest
4. Build und Release

**Manueller Prozess:**
1. Version erhöhen (package.json + AnalyticsService.ts)
2. Hash berechnen
3. Hash zu Cloud Functions hinzufügen
4. Cloud Functions deployen
5. Build und Release

**Beide Wege funktionieren - automatisch ist schneller und fehlerfreier! 🚀**
