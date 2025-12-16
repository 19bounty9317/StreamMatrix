import { doc, setDoc, deleteDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { TwitchService } from './TwitchService';

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

      // Prüfe ob User live ist
      const streamInfo = await TwitchService.getStreamInfo(user.id);
      const isLive = streamInfo !== null && streamInfo !== undefined;

      // Update lastSeen und Live-Status
      await setDoc(doc(db, 'streamers', user.id), {
        isLive: isLive,
        lastSeen: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // Wenn live, speichere auch Stream-Info
        ...(isLive && {
          streamTitle: streamInfo.title,
          gameName: streamInfo.game_name,
          viewerCount: streamInfo.viewer_count,
          thumbnailUrl: streamInfo.thumbnail_url
        })
      }, { merge: true });

      console.log(`💓 Streamer Directory Heartbeat gesendet (Live: ${isLive})`);
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
  async initialize(): Promise<void> {
    if (this.isOptedInFlag) {
      // Prüfe ob Registrierung in neuer Firebase existiert
      try {
        const user = TwitchService.getUserFromStorage();
        if (user) {
          const docRef = doc(db, 'streamers', user.id);
          const docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            // Registrierung existiert nicht in neuer Firebase
            // Re-registriere automatisch
            console.log('🔄 Migriere Streamer Directory Registrierung...');
            await this.optIn();
          } else {
            // Registrierung existiert, starte Heartbeat
            this.startHeartbeat();
            console.log('✅ Streamer Directory Service initialisiert (Opted-In)');
          }
        }
      } catch (error) {
        console.error('❌ Fehler bei Initialisierung:', error);
        // Fallback: Starte Heartbeat trotzdem
        this.startHeartbeat();
      }
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
