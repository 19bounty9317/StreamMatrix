import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  oauthCallback: (code: string) => ipcRenderer.invoke('oauth-callback', code),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  onOAuthToken: (callback: (token: string) => void) => {
    ipcRenderer.on('oauth-token', (event, token) => callback(token));
  },
  getSystemStats: () => ipcRenderer.invoke('get-system-stats'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateAvailable: (callback: (info: any) => void) => {
    ipcRenderer.on('update-available', (event, info) => callback(info));
  },
  onUpdateStatus: (callback: (status: any) => void) => {
    ipcRenderer.on('update-status', (event, status) => callback(status));
  },
  onOpenSettings: (callback: () => void) => {
    ipcRenderer.on('open-settings', () => callback());
  },
  onShowTutorial: (callback: () => void) => {
    ipcRenderer.on('show-tutorial', () => callback());
  },
  onTileWindowOpened: (callback: (windowId: string) => void) => {
    ipcRenderer.on('tile-window-opened', (event, windowId) => callback(windowId));
  },
  onTileWindowClosed: (callback: (windowId: string) => void) => {
    ipcRenderer.on('tile-window-closed', (event, windowId) => callback(windowId));
  },
  moveTile: (tileId: string, targetWindowId: string) => 
    ipcRenderer.invoke('move-tile', { tileId, targetWindowId }),
  onTileMoved: (callback: (data: { tileId: string; targetWindowId: string }) => void) => {
    ipcRenderer.on('tile-moved', (event, data) => callback(data));
  },
  getTilesOrder: () => ipcRenderer.invoke('get-tiles-order')
});
