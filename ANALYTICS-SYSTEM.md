# 📊 Analytics-System für StreamMatrix (DSGVO-konform)

## ⚠️ Wichtige rechtliche Hinweise

### DSGVO-Anforderungen
- ✅ **Opt-in erforderlich** - User müssen aktiv zustimmen
- ✅ **Transparenz** - User müssen wissen was gesammelt wird
- ✅ **Widerrufbar** - User können jederzeit ablehnen
- ✅ **Datenschutzerklärung** - Muss aktualisiert werden
- ✅ **Datensparsamkeit** - Nur notwendige Daten sammeln

### Was erlaubt ist:
✅ Anonyme Nutzungsstatistiken (mit Einwilligung)
✅ Kanal-Name (mit Einwilligung)
✅ App-Version
✅ Fehler-Logs (anonymisiert)

### Was NICHT erlaubt ist:
❌ Tracking ohne Einwilligung
❌ Code-Manipulation-Erkennung ohne Einwilligung
❌ Account-Sperrung ohne Rechtsgrundlage
❌ Überwachung des User-Systems

---

## 🎯 Empfohlene Lösung: Opt-in Analytics

### Konzept
1. User wird beim ersten Start gefragt
2. Klare Erklärung was gesammelt wird
3. Freiwillige Teilnahme
4. Jederzeit widerrufbar

### Was gesammelt wird (mit Einwilligung):
- Twitch-Kanal-Name
- App-Version
- Betriebssystem
- Letzte Nutzung
- Fehler-Logs (anonymisiert)

### Was NICHT gesammelt wird:
- Passwörter
- Tokens
- Chat-Inhalte
- Persönliche Daten
- System-Informationen

---

## 🔧 Implementierung

### 1. Backend (Einfache Lösung)

#### Option A: Firebase (Kostenlos, einfach)
```javascript
// Firebase Realtime Database
{
  "users": {
    "user_id_hash": {
      "channelName": "ExampleStreamer",
      "channelUrl": "https://twitch.tv/examplestreamer",
      "appVersion": "1.4.6",
      "os": "Windows 11",
      "firstSeen": "2025-11-18T10:00:00Z",
      "lastSeen": "2025-11-18T15:30:00Z",
      "optedIn": true,
      "consentDate": "2025-11-18T10:00:00Z"
    }
  }
}
```

#### Option B: Supabase (Kostenlos, PostgreSQL)
```sql
CREATE TABLE analytics_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_hash TEXT UNIQUE NOT NULL,
  channel_name TEXT,
  channel_url TEXT,
  app_version TEXT,
  os TEXT,
  first_seen TIMESTAMP DEFAULT NOW(),
  last_seen TIMESTAMP DEFAULT NOW(),
  opted_in BOOLEAN DEFAULT false,
  consent_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Option C: Eigener Server (Node.js + MongoDB)
```javascript
// MongoDB Schema
const UserSchema = new mongoose.Schema({
  userIdHash: { type: String, unique: true, required: true },
  channelName: String,
  channelUrl: String,
  appVersion: String,
  os: String,
  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  optedIn: { type: Boolean, default: false },
  consentDate: Date
});
```

### 2. Frontend (Electron App)

#### Analytics Service
```typescript
// src/services/AnalyticsService.ts
import crypto from 'crypto';

interface AnalyticsData {
  userIdHash: string;
  channelName: string;
  channelUrl: string;
  appVersion: string;
  os: string;
  optedIn: boolean;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private apiUrl = 'https://your-backend.com/api/analytics';
  private optedIn: boolean = false;

