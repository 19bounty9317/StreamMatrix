import axios from 'axios';

interface Emote {
  id: string;
  code: string;
  url: string;
  type: 'twitch' | 'bttv' | 'ffz' | '7tv';
}

export class EmoteService {
  private static instance: EmoteService;
  private emotes: Map<string, Emote> = new Map();
  private channelId: string = '';

  private constructor() {}

  static getInstance(): EmoteService {
    if (!EmoteService.instance) {
      EmoteService.instance = new EmoteService();
    }
    return EmoteService.instance;
  }

  async loadEmotes(channelId: string, channelName: string) {
    this.channelId = channelId;
    this.emotes.clear();

    await Promise.all([
      this.loadTwitchGlobalEmotes(),
      this.loadTwitchChannelEmotes(channelId),
      this.loadBTTVEmotes(channelId),
      this.loadFFZEmotes(channelId),
      this.load7TVEmotes(channelName)
    ]);

    console.log(`✅ ${this.emotes.size} Emotes geladen`);
  }

  private async loadTwitchGlobalEmotes() {
    try {
      const response = await axios.get('https://api.twitch.tv/helix/chat/emotes/global', {
        headers: {
          'Client-ID': localStorage.getItem('twitch_client_id') || '',
          'Authorization': `Bearer ${localStorage.getItem('twitch_token') || ''}`
        }
      });

      response.data.data.forEach((emote: any) => {
        this.emotes.set(emote.name, {
          id: emote.id,
          code: emote.name,
          url: emote.images.url_2x || emote.images.url_1x,
          type: 'twitch'
        });
      });

      console.log(`✅ ${response.data.data.length} Twitch Global Emotes geladen`);
    } catch (error) {
      console.error('❌ Fehler beim Laden von Twitch Global Emotes:', error);
    }
  }

  private async loadTwitchChannelEmotes(channelId: string) {
    try {
      const response = await axios.get(`https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${channelId}`, {
        headers: {
          'Client-ID': localStorage.getItem('twitch_client_id') || '',
          'Authorization': `Bearer ${localStorage.getItem('twitch_token') || ''}`
        }
      });

      response.data.data.forEach((emote: any) => {
        this.emotes.set(emote.name, {
          id: emote.id,
          code: emote.name,
          url: emote.images.url_2x || emote.images.url_1x,
          type: 'twitch'
        });
      });

      console.log(`✅ ${response.data.data.length} Twitch Channel Emotes geladen`);
    } catch (error) {
      console.error('❌ Fehler beim Laden von Twitch Channel Emotes:', error);
    }
  }

  private async loadBTTVEmotes(channelId: string) {
    try {
      // Global BTTV Emotes
      const globalResponse = await axios.get('https://api.betterttv.net/3/cached/emotes/global');
      globalResponse.data.forEach((emote: any) => {
        this.emotes.set(emote.code, {
          id: emote.id,
          code: emote.code,
          url: `https://cdn.betterttv.net/emote/${emote.id}/2x`,
          type: 'bttv'
        });
      });

      // Channel BTTV Emotes
      try {
        const channelResponse = await axios.get(`https://api.betterttv.net/3/cached/users/twitch/${channelId}`);
        channelResponse.data.channelEmotes?.forEach((emote: any) => {
          this.emotes.set(emote.code, {
            id: emote.id,
            code: emote.code,
            url: `https://cdn.betterttv.net/emote/${emote.id}/2x`,
            type: 'bttv'
          });
        });
        channelResponse.data.sharedEmotes?.forEach((emote: any) => {
          this.emotes.set(emote.code, {
            id: emote.id,
            code: emote.code,
            url: `https://cdn.betterttv.net/emote/${emote.id}/2x`,
            type: 'bttv'
          });
        });
      } catch (error) {
        // Channel hat keine BTTV Emotes
      }

      console.log('✅ BTTV Emotes geladen');
    } catch (error) {
      console.error('❌ Fehler beim Laden von BTTV Emotes:', error);
    }
  }

  private async loadFFZEmotes(channelId: string) {
    try {
      const response = await axios.get(`https://api.frankerfacez.com/v1/room/id/${channelId}`);
      const sets = response.data.sets;
      
      Object.values(sets).forEach((set: any) => {
        set.emoticons.forEach((emote: any) => {
          const url = emote.urls['2'] || emote.urls['1'];
          this.emotes.set(emote.name, {
            id: emote.id.toString(),
            code: emote.name,
            url: `https:${url}`,
            type: 'ffz'
          });
        });
      });

      console.log('✅ FFZ Emotes geladen');
    } catch (error) {
      console.error('❌ Fehler beim Laden von FFZ Emotes:', error);
    }
  }

  private async load7TVEmotes(channelName: string) {
    try {
      // Global 7TV Emotes
      const globalResponse = await axios.get('https://7tv.io/v3/emote-sets/global');
      globalResponse.data.emotes?.forEach((emote: any) => {
        const url = emote.data?.host?.url;
        if (url) {
          this.emotes.set(emote.name, {
            id: emote.id,
            code: emote.name,
            url: `https:${url}/2x.webp`,
            type: '7tv'
          });
        }
      });

      // Channel 7TV Emotes
      try {
        const channelResponse = await axios.get(`https://7tv.io/v3/users/twitch/${channelName.toLowerCase()}`);
        const emoteSet = channelResponse.data.emote_set;
        emoteSet?.emotes?.forEach((emote: any) => {
          const url = emote.data?.host?.url;
          if (url) {
            this.emotes.set(emote.name, {
              id: emote.id,
              code: emote.name,
              url: `https:${url}/2x.webp`,
              type: '7tv'
            });
          }
        });
      } catch (error) {
        // Channel hat keine 7TV Emotes
      }

      console.log('✅ 7TV Emotes geladen');
    } catch (error) {
      console.error('❌ Fehler beim Laden von 7TV Emotes:', error);
    }
  }

  parseMessageWithEmotes(message: string, emoteTags?: string): string {
    let html = message;

    // Parse Twitch IRC Emote Tags (aus Chat-Nachricht)
    if (emoteTags) {
      const emotePositions: Array<{ start: number; end: number; id: string }> = [];
      
      emoteTags.split('/').forEach(emoteData => {
        const [id, positions] = emoteData.split(':');
        positions.split(',').forEach(pos => {
          const [start, end] = pos.split('-').map(Number);
          emotePositions.push({ start, end, id });
        });
      });

      // Sortiere nach Position (rückwärts, damit Indizes stimmen)
      emotePositions.sort((a, b) => b.start - a.start);

      // Ersetze Emotes
      emotePositions.forEach(({ start, end, id }) => {
        const emoteCode = message.substring(start, end + 1);
        const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0`;
        html = html.substring(0, start) + 
               `<img src="${emoteUrl}" alt="${emoteCode}" class="inline-block h-7 mx-0.5 align-middle" title="${emoteCode}" />` + 
               html.substring(end + 1);
      });
    }

    // Parse Third-Party Emotes (BTTV, FFZ, 7TV)
    const words = html.split(' ');
    const parsedWords = words.map(word => {
      // Prüfe ob Wort ein Emote ist
      const emote = this.emotes.get(word);
      if (emote) {
        return `<img src="${emote.url}" alt="${emote.code}" class="inline-block h-7 mx-0.5 align-middle" title="${emote.code}" />`;
      }
      return word;
    });

    return parsedWords.join(' ');
  }

  getEmote(code: string): Emote | undefined {
    return this.emotes.get(code);
  }

  getAllEmotes(): Emote[] {
    return Array.from(this.emotes.values());
  }
}

export const emoteService = EmoteService.getInstance();
