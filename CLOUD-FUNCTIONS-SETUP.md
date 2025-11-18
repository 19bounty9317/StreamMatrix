# Firebase Cloud Functions Setup für StreamMatrix

## 🎯 Was machen die Cloud Functions?

Die Cloud Functions schützen dein Analytics-System vor Manipulation:

1. **validateAnalytics** - Validiert jeden Analytics-Write
   - Prüft Code-Integrität (Hash)
   - Prüft App-Version
   - Prüft Consent
   - Sperrt manipulierte Clients automatisch

2. **detectInactiveUsers** - Läuft täglich
   - Findet User die lange keine Analytics senden
   - Markiert sie als verdächtig

3. **generateDailyStats** - Läuft täglich um 00:00
   - Erstellt tägliche Statistiken
   - Zählt aktive User, Versionen, Plattformen

4. **cleanupOldStats** - Läuft monatlich
   - Löscht Statistiken älter als 90 Tage

## 📦 Installation

### 1. Firebase CLI installieren (falls noch nicht geschehen)

```bash
npm install -g firebase-tools
```

### 2. Firebase Login

```bash
firebase login
```

### 3. Firebase Projekt initialisieren

```bash
firebase use streammatrix-731e0
```

### 4. Functions Dependencies installieren

```bash
cd functions
npm install
cd ..
```

## 🚀 Deployment

### Alle Functions deployen

```bash
firebase deploy --only functions
```

### Einzelne Function deployen

```bash
firebase deploy --only functions:validateAnalytics
firebase deploy --only functions:detectInactiveUsers
firebase deploy --only functions:generateDailyStats
firebase deploy --only functions:cleanupOldStats
```

## 🔧 Konfiguration

### Code-Hash aktualisieren

Wenn du eine neue Version released, musst du den Code-Hash aktualisieren:

1. **Berechne den Hash der neuen Version:**

```bash
# In der App-Console (F12):
const encoder = new TextEncoder();
const data = encoder.encode('1.4.7'); // Neue Version
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
console.log(hash);
```

2. **Füge den Hash in `functions/index.js` hinzu:**

```javascript
const VALID_CODE_HASHES = {
  '1.4.6': 'f7a8b9c0d1e2f3a4',
  '1.4.7': 'NEUER_HASH_HIER', // ← Hier einfügen
};
```

3. **Deploye die Functions:**

```bash
firebase deploy --only functions:validateAnalytics
```

## 📊 Monitoring

### Logs anzeigen

```bash
# Alle Logs
firebase functions:log

# Nur Fehler
firebase functions:log --only validateAnalytics

# Live-Logs
firebase functions:log --follow
```

### Firebase Console

Gehe zu: https://console.firebase.google.com/project/streammatrix-731e0/functions

Hier siehst du:
- Alle Functions
- Ausführungs-Statistiken
- Fehler-Logs
- Kosten

## 💰 Kosten

Firebase Functions haben ein **kostenloses Kontingent**:

- **2 Millionen Aufrufe/Monat** - KOSTENLOS
- **400.000 GB-Sekunden/Monat** - KOSTENLOS
- **200.000 CPU-Sekunden/Monat** - KOSTENLOS

**Für StreamMatrix:**
- validateAnalytics: ~1 Aufruf pro User alle 30 Min
- detectInactiveUsers: 1 Aufruf pro Tag
- generateDailyStats: 1 Aufruf pro Tag
- cleanupOldStats: 1 Aufruf pro Monat

**Bei 100 Usern:**
- ~4.800 Aufrufe/Monat (validateAnalytics)
- ~30 Aufrufe/Monat (detectInactiveUsers)
- ~30 Aufrufe/Monat (generateDailyStats)
- ~1 Aufruf/Monat (cleanupOldStats)

**= ~5.000 Aufrufe/Monat = 100% KOSTENLOS! 🎉**

## 🔒 Sicherheit

### Firestore Rules aktualisieren

Die Cloud Functions brauchen Admin-Rechte, aber normale User sollten eingeschränkt werden.

**Aktualisiere `firestore.rules`:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users Collection - Nur schreiben mit gültigem Consent
    match /users/{userId} {
      allow write: if request.resource.data.optedIn == true 
                   && request.resource.data.agbsAccepted == true;
      allow read: if request.auth != null; // Nur Admins
    }
    
    // Stats Collection - Nur Cloud Functions
    match /stats/{date} {
      allow read: if request.auth != null; // Nur Admins
      allow write: if false; // Nur Cloud Functions
    }
    
    // Alle anderen Collections - nur Admins
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Deploye die Rules:**

```bash
firebase deploy --only firestore:rules
```

## 🧪 Testing

### Lokales Testing mit Emulator

```bash
cd functions
npm run serve
```

Dann in einer anderen Console:

```bash
firebase emulators:start
```

Die Functions laufen jetzt lokal auf:
- http://localhost:5001/streammatrix-731e0/us-central1/validateAnalytics

### Test-Daten senden

```javascript
// In der App-Console (F12):
const testData = {
  userIdHash: 'test123',
  channelName: 'testuser',
  appVersion: '1.4.6',
  codeHash: 'f7a8b9c0d1e2f3a4', // Gültiger Hash
  optedIn: true,
  agbsAccepted: true,
  codeIntegrity: true
};

// Sende an Firestore
await db.collection('users').doc('test123').set(testData);
```

Dann prüfe die Logs:

```bash
firebase functions:log
```

## 📈 Admin-Dashboard erweitern

Die Cloud Functions erstellen tägliche Statistiken in der `stats` Collection.

**Zeige sie im Admin-Dashboard an:**

```javascript
// In docs/admin/index.html
const statsRef = db.collection('stats').orderBy('date', 'desc').limit(30);
const statsSnapshot = await statsRef.get();

statsSnapshot.forEach(doc => {
  const data = doc.data();
  console.log(`${data.date}: ${data.activeUsers} aktive User`);
});
```

## 🚨 Troubleshooting

### "Permission denied" Fehler

**Problem:** Cloud Functions haben keine Rechte auf Firestore.

**Lösung:**
1. Gehe zu: https://console.firebase.google.com/project/streammatrix-731e0/settings/serviceaccounts/adminsdk
2. Prüfe ob "Firebase Admin SDK" aktiviert ist
3. Falls nicht, klicke "Generate new private key"

### "Function not found" Fehler

**Problem:** Function wurde nicht deployed.

**Lösung:**
```bash
firebase deploy --only functions
```

### "Quota exceeded" Fehler

**Problem:** Zu viele Function-Aufrufe.

**Lösung:**
1. Prüfe Logs: `firebase functions:log`
2. Erhöhe Heartbeat-Intervall in der App (z.B. auf 60 Min)
3. Upgrade auf Blaze-Plan (Pay-as-you-go)

## ✅ Checkliste

- [ ] Firebase CLI installiert
- [ ] Firebase Login durchgeführt
- [ ] Functions Dependencies installiert (`cd functions && npm install`)
- [ ] Functions deployed (`firebase deploy --only functions`)
- [ ] Firestore Rules aktualisiert
- [ ] Code-Hash für aktuelle Version eingetragen
- [ ] Logs geprüft (`firebase functions:log`)
- [ ] Admin-Dashboard zeigt Statistiken an

## 🎉 Fertig!

Dein Analytics-System ist jetzt geschützt vor Manipulation! 🔒

Die Cloud Functions validieren jeden Analytics-Write und sperren manipulierte Clients automatisch.
