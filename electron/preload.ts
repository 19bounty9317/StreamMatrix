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
  }
});
