export interface IElectronAPI {
  oauthCallback: (code: string) => Promise<{ success: boolean; code: string }>;
  openExternal: (url: string) => Promise<{ success: boolean }>;
  onOAuthToken: (callback: (token: string) => void) => void;
  getSystemStats?: () => Promise<{ cpu: number; ram: number; gpu: number; bitrate: number }>;
}

declare global {
  interface Window {
    electron?: IElectronAPI;
  }
}

