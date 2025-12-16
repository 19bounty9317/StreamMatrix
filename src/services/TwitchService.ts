import axios from 'axios';
import { TWITCH_CONFIG } from '../config/twitch.config';

const TWITCH_API_BASE = 'https://api.twitch.tv/helix';
const TOKEN_KEY = 'twitch_access_token';
const USER_INFO_KEY = 'twitch_user_info';

export class TwitchService {
  private static token: string | null = null;
  private static clientId: string = TWITCH_CONFIG.CLIENT_ID;
  private static cache: Map<string, { data: any; timestamp: number }> = new Map();
  private static CACHE_DURATION = 30000; // 30 Sekunden Cache

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem(TOKEN_KEY, token);
  }

  static getStoredToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  static clearToken() {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  }

  static getClientId(): string {
    return this.clientId;
  }

  static getUserFromStorage() {
    const userJson = localStorage.getItem(USER_INFO_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  static saveUserToStorage(user: any) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  }

  static async validateToken(): Promise<boolean> {
    try {
      const response = await axios.get('https://id.twitch.tv/oauth2/validate', {
        headers: {
          'Authorization': `OAuth ${this.token}`
        }
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  private static getCached(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private static setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static async getUserInfo(username?: string) {
    const cacheKey = username ? `userInfo_${username}` : 'userInfo';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const url = username 
      ? `${TWITCH_API_BASE}/users?login=${username}`
      : `${TWITCH_API_BASE}/users`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Client-Id': this.clientId
      }
    });
    const user = response.data.data[0];
    
    if (!username) {
      this.saveUserToStorage(user);
    }
    
    this.setCache(cacheKey, user);
    return user;
  }

  static async getFollowerCount(userId: string) {
    const cacheKey = `followers_${userId}`;
    const cached = this.getCached(cacheKey);
    if (cached !== null) return cached;

    const response = await axios.get(`${TWITCH_API_BASE}/channels/followers?broadcaster_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Client-Id': this.clientId
      }
    });
    const total = response.data.total;
    this.setCache(cacheKey, total);
    return total;
  }

  static async getSubscriberCount(userId: string) {
    try {
      const response = await axios.get(`${TWITCH_API_BASE}/subscriptions?broadcaster_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Client-Id': this.clientId
        }
      });
      return response.data.total;
    } catch {
      return 0; // Falls keine Partner/Affiliate
    }
  }

  static async getStreamInfo(userId: string) {
    const response = await axios.get(`${TWITCH_API_BASE}/streams?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Client-Id': this.clientId
      }
    });
    return response.data.data[0];
  }

  static async getChannelInfo(userId: string) {
    const response = await axios.get(`${TWITCH_API_BASE}/channels?broadcaster_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Client-Id': this.clientId
      }
    });
    return response.data.data[0];
  }

  static async updateChannelInfo(userId: string, data: { title?: string; game_id?: string }) {
    const response = await axios.patch(
      `${TWITCH_API_BASE}/channels?broadcaster_id=${userId}`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Client-Id': this.clientId,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  static async searchCategories(query: string) {
    const response = await axios.get(`${TWITCH_API_BASE}/search/categories?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Client-Id': this.clientId
      }
    });
    return response.data.data;
  }

  static async getChannelPointRedemptions(broadcasterId: string, status: 'UNFULFILLED' | 'FULFILLED' | 'CANCELED' = 'UNFULFILLED') {
    try {
      // Stille Abfrage - Logs nur bei echten Fehlern
      // EventSub übernimmt jetzt das Echtzeit-Tracking
      
      // Schritt 1: Lade alle Custom Rewards
      const rewards = await this.getCustomRewards(broadcasterId);
      
      if (rewards.length === 0) {
        return [];
      }
      
      // Schritt 2: Lade Redemptions für jeden Reward
      const allRedemptions: any[] = [];
      
      for (const reward of rewards) {
        try {
          const response = await axios.get(
            `${TWITCH_API_BASE}/channel_points/custom_rewards/redemptions?broadcaster_id=${broadcasterId}&reward_id=${reward.id}&status=${status}&first=50`,
            {
              headers: {
                'Authorization': `Bearer ${this.token}`,
                'Client-Id': this.clientId
              }
            }
          );
          
          const redemptions = response.data.data || [];
          allRedemptions.push(...redemptions);
        } catch (err: any) {
          // Ignoriere 403 Fehler still - das ist erwartet
          // EventSub liefert die Daten in Echtzeit
        }
      }
      
      // Sortiere nach Datum (neueste zuerst)
      return allRedemptions.sort((a: any, b: any) => 
        new Date(b.redeemed_at).getTime() - new Date(a.redeemed_at).getTime()
      );
    } catch (err: any) {
      // Nur echte Fehler loggen (nicht 403)
      if (!err.response || err.response.status !== 403) {
        console.error('❌ Fehler beim Laden der Redemptions:', err);
      }
      throw err;
    }
  }

  static async updateRedemptionStatus(
    broadcasterId: string,
    rewardId: string,
    redemptionId: string,
    status: 'FULFILLED' | 'CANCELED'
  ) {
    const response = await axios.patch(
      `${TWITCH_API_BASE}/channel_points/custom_rewards/redemptions?broadcaster_id=${broadcasterId}&reward_id=${rewardId}&id=${redemptionId}`,
      { status },
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Client-Id': this.clientId,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.data[0];
  }

  static async getCustomRewards(broadcasterId: string) {
    const response = await axios.get(
      `${TWITCH_API_BASE}/channel_points/custom_rewards?broadcaster_id=${broadcasterId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Client-Id': this.clientId
        }
      }
    );
    return response.data.data;
  }

  static async getRecentFollowers(broadcasterId: string, first: number = 20) {
    const response = await axios.get(
      `${TWITCH_API_BASE}/channels/followers?broadcaster_id=${broadcasterId}&first=${first}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Client-Id': this.clientId
        }
      }
    );
    return response.data.data;
  }

  static async getBitsLeaderboard(broadcasterId: string, period: string = 'all') {
    try {
      const response = await axios.get(
        `${TWITCH_API_BASE}/bits/leaderboard?user_id=${broadcasterId}&period=${period}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Client-Id': this.clientId
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Fehler beim Laden der Bits-Leaderboard:', error);
      return { data: [] };
    }
  }

  static async getHypeTrainEvents(broadcasterId: string) {
    try {
      const response = await axios.get(
        `${TWITCH_API_BASE}/hypetrain/events?broadcaster_id=${broadcasterId}&first=1`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Client-Id': this.clientId
          }
        }
      );
      return response.data.data[0];
    } catch (error) {
      console.error('Fehler beim Laden des Hype Trains:', error);
      return null;
    }
  }

  static async startRaid(fromBroadcasterId: string, toBroadcasterId: string) {
    try {
      const response = await axios.post(
        `${TWITCH_API_BASE}/raids?from_broadcaster_id=${fromBroadcasterId}&to_broadcaster_id=${toBroadcasterId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Client-Id': this.clientId
          }
        }
      );
      console.log('✅ Raid erfolgreich gestartet:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Fehler beim Starten des Raids:', error.response?.data || error.message);
      throw error;
    }
  }
}
