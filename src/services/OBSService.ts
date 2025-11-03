/**
 * OBS WebSocket Service für Live-Preview
 * Verbindet sich mit OBS Studio über WebSocket
 * Dokumentation: https://github.com/obsproject/obs-websocket
 */

interface OBSConfig {
  host: string;
  port: number;
  password: string;
}

interface OBSStats {
  streaming: boolean;
  recording: boolean;
  fps: number;
  cpuUsage: number;
  memoryUsage: number;
  activeFps: number;
  droppedFrames: number;
  totalFrames: number;
  bitrate: number;
}

class OBSService {
  private static instance: OBSService;
  private ws: WebSocket | null = null;
  private config: OBSConfig | null = null;
  private isConnected: boolean = false;
  private statsCallback: ((stats: OBSStats) => void) | null = null;

  private constructor() {
    this.loadConfig();
    this.autoConnect();
  }

  private async autoConnect() {
    // Versuche automatisch zu verbinden wenn Config vorhanden
    if (this.config) {
      setTimeout(() => {
        this.connect().catch(err => {
          console.log('Auto-Connect zu OBS fehlgeschlagen:', err);
        });
      }, 2000); // 2 Sekunden Verzögerung beim Start
    }
  }

  static getInstance(): OBSService {
    if (!OBSService.instance) {
      OBSService.instance = new OBSService();
    }
    return OBSService.instance;
  }

  private loadConfig() {
    const saved = localStorage.getItem('obs-config');
    if (saved) {
      this.config = JSON.parse(saved);
    }
  }

  saveConfig(config: OBSConfig) {
    this.config = config;
    localStorage.setItem('obs-config', JSON.stringify(config));
  }

  getConfig(): OBSConfig | null {
    return this.config;
  }

  private connectResolve: ((value: boolean) => void) | null = null;

  async connect(host?: string, port?: number, password?: string): Promise<boolean> {
    // Verwende übergebene Parameter oder gespeicherte Config
    if (host && port !== undefined) {
      this.config = { host, port, password: password || '' };
      this.saveConfig(this.config);
    }

    if (!this.config) {
      console.error('OBS-Konfiguration fehlt');
      return false;
    }

    try {
      const wsUrl = `ws://${this.config.host}:${this.config.port}`;
      this.ws = new WebSocket(wsUrl);

      return new Promise((resolve) => {
        this.connectResolve = resolve;
        
        if (!this.ws) {
          resolve(false);
          return;
        }

        this.ws.onopen = () => {
          console.log('OBS WebSocket verbunden');
          // Warte auf Hello-Message (op: 0) für Authentifizierung
          // Die Authentifizierung erfolgt in handleMessage()
        };

        this.ws.onerror = (error) => {
          console.error('OBS WebSocket Fehler:', error);
          this.isConnected = false;
          if (this.ws) {
            this.ws.close();
            this.ws = null;
          }
          if (this.connectResolve) {
            this.connectResolve(false);
            this.connectResolve = null;
          }
        };

        this.ws.onclose = () => {
          console.log('OBS WebSocket getrennt');
          this.isConnected = false;
          if (this.connectResolve) {
            this.connectResolve(false);
            this.connectResolve = null;
          }
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

        // Timeout nach 5 Sekunden
        setTimeout(() => {
          if (this.connectResolve) {
            if (this.ws) {
              this.ws.close();
              this.ws = null;
            }
            this.connectResolve(false);
            this.connectResolve = null;
          }
        }, 5000);
      });
    } catch (error) {
      console.error('Fehler beim Verbinden zu OBS:', error);
      return false;
    }
  }

  private sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(message: any) {
    // Handle verschiedene OBS WebSocket Messages
    if (message.op === 0) {
      // Hello message - OBS sendet Authentifizierungs-Challenge
      console.log('OBS Hello:', message);
      
      // Wenn kein Passwort erforderlich ist, sende einfache Identify
      if (!message.d?.authentication) {
        this.sendMessage({
          op: 1, // Identify
          d: {
            rpcVersion: 1,
            eventSubscriptions: 33 // Subscribe to all events
          }
        });
      } else {
        // Authentifizierung mit Passwort erforderlich
        const challenge = message.d.authentication.challenge;
        const salt = message.d.authentication.salt;
        
        if (this.config?.password) {
          // Hash das Passwort mit SHA-256
          this.authenticateWithPassword(this.config.password, challenge, salt);
        } else {
          console.error('OBS benötigt ein Passwort, aber keins wurde angegeben');
          this.disconnect();
        }
      }
    } else if (message.op === 2) {
      // Identified - Erfolgreich authentifiziert
      console.log('✅ OBS Authenticated');
      this.isConnected = true;
      
      // Resolve das Connect-Promise
      if (this.connectResolve) {
        this.connectResolve(true);
        this.connectResolve = null;
      }
      
      this.startStatsPolling();
    } else if (message.op === 7) {
      // Request response
      this.handleResponse(message);
    } else if (message.op === 9) {
      // Close - OBS schließt die Verbindung
      console.log('❌ OBS Close:', message.d?.closeReason);
    }
  }

  private async authenticateWithPassword(password: string, challenge: string, salt: string) {
    try {
      // Encode password and salt
      const encoder = new TextEncoder();
      const passwordBytes = encoder.encode(password + salt);
      
      // Hash password + salt with SHA-256
      const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBytes);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const base64Secret = btoa(String.fromCharCode(...hashArray));
      
      // Hash secret + challenge
      const authBytes = encoder.encode(base64Secret + challenge);
      const authHashBuffer = await crypto.subtle.digest('SHA-256', authBytes);
      const authHashArray = Array.from(new Uint8Array(authHashBuffer));
      const authString = btoa(String.fromCharCode(...authHashArray));
      
      // Send Identify with authentication
      this.sendMessage({
        op: 1, // Identify
        d: {
          rpcVersion: 1,
          authentication: authString,
          eventSubscriptions: 33
        }
      });
    } catch (error) {
      console.error('Fehler bei der OBS-Authentifizierung:', error);
      this.disconnect();
    }
  }

