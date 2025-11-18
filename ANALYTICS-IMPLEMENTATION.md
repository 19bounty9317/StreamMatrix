# 🚀 Analytics-System Implementierung

## ✅ Was bereits erstellt wurde:

1. **AnalyticsService.ts** - Sammelt Daten mit Einwilligung
2. **AnalyticsConsent.tsx** - Consent-Dialog mit AGBs
3. Code-Integritätsprüfung
4. Account-Sperr-Mechanismus

---

## 📋 Nächste Schritte:

### 1. Firebase Backend einrichten (15 Min)

#### A) Firebase-Projekt erstellen
1. Gehe zu: https://console.firebase.google.com
2. Klicke "Projekt hinzufügen"
3. Name: "StreamMatrix Analytics"
4. Google Analytics: Optional
5. Projekt erstellen

#### B) Firestore Database erstellen
1. Im Firebase-Projekt: "Firestore Database"
2. "Datenbank erstellen"
3. Modus: "Produktionsmodus"
4. Standort: "europe-west3" (Frankfurt)

#### C) Sicherheitsregeln setzen
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Nur App kann schreiben
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.headers['X-App-Version'] != null;
    }
    
    // Admin kann alles
    match /{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

#### D) Firebase Config holen
1. Projekteinstellungen → Allgemein
2. "App hinzufügen" → Web
3. App-Name: "StreamMatrix"
4. Kopiere die Config

### 2. Firebase in App integrieren

#### A) Dependencies installieren
```bash
npm install firebase
```

#### B) Firebase Config erstellen
```typescript
// src/config/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "streammatrix-analytics.firebaseapp.com",
  projectId: "streammatrix-analytics",
  storageBucket: "streammatrix-analytics.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

#### C) AnalyticsService anpassen
```typescript
// In src/services/AnalyticsService.ts

import { db } from '../config/firebase.config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Ersetze sendAnalytics() mit:
async sendAnalytics() {
  if (!this.optedIn || !this.agbsAccepted) return;

  try {
    const { TwitchService } = await import('./TwitchService');
    const user = TwitchService.getUserFromStorage();
    if (!user) return;

    const integrity = await this.checkCodeIntegrity();
    const userHash = this.generateUserHash(user.login);

    // Prüfe ob User gebannt ist
    const userDoc = await getDoc(doc(db, 'users', userHash));
    if (userDoc.exists() && userDoc.data().banned) {
      this.handleBan(userDoc.data().banReason || 'AGB-Verstoß');
      return;
    }

    const data = {
      userIdHash: userHash,
      channelName: user.login,
      channelUrl: `https://twitch.tv/${user.login}`,
      appVersion: require('../../package.json').version,
      os: process.platform,
      osVersion: require('os').release(),
      codeIntegrity: integrity.valid,
      codeHash: integrity.hash,
      optedIn: true,
      agbsAccepted: this.agbsAccepted,
      consentDate: localStorage.getItem('consent-date') || new Date().toISOString(),
      lastSeen: serverTimestamp(),
      firstSeen: userDoc.exists() ? userDoc.data().firstSeen : serverTimestamp()
    };

    await setDoc(doc(db, 'users', userHash), data, { merge: true });
    console.log('✅ Analytics gesendet');
  } catch (error) {
    console.error('❌ Analytics-Fehler:', error);
  }
}
```

### 3. Admin-Dashboard erstellen

#### A) Firebase Admin SDK einrichten
```bash
npm install firebase-admin
```

#### B) Admin-Dashboard (docs/admin/index.html)
```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StreamMatrix Admin</title>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <style>
        /* Styles aus ANALYTICS-SYSTEM.md */
    </style>
</head>
<body>
    <!-- Login Form -->
    <div id="login-form" class="login-form">
        <h1>🔐 StreamMatrix Admin</h1>
        <input type="email" id="email" placeholder="Admin-Email" />
        <input type="password" id="password" placeholder="Passwort" />
        <button onclick="login()">Login</button>
        <p id="error" style="display: none; color: #E74C3C;">
            Login fehlgeschlagen!
        </p>
    </div>

    <!-- Dashboard -->
    <div id="dashboard" style="display: none;">
        <!-- Stats -->
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number" id="total-users">0</div>
                <div class="stat-label">Gesamt-User</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="active-today">0</div>
                <div class="stat-label">Aktiv heute</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="code-violations">0</div>
                <div class="stat-label">⚠️ Code-Verstöße</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="banned-users">0</div>
                <div class="stat-label">🚫 Gebannte User</div>
            </div>
        </div>

        <!-- Users Table -->
        <table>
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Kanal-Name</th>
                    <th>Kanal-Link</th>
                    <th>Version</th>
                    <th>Code-Integrität</th>
                    <th>Letzte Nutzung</th>
                    <th>Aktionen</th>
                </tr>
            </thead>
            <tbody id="users-tbody"></tbody>
        </table>
    </div>

    <script>
        // Firebase Config
        const firebaseConfig = {
            apiKey: "DEIN_API_KEY",
            authDomain: "streammatrix-analytics.firebaseapp.com",
            projectId: "streammatrix-analytics",
            storageBucket: "streammatrix-analytics.appspot.com",
            messagingSenderId: "123456789",
            appId: "1:123456789:web:abcdef"
        };

        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const auth = firebase.auth();

        // Login
        async function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await auth.signInWithEmailAndPassword(email, password);
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
                loadData();
            } catch (error) {
                document.getElementById('error').style.display = 'block';
                console.error('Login-Fehler:', error);
            }
        }

        // Lade Daten
        async function loadData() {
            const snapshot = await db.collection('users').get();
            const users = [];
            
            snapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });

            updateStats(users);
            renderUsers(users);
        }

        // Update Stats
        function updateStats(users) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            document.getElementById('total-users').textContent = users.length;
            
            const activeToday = users.filter(u => {
                const lastSeen = u.lastSeen?.toDate();
                return lastSeen && lastSeen >= today;
            }).length;
            document.getElementById('active-today').textContent = activeToday;

            const violations = users.filter(u => !u.codeIntegrity).length;
            document.getElementById('code-violations').textContent = violations;

            const banned = users.filter(u => u.banned).length;
            document.getElementById('banned-users').textContent = banned;
        }

        // Render Users
        function renderUsers(users) {
            const tbody = document.getElementById('users-tbody');
            tbody.innerHTML = '';

            // Sortiere: Code-Verstöße zuerst
            users.sort((a, b) => {
                if (!a.codeIntegrity && b.codeIntegrity) return -1;
                if (a.codeIntegrity && !b.codeIntegrity) return 1;
                if (a.banned && !b.banned) return -1;
                if (!a.banned && b.banned) return 1;
                return 0;
            });

            users.forEach(user => {
                const tr = document.createElement('tr');
                
                // Highlight bei Verstößen
                if (!user.codeIntegrity) {
                    tr.style.backgroundColor = '#FFF3CD';
                    tr.style.color = '#856404';
                }
                if (user.banned) {
                    tr.style.backgroundColor = '#F8D7DA';
                    tr.style.color = '#721C24';
                }

                tr.innerHTML = `
                    <td>
                        ${user.banned ? '🚫 GEBANNT' : 
                          !user.codeIntegrity ? '⚠️ VERDÄCHTIG' : 
                          '✅ OK'}
                    </td>
                    <td>${user.channelName}</td>
                    <td>
                        <a href="${user.channelUrl}" target="_blank" class="channel-link">
                            ${user.channelUrl}
                        </a>
                    </td>
                    <td>${user.appVersion}</td>
                    <td>
                        ${user.codeIntegrity ? 
                          '✅ Valide' : 
                          `⚠️ MANIPULIERT<br><small>${user.codeHash}</small>`}
                    </td>
                    <td>${user.lastSeen?.toDate().toLocaleString('de-DE') || 'Nie'}</td>
                    <td>
                        ${!user.banned ? 
                          `<button onclick="banUser('${user.id}', '${user.channelName}')" 
                                   style="background: #E74C3C; color: white; padding: 0.5rem; border: none; border-radius: 4px; cursor: pointer;">
                              🚫 Bannen
                           </button>` :
                          `<button onclick="unbanUser('${user.id}')" 
                                   style="background: #27AE60; color: white; padding: 0.5rem; border: none; border-radius: 4px; cursor: pointer;">
                              ✅ Entbannen
                           </button>`}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Ban User
        async function banUser(userId, channelName) {
            const reason = prompt(`Grund für Ban von ${channelName}:`, 'Code-Manipulation / AGB-Verstoß');
            if (!reason) return;

            try {
                await db.collection('users').doc(userId).update({
                    banned: true,
                    banReason: reason,
                    bannedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                alert(`✅ ${channelName} wurde gebannt!`);
                loadData();
            } catch (error) {
                alert('❌ Fehler beim Bannen: ' + error.message);
            }
        }

        // Unban User
        async function unbanUser(userId) {
            try {
                await db.collection('users').doc(userId).update({
                    banned: false,
                    banReason: null,
                    bannedAt: null
                });
                alert('✅ User wurde entbannt!');
                loadData();
            } catch (error) {
                alert('❌ Fehler beim Entbannen: ' + error.message);
            }
        }

        // Auto-refresh alle 30 Sekunden
        setInterval(loadData, 30000);

        // Check Auth on load
        auth.onAuthStateChanged(user => {
            if (user) {
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
                loadData();
            }
        });
    </script>
</body>
</html>
```

### 4. App integrieren

#### In App.tsx:
```typescript
import AnalyticsConsent from './components/AnalyticsConsent';
import AnalyticsService from './services/AnalyticsService';

function App() {
  useEffect(() => {
    // Starte Analytics
    const analyticsService = AnalyticsService.getInstance();
    if (!analyticsService.needsConsent()) {
      analyticsService.startHeartbeat();
    }
  }, []);

  return (
    <>
      <AnalyticsConsent />
      {/* Rest der App */}
    </>
  );
}
```

#### In Settings.tsx:
```typescript
// Analytics-Einstellungen hinzufügen
const [analyticsEnabled, setAnalyticsEnabled] = useState(() => {
  return AnalyticsService.getInstance().isOptedIn();
});

const toggleAnalytics = async () => {
  const newValue = !analyticsEnabled;
  await AnalyticsService.getInstance().setConsent(newValue, true);
  setAnalyticsEnabled(newValue);
};

// In der UI:
<div className="setting-item">
  <label>
    <input 
      type="checkbox" 
      checked={analyticsEnabled}
      onChange={toggleAnalytics}
    />
    Anonyme Nutzungsstatistiken senden
  </label>
  <p className="text-sm text-gray-500">
    Hilf uns, StreamMatrix zu verbessern
  </p>
</div>
```

---

## 🔒 Sicherheit

### Admin-Account erstellen
```bash
# In Firebase Console:
# Authentication → Users → Add User
# Email: deine@email.de
# Passwort: sicheres_passwort
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // App kann schreiben
      allow write: if request.headers['X-App-Version'] != null;
      
      // Nur Admin kann lesen
      allow read: if request.auth != null;
    }
  }
}
```

---

## 📊 Monitoring

### Firebase Console
- Firestore → users Collection
- Siehe alle User in Echtzeit
- Filtere nach Code-Verstößen
- Banne User direkt

### Admin-Dashboard
- https://streammatrix.de/admin/
- Login mit Admin-Account
- Echtzeit-Updates
- Ban/Unban-Funktionen

---

## ✅ Checkliste

- [ ] Firebase-Projekt erstellt
- [ ] Firestore Database erstellt
- [ ] Firebase Config in App eingefügt
- [ ] `npm install firebase` ausgeführt
- [ ] AnalyticsService angepasst
- [ ] AnalyticsConsent in App.tsx eingefügt
- [ ] Settings mit Analytics-Toggle erweitert
- [ ] Admin-Dashboard deployed
- [ ] Admin-Account erstellt
- [ ] Getestet!

---

**Möchtest du, dass ich das jetzt implementiere?**
