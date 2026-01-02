export interface IElectronAPI {
  oauthCallback: (code: string) => Promise<{ success: boolean; code: string }>;
  openExternal: (url: string) => Promise<{ success: boolean }>;
  onOAuthToken: (callback: (token: string) => void) => void;
  getSystemStats?: () => Promise<{ cpu: number; ram: number; gpu: number; bitrate: number }>;
  checkForUpdates?: () => Promise<{ success: boolean }>;
  onUpdateAvailable?: (callback: (info: any) => void) => void;
  onUpdateStatus?: (callback: (status: { status: string; message: string; progress?: number }) => void) => void;
  onOpenSettings?: (callback: () => void) => void;
  onShowTutorial?: (callback: () => void) => void;
  onTileWindowOpened?: (callback: (windowId: string) => void) => void;
  onTileWindowClosed?: (callback: (windowId: string) => void) => void;
  moveTile?: (tileId: string, targetWindowId: string) => Promise<{ success: boolean }>;
  onTileMoved?: (callback: (data: { tileId: string; targetWindowId: string }) => void) => void;
  getTilesOrder?: () => Promise<{ tilesOrder: string | null }>;
  openUserModal?: (data: { username: string; userId?: string; userColor: string; messages: any[] }) => Promise<{ success: boolean }>;
  sendChatCommand?: (command: string) => Promise<{ success: boolean; error?: string }>;
  onExecuteChatCommand?: (callback: (command: string) => void) => void;
}

declare global {
  interface Window {
    electron?: IElectronAPI;
  }
}