  private handleResponse(message: any) {
    if (message.d?.requestType === 'GetStats') {
      const stats = message.d.responseData;
      
      if (this.statsCallback) {
        this.statsCallback({
          streaming: stats.outputActive || false,
          recording: stats.recordActive || false,
          fps: Math.round(stats.activeFps || 0),
          cpuUsage: Math.round(stats.cpuUsage || 0),
          memoryUsage: Math.round(stats.memoryUsage || 0),
          activeFps: Math.round(stats.activeFps || 0),
          droppedFrames: stats.outputSkippedFrames || 0,
          totalFrames: stats.outputTotalFrames || 0,
          bitrate: stats.outputBytes ? Math.round((stats.outputBytes * 8) / 1000) : 0 // Convert to Kbps
        });
      }
    }
  }

  private startStatsPolling() {
    // Fordere Stats alle 2 Sekunden an
    setInterval(() => {
      if (this.isConnected) {
        this.sendMessage({
          op: 6, // Request
          d: {
            requestType: 'GetStats',
            requestId: Date.now().toString()
          }
        });
      }
    }, 2000);
  }

  onStats(callback: (stats: OBSStats) => void) {
    this.statsCallback = callback;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  isConnectedToOBS(): boolean {
    return this.isConnected;
  }

  /**
   * Hole Screenshot von OBS (für Preview)
   */
  async getSourceScreenshot(sourceName: string = 'Program'): Promise<string | null> {
    if (!this.isConnected) return null;

    return new Promise((resolve) => {
      const requestId = Date.now().toString();
      
      const handler = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        if (message.op === 7 && message.d?.requestId === requestId) {
          this.ws?.removeEventListener('message', handler);
          resolve(message.d?.responseData?.imageData || null);
        }
      };

      this.ws?.addEventListener('message', handler);

      this.sendMessage({
        op: 6,
        d: {
          requestType: 'GetSourceScreenshot',
          requestId: requestId,
          requestData: {
            sourceName: sourceName,
            imageFormat: 'jpg',
            imageWidth: 1280,
            imageHeight: 720,
            imageCompressionQuality: 85
          }
        }
      });

      // Timeout nach 3 Sekunden
      setTimeout(() => {
        this.ws?.removeEventListener('message', handler);
        resolve(null);
      }, 3000);
    });
  }
}

export default OBSService;
