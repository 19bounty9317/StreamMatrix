import axios from 'axios';

interface StreamQualityData {
  bitrate: number; // in bps
  fps: number;
  resolution: string;
  health: 'excellent' | 'good' | 'poor' | 'offline';
}

class StreamQualityService {
  private static instance: StreamQualityService;
  private accessToken: string = '';
  private clientId: string = '';
  private userId: string = '';
  private updateInterval: NodeJS.Timeout | null = null;
  private currentBitrate: number = 0;
  private currentQuality: StreamQualityData | null = null;
  private droppedFrames: number = 0;
  private totalFrames: number = 0;

  private constructor() {}

  static getInstance(): StreamQualityService {
    if (!StreamQualityService.instance) {
      StreamQualityService.instance = new StreamQualityService();
    }
    return StreamQualityService.instance;
  }

  initialize(accessToken: string, clientId: string, userId: string) {
    this.accessToken = accessToken;
    this.clientId = clientId;
    this.userId = userId;
  }

  async getStreamQuality(): Promise<StreamQualityData> {
    try {
      // Hole Stream-Informationen von Twitch API
      const response = await axios.get(
        `https://api.twitch.tv/helix/streams?user_id=${this.userId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Client-Id': this.clientId
          }
        }
      );

      if (response.data.data && response.data.data.length > 0) {
        const stream = response.data.data[0];
        
        // Schätze Bitrate basierend auf Auflösung und FPS
        // Twitch API gibt keine direkte Bitrate, daher schätzen wir
        const resolution = `${stream.width}x${stream.height}`;
        const estimatedBitrate = this.estimateBitrate(stream.width, stream.height);
        
        this.currentBitrate = estimatedBitrate;

        return {
          bitrate: estimatedBitrate,
          fps: 30, // Twitch API gibt keine FPS, Standard ist 30
          resolution: resolution,
          health: this.calculateHealth(estimatedBitrate)
        };
      }

      // Stream ist offline
      this.currentBitrate = 0;
      return {
        bitrate: 0,
        fps: 0,
        resolution: 'N/A',
        health: 'offline'
      };
    } catch (error) {
      console.error('Fehler beim Abrufen der Stream-Qualität:', error);
      return {
        bitrate: 0,
        fps: 0,
        resolution: 'N/A',
        health: 'offline'
      };
    }
  }

  private estimateBitrate(_width: number, height: number): number {
    // Schätze Bitrate basierend auf Auflösung
    // Twitch-Empfehlungen: https://stream.twitch.tv/encoding/
    if (height >= 1080) {
      return 6000000; // 6 Mbps für 1080p
    } else if (height >= 900) {
      return 4500000; // 4.5 Mbps für 900p
    } else if (height >= 720) {
      return 3000000; // 3 Mbps für 720p
    } else if (height >= 480) {
      return 1500000; // 1.5 Mbps für 480p
    } else {
      return 800000; // 0.8 Mbps für niedrigere Auflösungen
    }
  }

  private calculateHealth(bitrate: number): 'excellent' | 'good' | 'poor' | 'offline' {
    if (bitrate === 0) return 'offline';
    if (bitrate >= 4000000) return 'excellent'; // >= 4 Mbps
    if (bitrate >= 2500000) return 'good'; // >= 2.5 Mbps
    return 'poor'; // < 2.5 Mbps
  }

  getCurrentBitrate(): number {
    return this.currentBitrate;
  }

  getCurrentQuality() {
    return {
      bitrate: this.currentBitrate,
      fps: this.currentQuality?.fps || 30,
      resolution: this.currentQuality?.resolution || 'N/A',
      health: this.currentQuality?.health || 'offline',
      droppedFrames: this.droppedFrames,
      totalFrames: this.totalFrames,
      droppedFramesPercent: this.totalFrames > 0 ? (this.droppedFrames / this.totalFrames) * 100 : 0
    };
  }

  // Simuliere Frame-Drops (in echter Anwendung würde dies von OBS/Streaming-Software kommen)
  simulateFrameData() {
    // Erhöhe Total Frames (30 FPS = 30 Frames pro Sekunde)
    this.totalFrames += 30;
    
    // Simuliere gelegentliche Frame-Drops basierend auf Bitrate-Qualität
    if (this.currentBitrate > 0) {
      const dropChance = this.currentBitrate < 2500000 ? 0.05 : 0.01; // 5% bei schlechter Bitrate, 1% bei guter
      if (Math.random() < dropChance) {
        this.droppedFrames += Math.floor(Math.random() * 3) + 1; // 1-3 Frames droppen
      }
    }
  }

  startMonitoring(callback: (quality: StreamQualityData) => void) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Update alle 5 Sekunden
    this.updateInterval = setInterval(async () => {
      const quality = await this.getStreamQuality();
      this.currentQuality = quality;
      this.simulateFrameData(); // Simuliere Frame-Daten
      callback(quality);
    }, 5000);
    
    // Initiales Update
    this.getStreamQuality().then(quality => {
      this.currentQuality = quality;
      callback(quality);
    });
  }

  stopMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export default StreamQualityService;
