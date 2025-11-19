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
  private isOptedInFlag: boolean = false;

  private constructor() {
    // Lade Opt-In Status
    const saved = localStorage.getItem('streamer-directory-opt-in');
    this.isOptedInFlag = saved === 'true';
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

      console.log('📝 Registriere Streamer im Verzeichnis:', user.login);

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
      this.isOptedInFlag = true;

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

      console.log('🗑️ Entferne Streamer aus Verzeichnis:', user.login);

      // Lösche aus Firestore
      await deleteDoc(doc(db, 'streamers', user.id));

      // Lösche lokal
      localStorage.removeItem('streamer-directory-opt-in');
      this.isOptedInFlag = false;

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

    console.log('💓 Streamer Directory Heartbeat gestartet');
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log('💔 Streamer Directory Heartbeat gestoppt');
    }
  }

  private async sendHeartbeat(): Promise<void> {
    if (!this.isOptedInFlag) {
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

      console.log('💓 Streamer Directory Heartbeat gesendet');
    } catch (error) {
      console.error('❌ Fehler beim Heartbeat:', error);
    }
  }

  /**
   * Prüfe ob Nutzer opted-in ist
   */
  isOptedIn(): boolean {
    return this.isOptedInFlag;
  }

  /**
   * Initialisiere Service (beim App-Start)
   */
  initialize(): void {
    if (this.isOptedInFlag) {
      this.startHeartbeat();
      console.log('✅ Streamer Directory Service initialisiert (Opted-In)');
    } else {
      console.log('ℹ️ Streamer Directory Service initialisiert (Opted-Out)');
    }
  }

  /**
   * Cleanup beim App-Beenden
   */
  cleanup(): void {
    this.stopHeartbeat();
  }
}