  private constructor() {
    this.loadConsent();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Generiere anonymen User-Hash
  private generateUserHash(channelName: string): string {
    return crypto
      .createHash('sha256')
      .update(channelName + 'salt_string')
      .digest('hex')
      .substring(0, 16);
  }

  // Lade Consent-Status
  private loadConsent() {
    const consent = localStorage.getItem('analytics-consent');
    this.optedIn = consent === 'true';
  }

  // Setze Consent
  async setConsent(optIn: boolean) {
    this.optedIn = optIn;
    localStorage.setItem('analytics-consent', optIn.toString());
    
    if (optIn) {
      await this.sendAnalytics();
    }
  }

  // Sende Analytics (nur wenn opted-in)
  async sendAnalytics() {
    if (!this.optedIn) return;

    try {
      const { TwitchService } = await import('./TwitchService');
      const user = TwitchService.getUserFromStorage();
      
      if (!user) return;

      const data: AnalyticsData = {
        userIdHash: this.generateUserHash(user.login),
        channelName: user.login,
        channelUrl: `https://twitch.tv/${user.login}`,
        appVersion: '1.4.6',
        os: `${process.platform} ${process.arch}`,
        optedIn: true
      };

      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      console.log('✅ Analytics gesendet');
    } catch (error) {
      console.error('❌ Analytics-Fehler:', error);
    }
  }

  // Heartbeat (alle 30 Minuten)
  startHeartbeat() {
    if (!this.optedIn) return;

    setInterval(() => {
      this.sendAnalytics();
    }, 30 * 60 * 1000); // 30 Minuten
  }

  // Opt-out
  async optOut() {
    this.optedIn = false;
    localStorage.setItem('analytics-consent', 'false');
    
    // Optional: Lösche Daten vom Server
    try {
      const { TwitchService } = await import('./TwitchService');
      const user = TwitchService.getUserFromStorage();
      
      if (user) {
        const userHash = this.generateUserHash(user.login);
        await fetch(`${this.apiUrl}/${userHash}`, {
          method: 'DELETE'
        });
      }
    } catch (error) {
      console.error('❌ Opt-out-Fehler:', error);
    }
  }
}

export default AnalyticsService;
```

#### Consent-Dialog
```typescript
// src/components/AnalyticsConsent.tsx
import { useState } from 'react';
import AnalyticsService from '../services/AnalyticsService';

export default function AnalyticsConsent() {
  const [show, setShow] = useState(() => {
    return localStorage.getItem('analytics-consent') === null;
  });

  const handleAccept = async () => {
    await AnalyticsService.getInstance().setConsent(true);
    setShow(false);
  };

  const handleDecline = () => {
    AnalyticsService.getInstance().setConsent(false);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">📊 Anonyme Nutzungsstatistiken</h2>
        
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Möchtest du uns helfen, StreamMatrix zu verbessern?
        </p>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">Was wir sammeln:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Dein Twitch-Kanal-Name</li>
            <li>App-Version</li>
            <li>Betriebssystem</li>
            <li>Nutzungszeitpunkt</li>
          </ul>

          <p className="font-semibold mt-3 mb-2">Was wir NICHT sammeln:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Passwörter oder Tokens</li>
            <li>Chat-Inhalte</li>
            <li>Persönliche Daten</li>
            <li>System-Informationen</li>
          </ul>

          <p className="mt-3 text-xs">
            Du kannst deine Einwilligung jederzeit in den Einstellungen widerrufen.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            ✅ Ja, helfen
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            ❌ Nein, danke
          </button>
        </div>

        <a 
          href="https://streammatrix.de/datenschutz.html" 
          target="_blank"
          className="block text-center text-xs text-gray-500 mt-3 hover:underline"
        >
          Datenschutzerklärung lesen
        </a>
      </div>
    </div>
  );
}
```

### 3. Admin-Dashboard

#### Admin-Seite (Passwort-geschützt)
```html
<!-- docs/admin/index.html -->
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StreamMatrix Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #0E0E10;
            color: #EFEFF1;
            padding: 2rem;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: #18181B;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #9147FF;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #9147FF;
        }
        .stat-label {
            color: #ADADB8;
            font-size: 0.9rem;
        }
        .users-table {
            background: #18181B;
            border-radius: 8px;
            overflow: hidden;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #2C2C2E;
        }
        th {
            background: #1F1F23;
            font-weight: 600;
            color: #9147FF;
        }
        tr:hover {
            background: #1F1F23;
        }
        .channel-link {
            color: #9147FF;
            text-decoration: none;
        }
        .channel-link:hover {
            text-decoration: underline;
        }
        .login-form {
            max-width: 400px;
            margin: 10rem auto;
            background: #18181B;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #9147FF;
        }
        input {
            width: 100%;
            padding: 0.75rem;
            background: #0E0E10;
            border: 1px solid #2C2C2E;
            border-radius: 4px;
            color: #EFEFF1;
            margin-bottom: 1rem;
        }
        button {
            width: 100%;
            padding: 0.75rem;
            background: #9147FF;
            border: none;
            border-radius: 4px;
            color: white;
            font-weight: 600;
            cursor: pointer;
        }
        button:hover {
            background: #772CE8;
        }
        .logout-btn {
            background: #E74C3C;
            padding: 0.5rem 1rem;
            width: auto;
        }
        .filter-bar {
            margin-bottom: 1rem;
            display: flex;
            gap: 1rem;
        }
        .filter-bar input {
            flex: 1;
            margin: 0;
        }
    </style>
