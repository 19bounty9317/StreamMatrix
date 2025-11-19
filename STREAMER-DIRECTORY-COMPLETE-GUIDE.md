# 🎮 StreamMatrix Streamer Directory - Komplette Implementierung

## ✅ Was wurde bereits erstellt:

### 1. **Firestore Rules** (`firestore.rules`)
- ✅ Streamer Collection mit Read/Write Zugriff

### 2. **Cloud Functions** (`functions/index.js`)
- ✅ `updateStreamerStatus` - Läuft alle 5 Minuten, holt Twitch-Daten
- ✅ `cleanupInactiveStreamers` - Entfernt inaktive Streamer (täglich)
- ✅ `triggerStreamerUpdate` - Manueller Trigger für Testing

## 📋 Noch zu implementieren:

### 3. **App-Integration** (StreamerDirectoryService.ts)
### 4. **Settings-Integration** (Opt-In Checkbox)
### 5. **Website** (docs/streamer/index.html)

---

## 🚀 Schritt 3: App-Integration

### Datei: `src/services/StreamerDirectoryService.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { TwitchService } from './TwitchService';

// Firebase Config (gleiche wie in AnalyticsService)
const firebaseConfig = {
  apiKey: "AIzaSyBfXMEo8uKqH0gVwZ3QX7Y9J0K1L2M3N4O",
  authDomain: "streammatrix-analytics.firebaseapp.com",
  projectId: "streammatrix-analytics",
  storageBucket: "streammatrix-analytics.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

const app = initializeApp(firebaseConfig, 'streamer-directory');
const db = getFirestore(app);

export class StreamerDirectoryService {
  private static instance: StreamerDirectoryService;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isOptedIn: boolean = false;

  private constructor() {
    // Lade Opt-In Status
    const saved = localStorage.getItem('streamer-directory-opt-in');
    this.isOptedIn = saved === 'true';
  }

  static getInstance(): StreamerDirectoryService {
    if (!StreamerDirectoryService.instance) {
      StreamerDirectoryService.instance = new StreamerDirectoryService();
    }
    return StreamerDirectoryService.instance;
  }

  /**
   * Opt-In: Nutzer stimmt zu, im Verzeichnis angezeigt zu werden
   */
  async optIn(): Promise<void> {
    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) {
        throw new Error('Nicht eingeloggt');
      }

      // Speichere in Firestore
      await setDoc(doc(db, 'streamers', user.id), {
        userId: user.id,
        username: user.login,
        displayName: user.display_name,
        profileImageUrl: user.profile_image_url,
        consent: true,
        isLive: false,
        lastSeen: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Speichere lokal
      localStorage.setItem('streamer-directory-opt-in', 'true');
      this.isOptedIn = true;

      // Starte Heartbeat
      this.startHeartbeat();

      console.log('✅ Streamer Directory Opt-In erfolgreich');
    } catch (error) {
      console.error('❌ Fehler beim Opt-In:', error);
      throw error;
    }
  }

  /**
   * Opt-Out: Nutzer möchte nicht mehr im Verzeichnis sein
   */
  async optOut(): Promise<void> {
    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) {
        throw new Error('Nicht eingeloggt');
      }

      // Lösche aus Firestore
      await deleteDoc(doc(db, 'streamers', user.id));

      // Lösche lokal
      localStorage.removeItem('streamer-directory-opt-in');
      this.isOptedIn = false;

      // Stoppe Heartbeat
      this.stopHeartbeat();

      console.log('✅ Streamer Directory Opt-Out erfolgreich');
    } catch (error) {
      console.error('❌ Fehler beim Opt-Out:', error);
      throw error;
    }
  }

  /**
   * Heartbeat: Sendet alle 5 Minuten ein Update
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      return; // Bereits gestartet
    }

    // Sofort senden
    this.sendHeartbeat();

    // Dann alle 5 Minuten
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 5 * 60 * 1000); // 5 Minuten

    console.log('💓 Heartbeat gestartet');
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log('💔 Heartbeat gestoppt');
    }
  }

  private async sendHeartbeat(): Promise<void> {
    if (!this.isOptedIn) {
      return;
    }

    try {
      const user = TwitchService.getUserFromStorage();
      if (!user) {
        return;
      }

      // Update lastSeen
      await setDoc(doc(db, 'streamers', user.id), {
        lastSeen: Timestamp.now(),
        updatedAt: Timestamp.now()
      }, { merge: true });

      console.log('💓 Heartbeat gesendet');
    } catch (error) {
      console.error('❌ Fehler beim Heartbeat:', error);
    }
  }

  /**
   * Prüfe ob Nutzer opted-in ist
   */
  isOptedIn(): boolean {
    return this.isOptedIn;
  }

  /**
   * Initialisiere Service (beim App-Start)
   */
  initialize(): void {
    if (this.isOptedIn) {
      this.startHeartbeat();
      console.log('✅ Streamer Directory Service initialisiert');
    }
  }
}
```

---

## 🚀 Schritt 4: Settings-Integration

### In `src/components/Settings.tsx` hinzufügen:

```typescript
// Import hinzufügen
import { StreamerDirectoryService } from '../services/StreamerDirectoryService';

