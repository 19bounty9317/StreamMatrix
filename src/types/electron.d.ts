export interface IElectronAPI {
  oauthCallback: (code: string) => Promise<{ success: boolean; code: string }>;
  openExternal: (url: string) => Promise<{ success: boolean }>;
  onOAuthToken: (callback: (token: string) => void) => void;
  getSystemStats?: () => Promise<{ cpu: number; ram: number; gpu: number; bitrate: number }>;
  checkForUpdates?: () => Promise<{ success: boolean }>;
  onUpdateAvailable?: (callback: (info: any) => void) => void;
  onUpdateStatus?: (callback: (status: { status: string; message: string; progress?: number }) => void) => void;
}

declare global {
  interface Window {
    electron?: IElectronAPI;
  }
}