</head>
<body>
    <!-- Login Form -->
    <div id="login-form" class="login-form">
        <h1 style="margin-bottom: 1.5rem; text-align: center;">🔐 StreamMatrix Admin</h1>
        <input type="password" id="password" placeholder="Admin-Passwort" />
        <button onclick="login()">Login</button>
        <p id="error" style="color: #E74C3C; margin-top: 1rem; text-align: center; display: none;">
            Falsches Passwort!
        </p>
    </div>

    <!-- Admin Dashboard -->
    <div id="dashboard" style="display: none;">
        <div class="container">
            <div class="header">
                <h1>📊 StreamMatrix Analytics</h1>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>

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
                    <div class="stat-number" id="active-week">0</div>
                    <div class="stat-label">Aktiv diese Woche</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="opted-in">0</div>
                    <div class="stat-label">Opted-in</div>
                </div>
            </div>

            <!-- Filter -->
            <div class="filter-bar">
                <input type="text" id="search" placeholder="Suche nach Kanal-Name..." onkeyup="filterUsers()" />
            </div>

            <!-- Users Table -->
            <div class="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Kanal-Name</th>
                            <th>Kanal-Link</th>
                            <th>App-Version</th>
                            <th>OS</th>
                            <th>Erste Nutzung</th>
                            <th>Letzte Nutzung</th>
                        </tr>
                    </thead>
                    <tbody id="users-tbody">
                        <!-- Wird dynamisch gefüllt -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        const API_URL = 'https://your-backend.com/api/admin';
        const ADMIN_PASSWORD_HASH = 'dein_passwort_hash_hier'; // SHA-256 Hash

        let users = [];

        // Login
        async function login() {
            const password = document.getElementById('password').value;
            const hash = await sha256(password);

            if (hash === ADMIN_PASSWORD_HASH) {
                sessionStorage.setItem('admin-auth', 'true');
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
                loadData();
            } else {
                document.getElementById('error').style.display = 'block';
            }
        }

        // Logout
        function logout() {
            sessionStorage.removeItem('admin-auth');
            location.reload();
        }

        // SHA-256 Hash
        async function sha256(message) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Lade Daten
        async function loadData() {
            try {
                const response = await fetch(API_URL);
                users = await response.json();
                
                updateStats();
                renderUsers();
            } catch (error) {
                console.error('Fehler beim Laden:', error);
            }
        }

        // Update Stats
        function updateStats() {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            document.getElementById('total-users').textContent = users.length;
            
            const activeToday = users.filter(u => 
                new Date(u.lastSeen) >= today
            ).length;
            document.getElementById('active-today').textContent = activeToday;

            const activeWeek = users.filter(u => 
                new Date(u.lastSeen) >= weekAgo
            ).length;
            document.getElementById('active-week').textContent = activeWeek;

            const optedIn = users.filter(u => u.optedIn).length;
            document.getElementById('opted-in').textContent = optedIn;
        }

        // Render Users
        function renderUsers(filteredUsers = users) {
            const tbody = document.getElementById('users-tbody');
            tbody.innerHTML = '';

            filteredUsers.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.channelName}</td>
                    <td>
                        <a href="${user.channelUrl}" target="_blank" class="channel-link">
                            ${user.channelUrl}
                        </a>
                    </td>
                    <td>${user.appVersion}</td>
                    <td>${user.os}</td>
                    <td>${new Date(user.firstSeen).toLocaleDateString('de-DE')}</td>
                    <td>${new Date(user.lastSeen).toLocaleString('de-DE')}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Filter Users
        function filterUsers() {
            const search = document.getElementById('search').value.toLowerCase();
            const filtered = users.filter(u => 
                u.channelName.toLowerCase().includes(search)
            );
            renderUsers(filtered);
        }

        // Auto-refresh alle 5 Minuten
        setInterval(loadData, 5 * 60 * 1000);

        // Check Auth on load
        if (sessionStorage.getItem('admin-auth') === 'true') {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            loadData();
        }
    </script>
</body>
</html>
```

---

## 📝 Datenschutzerklärung aktualisieren

Füge hinzu:
```
## Analytics (Optional)

Mit deiner Einwilligung sammeln wir anonyme Nutzungsstatistiken:
- Twitch-Kanal-Name
- App-Version
- Betriebssystem
- Nutzungszeitpunkt

Diese Daten helfen uns, die App zu verbessern.

Du kannst deine Einwilligung jederzeit widerrufen:
Einstellungen → Datenschutz → Analytics deaktivieren

Deine Daten werden nicht an Dritte weitergegeben.
```

---

## ⚠️ Wichtig: Code-Manipulation-Erkennung

**Problem:** Code-Manipulation-Erkennung ist rechtlich problematisch!

**Warum:**
- Überwachung des User-Systems
- Keine Rechtsgrundlage für Account-Sperrung
- DSGVO-Verstoß

**Alternative:**
- Nutze Code-Obfuscation (erschwert Manipulation)
- Nutze Code-Signing (zeigt Manipulation an)
- Setze auf Community-Reporting

**Wenn du es trotzdem willst:**
- Muss in AGBs stehen
- User muss zustimmen
- Nur bei schweren Verstößen (z.B. Malware-Verbreitung)

---

## 🚀 Nächste Schritte

1. **Backend wählen** (Firebase, Supabase oder eigener Server)
2. **Analytics-Service implementieren**
3. **Consent-Dialog hinzufügen**
4. **Admin-Dashboard deployen**
5. **Datenschutzerklärung aktualisieren**
6. **Testen!**

---

**Möchtest du, dass ich das implementiere?**