// State hinzufügen
const [streamerDirectoryOptIn, setStreamerDirectoryOptIn] = useState(() => {
  return StreamerDirectoryService.getInstance().isOptedIn();
});

// Handler hinzufügen
const handleStreamerDirectoryToggle = async (enabled: boolean) => {
  try {
    const service = StreamerDirectoryService.getInstance();
    
    if (enabled) {
      await service.optIn();
      setStreamerDirectoryOptIn(true);
      alert('✅ Du wirst jetzt im Streamer-Verzeichnis angezeigt!');
    } else {
      if (confirm('Möchtest du wirklich aus dem Streamer-Verzeichnis entfernt werden?')) {
        await service.optOut();
        setStreamerDirectoryOptIn(false);
        alert('✅ Du wurdest aus dem Streamer-Verzeichnis entfernt.');
      }
    }
  } catch (error) {
    console.error('Fehler:', error);
    alert('❌ Fehler beim Aktualisieren der Einstellung');
  }
};

// UI hinzufügen (nach Spenden-Sektion):
<div className="space-y-3">
  <h3 className="text-lg font-semibold theme-text">🎮 Streamer-Verzeichnis</h3>
  
  <div className="p-4 theme-tile-content-bg rounded space-y-3">
    <div className="text-sm theme-text-secondary leading-relaxed">
      <p className="mb-2">
        <strong className="theme-text">Zeige dich in der StreamMatrix-Community!</strong>
      </p>
      <p className="mb-2">
        Wenn aktiviert, erscheinst du auf <strong>streammatrix.de/streamer</strong> 
        und andere Nutzer können dich finden.
      </p>
      <p>
        Angezeigt werden: Kanal-Name, Profilbild, Live-Status, Stream-Titel & Kategorie.
      </p>
    </div>

    <label className="flex items-center justify-between p-3 theme-tile-content-bg rounded theme-button cursor-pointer">
      <span className="theme-text">Im Streamer-Verzeichnis anzeigen</span>
      <input
        type="checkbox"
        checked={streamerDirectoryOptIn}
        onChange={(e) => handleStreamerDirectoryToggle(e.target.checked)}
        className="w-5 h-5"
      />
    </label>

    <div className="text-xs theme-text-secondary">
      💡 Jederzeit widerrufbar! Deine Daten werden nach 30 Tagen Inaktivität automatisch gelöscht.
    </div>
  </div>
</div>
```

---

## 🚀 Schritt 5: Website erstellen

### Datei: `docs/streamer/index.html`

Aufgrund der Länge erstelle ich eine separate Datei dafür.

---

## 🔧 Firebase Setup:

### 1. Twitch Client Secret setzen:

```bash
firebase functions:config:set twitch.client_secret="DEIN_TWITCH_CLIENT_SECRET"
```

### 2. Functions deployen:

```bash
cd functions
npm install axios
cd ..
firebase deploy --only functions
```

### 3. Firestore Rules deployen:

```bash
firebase deploy --only firestore:rules
```

---

## 📝 Nächste Schritte:

1. ✅ **Cloud Functions** sind fertig
2. ⏳ **StreamerDirectoryService.ts** erstellen
3. ⏳ **Settings.tsx** erweitern
4. ⏳ **Website** erstellen (`docs/streamer/index.html`)
5. ⏳ **App.tsx** Service initialisieren
6. ⏳ **Testing**

---

Soll ich weitermachen mit den restlichen Dateien? 🚀
