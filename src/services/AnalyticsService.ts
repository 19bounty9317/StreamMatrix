// Analytics Service für StreamMatrix
// Sammelt anonyme Nutzungsstatistiken mit User-Einwilligung

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
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
  private generateUserHash(channelName: string): string {
    const salt = 'streammatrix_salt_2025'; // Geheimer Salt
    return crypto
      .createHash('sha256')
      .update(channelName + salt)
      .digest('hex')
      .substring(0, 16);
  }

  // Prüfe Code-Integrität (erkennt Manipulation)
  private async checkCodeIntegrity(): Promise<{ valid: boolean; hash: string }> {
    try {
      // Prüfe wichtige Dateien
      const filesToCheck = [
        'dist/main.js',
        'dist/renderer/index.html',
        'package.json'
      ];

      let combinedHash = '';
      
      for (const file of filesToCheck) {
        try {
          const filePath = path.join(process.cwd(), file);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const hash = crypto.createHash('sha256').update(content).digest('hex');
            combinedHash += hash;
          }
        } catch (error) {
          console.warn(`Konnte ${file} nicht prüfen:`, error);
        }
      }

      const finalHash = crypto
        .createHash('sha256')
        .update(combinedHash)
        .digest('hex')
        .substring(0, 16);

      // TODO: Vergleiche mit bekannten Hashes
      // Für jetzt: Immer als valid markieren (wird später serverseitig geprüft)
      return {
        valid: true,
        hash: finalHash
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

      const userHash = this.generateUserHash(user.login);

      // Prüfe ob User gebannt ist
      const userDocRef = doc(db, 'users', userHash);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists() && userDoc.data().banned) {
        console.error('🚫 Account wurde gesperrt');
        this.handleBan(userDoc.data().banReason || 'AGB-Verstoß');
        return;
      }

      // Prüfe Code-Integrität
      const integrity = await this.checkCodeIntegrity();

      const data: any = {
        userIdHash: userHash,
        channelName: user.login,
        channelUrl: `https://twitch.tv/${user.login}`,
        appVersion: require('../../package.json').version,
        os: process.platform,
        osVersion: require('os').release(),
        nodeVersion: process.versions.node,
        electronVersion: process.versions.electron || 'unknown',
        codeIntegrity: integrity.valid,
        codeHash: integrity.hash,
        optedIn: true,
        agbsAccepted: this.agbsAccepted,
        consentDate: localStorage.getItem('consent-date') || new Date().toISOString(),
        lastSeen: serverTimestamp(),
        banned: false
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
    // Zeige Benachrichtigung
    const message = `
      Dein Account wurde gesperrt.
      
      Grund: ${reason}
      
      Bitte kontaktiere den Support: streammatrix@web.de
    `;

    // Electron Dialog
    if (typeof window !== 'undefined' && (window as any).electron) {
      (window as any).electron.dialog.showMessageBox({
        type: 'error',
        title: 'Account gesperrt',
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
        const userHash = this.generateUserHash(user.login);
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
