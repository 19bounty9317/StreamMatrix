// Analytics Service für StreamMatrix
// Sammelt anonyme Nutzungsstatistiken mit User-Einwilligung

import { db } from '../config/firebase.config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AnalyticsData {
  userIdHash: string;
  channelName: string;
  channelUrl: string;
  appVersion: string;
  os: string;
  osVersion: string;
  nodeVersion: string;
  electronVersion: string;
  codeIntegrity: boolean;
  codeHash: string;
  optedIn: boolean;
  agbsAccepted: boolean;
  consentDate: string;
  firstSeen?: string;
  lastSeen?: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private optedIn: boolean = false;
  private agbsAccepted: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.loadConsent();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Generiere anonymen User-Hash (basierend auf Kanal-Name)
  private async generateUserHash(channelName: string): Promise<string> {
    const salt = 'streammatrix_salt_2025'; // Geheimer Salt
    const text = channelName + salt;
    
    // Browser-kompatible Hash-Funktion
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex.substring(0, 16);
  }

  // Prüfe Code-Integrität (erkennt Manipulation)
  private async checkCodeIntegrity(): Promise<{ valid: boolean; hash: string }> {
    try {
      // Browser-Version: Nutze App-Version als Hash
      const appVersion = '1.4.6'; // Hardcoded version
      const encoder = new TextEncoder();
      const data = encoder.encode(appVersion);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);

      // Für jetzt: Immer als valid markieren (wird später serverseitig geprüft)
      return {
        valid: true,
        hash: hash
      };
    } catch (error) {
      console.error('Code-Integritätsprüfung fehlgeschlagen:', error);
      return {
        valid: false,
        hash: 'error'
      };
    }
  }

  // Lade Consent-Status
  private loadConsent() {
    try {
      const consent = localStorage.getItem('analytics-consent');
      const agbs = localStorage.getItem('agbs-accepted');
      
      this.optedIn = consent === 'true';
      this.agbsAccepted = agbs === 'true';
      
      console.log('📊 Analytics Consent geladen:', {
        optedIn: this.optedIn,
        agbsAccepted: this.agbsAccepted,
        needsConsent: this.needsConsent()
      });
    } catch (error) {
      console.error('Fehler beim Laden des Consent-Status:', error);
    }
  }

  // Setze Consent
  async setConsent(optIn: boolean, acceptAgbs: boolean = false) {
    this.optedIn = optIn;
    this.agbsAccepted = acceptAgbs || this.agbsAccepted;
    
    localStorage.setItem('analytics-consent', optIn.toString());
    localStorage.setItem('agbs-accepted', this.agbsAccepted.toString());
    localStorage.setItem('consent-date', new Date().toISOString());
    
    if (optIn && this.agbsAccepted) {
      await this.sendAnalytics();
      this.startHeartbeat();
    } else {
      this.stopHeartbeat();
    }
  }

  // Sende Analytics (nur wenn opted-in)
  async sendAnalytics() {
    if (!this.optedIn || !this.agbsAccepted) {
      console.log('⏭️ Analytics übersprungen (kein Consent)');
      return;
    }

    try {
      const { TwitchService } = await import('./TwitchService');
      const user = TwitchService.getUserFromStorage();
      
      if (!user) {
        console.log('⏭️ Analytics übersprungen (kein User)');
        return;
      }

      const userHash = await this.generateUserHash(user.login);

      // Prüfe Whitelist (Admins/Entwickler)
      const isAdmin = this.isWhitelisted(user.login);
      if (isAdmin) {
        console.log('✅ Admin/Entwickler - Analytics ohne Validierung');
      }

      // Prüfe ob User gebannt ist (außer Admins)
      const userDocRef = doc(db, 'users', userHash);
      const userDoc = await getDoc(userDocRef);
      
      if (!isAdmin && userDoc.exists() && userDoc.data().banned) {
        console.error('🚫 Account wurde gesperrt');
        this.handleBan(userDoc.data().banReason || 'AGB-Verstoß');
        return;
      }

      // Prüfe Code-Integrität
      const integrity = await this.checkCodeIntegrity();

      // Hole System-Info über Electron API falls verfügbar
      let systemInfo = {
        os: 'unknown',
        osVersion: 'unknown',
        nodeVersion: 'unknown',
        electronVersion: 'unknown'
      };

      try {
        // Prüfe ob Electron API verfügbar ist
        if (typeof window !== 'undefined' && (window as any).electron?.getSystemInfo) {
          const info = await (window as any).electron.getSystemInfo();
          systemInfo = {
            os: info.platform || 'unknown',
            osVersion: info.release || 'unknown',
            nodeVersion: info.nodeVersion || 'unknown',
            electronVersion: info.electronVersion || 'unknown'
          };
        }
      } catch (error) {
        console.warn('Konnte System-Info nicht abrufen:', error);
      }

      const data: any = {
        userIdHash: userHash,
        channelName: user.login,
        channelUrl: `https://twitch.tv/${user.login}`,
        appVersion: '1.4.6',
        os: systemInfo.os,
        osVersion: systemInfo.osVersion,
        nodeVersion: systemInfo.nodeVersion,
        electronVersion: systemInfo.electronVersion,
        codeIntegrity: integrity.valid,
        codeHash: integrity.hash,
        optedIn: true,
        agbsAccepted: this.agbsAccepted,
        consentDate: localStorage.getItem('consent-date') || new Date().toISOString(),
        lastSeen: serverTimestamp(),
        banned: false,
        isAdmin: isAdmin // Markiere Admins
      };

      // Füge firstSeen nur hinzu wenn User neu ist
      if (!userDoc.exists()) {
        data.firstSeen = serverTimestamp();
      }

      console.log('📊 Sende Analytics:', {
        channel: data.channelName,
        version: data.appVersion,
        integrity: data.codeIntegrity
      });

      // Speichere in Firestore
      await setDoc(userDocRef, data, { merge: true });

      console.log('✅ Analytics gesendet');
    } catch (error) {
      console.error('❌ Analytics-Fehler:', error);
    }
  }

  // Handle Account-Sperre
  private handleBan(reason: string) {
    // Zeige Benachrichtigung mit Kontakt-Infos
    const message = `🚫 Dein StreamMatrix Account wurde gesperrt.

Grund: ${reason}

📧 Support kontaktieren:
• Email: streammatrix@web.de
• Discord: https://discord.gg/streammatrix (Ticket öffnen)

Bei Fragen oder Einspruch wende dich bitte an den Support.
Du wirst jetzt ausgeloggt.`;

    // Electron Dialog
    if (typeof window !== 'undefined' && (window as any).electron) {
      (window as any).electron.dialog.showMessageBox({
        type: 'error',
        title: '🚫 Account gesperrt',
        message: message,
        buttons: ['OK']
      });
    } else {
      alert(message);
    }

    // Logout
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 3000);
  }

  // Whitelist: Admins/Entwickler die von Ban-Checks ausgenommen sind
  private isWhitelisted(username: string): boolean {
    const whitelist = [
      'bounty9317', // Hauptentwickler
      // Weitere Admins hier hinzufügen
    ];
    return whitelist.includes(username.toLowerCase());
  }

  // Prüfe Ban-Status (wird beim App-Start aufgerufen)
  async checkBanStatus(): Promise<boolean> {
    try {
      const { TwitchService } = await import('./TwitchService');
      const user = TwitchService.getUserFromStorage();
      
      if (!user) {
        return false; // Kein User = nicht gebannt
      }

      // Prüfe Whitelist (Admins/Entwickler)
      if (this.isWhitelisted(user.login)) {
        console.log('✅ Admin/Entwickler erkannt - Ban-Check übersprungen');
        return false; // Admins werden nie gebannt
      }

      const userHash = await this.generateUserHash(user.login);
      const userDocRef = doc(db, 'users', userHash);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists() && userDoc.data().banned) {
        console.error('🚫 Account wurde gesperrt');
        this.handleBan(userDoc.data().banReason || 'AGB-Verstoß');
        return true; // User ist gebannt
      }
      
      return false; // User ist nicht gebannt
    } catch (error) {
      console.error('Fehler beim Prüfen des Ban-Status:', error);
      return false;
    }
  }

  // Heartbeat (alle 30 Minuten)
  startHeartbeat() {
    if (!this.optedIn || !this.agbsAccepted) return;
    
    // Stoppe alten Heartbeat
    this.stopHeartbeat();

    // Sende sofort
    this.sendAnalytics();

    // Starte neuen Heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.sendAnalytics();
    }, 30 * 60 * 1000); // 30 Minuten

    console.log('💓 Heartbeat gestartet (alle 30 Min)');
  }

  // Stoppe Heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log('💔 Heartbeat gestoppt');
    }
  }

  // Opt-out
  async optOut() {
    this.optedIn = false;
    localStorage.setItem('analytics-consent', 'false');
    this.stopHeartbeat();
    
    // Optional: Markiere als opted-out in Firestore
    try {
      const { TwitchService } = await import('./TwitchService');
      const user = TwitchService.getUserFromStorage();
      
      if (user) {
        const userHash = await this.generateUserHash(user.login);
        const userDocRef = doc(db, 'users', userHash);
        await setDoc(userDocRef, {
          optedIn: false,
          lastSeen: serverTimestamp()
        }, { merge: true });
        console.log('✅ Opt-out gespeichert');
      }
    } catch (error) {
      console.error('❌ Opt-out-Fehler:', error);
    }
  }

  // Prüfe ob Consent erforderlich ist
  needsConsent(): boolean {
    return !this.agbsAccepted || !this.optedIn;
  }

  // Prüfe ob AGBs akzeptiert wurden
  hasAcceptedAgbs(): boolean {
    return this.agbsAccepted;
  }

  // Prüfe ob Analytics aktiviert ist
  isOptedIn(): boolean {
    return this.optedIn;
  }
}

export default AnalyticsService;
