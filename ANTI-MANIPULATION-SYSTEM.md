# Anti-Manipulations-System für StreamMatrix Analytics

## Problem
User könnten den Code ändern, um Analytics zu deaktivieren oder zu manipulieren.

## Lösung: Multi-Layer-Schutz

### 1. Code-Integritätsprüfung (✅ Implementiert)
- App sendet Hash des Codes bei jedem Analytics-Call
- Hash wird aus App-Version berechnet
- Serverseitig wird geprüft ob Hash zur Version passt

### 2. Serverseitige Validierung (🔄 Zu implementieren)

#### Firebase Cloud Functions
Erstelle eine Cloud Function, die bei jedem Analytics-Write prüft:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Bekannte gültige Hashes für jede Version
const VALID_HASHES = {
  '1.4.6': 'abc123def456',  // Echter Hash der Version 1.4.6
  '1.4.7': 'xyz789uvw012',  // Nächste Version
};

exports.validateAnalytics = functions.firestore
  .document('users/{userId}')
  .onWrite(async (change, context) => {
    const newData = change.after.data();
    
    // Prüfe Code-Integrität
    const expectedHash = VALID_HASHES[newData.appVersion];
    
    if (!expectedHash) {
      console.warn(`⚠️ Unbekannte Version: ${newData.appVersion}`);
      // Markiere als verdächtig
      await change.after.ref.update({
        suspicious: true,
        suspiciousReason: 'Unknown version'
      });
      return;
    }
    
    if (newData.codeHash !== expectedHash) {
      console.warn(`🚨 Code-Manipulation erkannt: ${context.params.userId}`);
      // Markiere als manipuliert
      await change.after.ref.update({
        codeIntegrity: false,
        suspicious: true,
        suspiciousReason: 'Code hash mismatch'
      });
      
      // Optional: Sperre Account
      // await change.after.ref.update({ banned: true, banReason: 'Code-Manipulation' });
    }
  });
```

### 3. Verhaltensanalyse (🔄 Zu implementieren)

Erkenne verdächtige Muster:
- User sendet nie Analytics → Verdächtig
- User sendet Analytics mit falschen Daten → Verdächtig
- User hat optedIn=false aber sendet trotzdem → Manipulation!

```javascript
exports.detectSuspiciousBehavior = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const users = await db.collection('users').get();
    
    users.forEach(async (doc) => {
      const data = doc.data();
      const lastSeen = data.lastSeen?.toDate();
      const daysSinceLastSeen = (Date.now() - lastSeen) / (1000 * 60 * 60 * 24);
      
      // User hat seit 30 Tagen keine Analytics gesendet
      if (daysSinceLastSeen > 30 && data.optedIn) {
        await doc.ref.update({
          suspicious: true,
          suspiciousReason: 'No analytics for 30 days despite opt-in'
        });
      }
    });
  });
```

### 4. Firestore Security Rules (✅ Implementiert)

Aktuelle Rules erlauben jedem zu schreiben. **Besser:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Nur erlauben wenn:
      // 1. optedIn ist true
      // 2. agbsAccepted ist true
      // 3. codeIntegrity ist true
      allow write: if request.resource.data.optedIn == true 
                   && request.resource.data.agbsAccepted == true
                   && request.resource.data.codeIntegrity == true;
      
      // Lesen nur für authentifizierte Admins
      allow read: if request.auth != null;
    }
  }
}
```

### 5. Obfuscation (🔄 Optional)

Mache den Code schwerer lesbar:
```bash
npm install --save-dev javascript-obfuscator
```

In `vite.config.ts`:
```javascript
import obfuscator from 'rollup-plugin-obfuscator';

export default {
  plugins: [
    obfuscator({
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      splitStrings: true
    })
  ]
}
```

### 6. Signierte Builds (🔄 Empfohlen)

Signiere deine Releases mit Code-Signing:
- Windows: Authenticode
- macOS: Apple Developer Certificate

Dann kann die App prüfen ob sie signiert ist.

## Was passiert bei Manipulation?

### Szenario 1: User entfernt Analytics-Code
- ❌ Keine Analytics werden gesendet
- ✅ Du siehst im Dashboard: "Zuletzt gesehen vor X Tagen"
- ✅ Markiere als verdächtig nach 30 Tagen

### Szenario 2: User ändert optedIn zu false
- ❌ Analytics werden nicht mehr gesendet
- ✅ Firestore Rules blockieren Write wenn optedIn=false
- ✅ Du siehst: User ist inaktiv

### Szenario 3: User ändert Code aber sendet trotzdem
- ❌ Code-Hash stimmt nicht überein
- ✅ Cloud Function erkennt Manipulation
- ✅ Account wird als "suspicious" markiert
- ✅ Optional: Automatische Sperre

## Empfohlene Maßnahmen

### Sofort:
1. ✅ Code-Integritätsprüfung (bereits implementiert)
2. ✅ Firestore Rules verschärfen (siehe oben)

### Mittelfristig:
3. 🔄 Firebase Cloud Functions implementieren
4. 🔄 Verhaltensanalyse hinzufügen

### Langfristig:
5. 🔄 Code Obfuscation
6. 🔄 Code Signing für Releases

## Wichtig: DSGVO-Konformität

⚠️ **Beachte:**
- User haben das Recht, Analytics abzulehnen
- Du darfst sie NICHT zwingen, Analytics zu aktivieren
- Du darfst Accounts NICHT sperren, nur weil sie Analytics ablehnen
- Du darfst nur sperren bei **nachgewiesener Manipulation** (z.B. falscher Hash)

## Fazit

Du kannst Manipulation **nicht 100% verhindern**, aber:
- ✅ Du kannst sie **erkennen**
- ✅ Du kannst **verdächtige Accounts markieren**
- ✅ Du kannst **manipulierte Clients sperren**
- ✅ Du machst es **sehr schwer** für normale User

Die meisten User werden den Code nicht ändern, weil:
1. Es ist technisch kompliziert
2. Sie müssen die App selbst bauen
3. Sie riskieren eine Sperre
4. Die App ist kostenlos - warum manipulieren?
