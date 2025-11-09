import { app, BrowserWindow, ipcMain, session, shell, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { startOAuthServer } from './oauth-server';
import { AppUpdater } from './updater';

let mainWindow: BrowserWindow | null = null;
let oauthServer: any = null;
let appUpdater: AppUpdater | null = null;
let tileWindows: Map<string, BrowserWindow> = new Map();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#0E0E10',
    title: 'StreamMatrix',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: true,
    titleBarStyle: 'default'
  });

  // Setze User-Agent damit Twitch die App als normalen Browser erkennt
  mainWindow.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  // CSP für Sicherheit - nur für unsere eigene App, nicht für Twitch-Seiten
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // Keine CSP für Twitch-Domains
    if (details.url.includes('twitch.tv')) {
      callback({ responseHeaders: details.responseHeaders });
      return;
    }
    
    // CSP nur für unsere App
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "connect-src 'self' https://api.twitch.tv https://id.twitch.tv wss://*.twitch.tv ws://localhost:* ws://127.0.0.1:*; " +
          "img-src 'self' data: https:; " +
          "frame-src 'self' https://player.twitch.tv https://embed.twitch.tv; " +
          "media-src 'self' https://*.twitch.tv;"
        ]
      }
    });
  });

  // Prüfe ob wir im Development-Modus sind
  // Wenn dist/renderer/index.html existiert, sind wir im Production-Modus
  const indexPath = path.join(__dirname, 'renderer', 'index.html');
  const fs = require('fs');
  const isDev = !fs.existsSync(indexPath);
  
  console.log('isDev:', isDev);
  console.log('indexPath:', indexPath);
  console.log('exists:', fs.existsSync(indexPath));
  
  if (isDev) {
    console.log('Loading development server...');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Production Build
    console.log('Loading production build...');
    const fileUrl = url.format({
      protocol: 'file',
      slashes: true,
      pathname: indexPath
    });
    
    console.log('Loading URL:', fileUrl);
    mainWindow.loadURL(fileUrl);
    // DevTools nur in Development, nicht in Production
  }

  // Tastenkombination für DevTools (Ctrl+Shift+I oder F12)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || 
        (input.control && input.shift && input.key === 'I')) {
      if (mainWindow?.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
      } else {
        mainWindow?.webContents.openDevTools();
      }
    }
  });

  // Injiziere Browser-API-Mocks für Twitch nach dem Laden
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.executeJavaScript(`
      // Mock userAgentData vollständig
      if (!navigator.userAgentData) {
        Object.defineProperty(navigator, 'userAgentData', {
          value: {
            brands: [
              { brand: 'Chromium', version: '120' },
              { brand: 'Google Chrome', version: '120' }
            ],
            mobile: false,
            platform: 'Windows',
            getHighEntropyValues: async (hints) => {
              return {
                brands: [
                  { brand: 'Chromium', version: '120' },
                  { brand: 'Google Chrome', version: '120' }
                ],
                mobile: false,
                platform: 'Windows',
                architecture: 'x86',
                bitness: '64',
                model: '',
                platformVersion: '10.0.0',
                uaFullVersion: '120.0.0.0'
              };
            }
          },
          writable: false,
          configurable: true
        });
      }
    `);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Erstelle Menüleiste
  createMenu();

  // Erlaube Navigation zu Twitch OAuth
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Erlaube Twitch OAuth URLs
    if (url.startsWith('https://id.twitch.tv/oauth2/authorize') || 
        url.startsWith('https://www.twitch.tv/') ||
        url.startsWith('http://localhost:3000/auth/callback')) {
      // Navigation erlauben
      return;
    }
  });

  // Erlaube neue Fenster für OAuth
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Erlaube nur Twitch OAuth URLs
    if (url.startsWith('https://id.twitch.tv/oauth2/authorize')) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 500,
          height: 700,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
          }
        }
      };
    }
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  
  // Initialisiere Auto-Updater nach 3 Sekunden (damit die App erst lädt)
  setTimeout(() => {
    if (mainWindow) {
      appUpdater = new AppUpdater(mainWindow);
    }
  }, 3000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// OAuth2 Callback Handler
ipcMain.handle('oauth-callback', async (event, code: string) => {
  return { success: true, code };
});

// Öffne URL im Standard-Browser
ipcMain.handle('open-external', async (event, url: string) => {
  // Starte OAuth Server wenn noch nicht gestartet
  if (!oauthServer) {
    oauthServer = startOAuthServer((token: string) => {
      // Sende Token an Renderer
      mainWindow?.webContents.send('oauth-token', token);
    });
  }
  
  await shell.openExternal(url);
  return { success: true };
});

// Kachel zwischen Fenstern verschieben
ipcMain.handle('move-tile', async (event, data: { tileId: string; targetWindowId: string }) => {
  console.log('📦 IPC: move-tile', data);
  
  // Benachrichtige alle Fenster über die Änderung
  if (mainWindow) {
    mainWindow.webContents.send('tile-moved', data);
  }
  tileWindows.forEach(win => {
    if (win && !win.isDestroyed()) {
      win.webContents.send('tile-moved', data);
    }
  });
  
  return { success: true };
});

// Hole Kachel-Definitionen vom Hauptfenster
ipcMain.handle('get-tiles-order', async () => {
  console.log('📡 IPC: get-tiles-order aufgerufen');
  if (mainWindow && !mainWindow.isDestroyed()) {
    try {
      // Warte kurz, damit das Hauptfenster Zeit hat zu laden
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const tilesOrder = await mainWindow.webContents.executeJavaScript(
        'localStorage.getItem("tiles-order")'
      );
      console.log('📦 IPC: tiles-order vom Hauptfenster:', tilesOrder ? `${tilesOrder.substring(0, 50)}...` : 'null');
      
      if (!tilesOrder) {
        console.log('⚠️ IPC: tiles-order ist null, versuche aus userData zu laden');
        // Fallback: Lade aus userData-Verzeichnis
        const { app } = require('electron');
        const fs = require('fs');
        const path = require('path');
        const userDataPath = app.getPath('userData');
        const settingsPath = path.join(userDataPath, 'tiles-order.json');
        
        if (fs.existsSync(settingsPath)) {
          const data = fs.readFileSync(settingsPath, 'utf-8');
          console.log('✅ IPC: tiles-order aus userData geladen');
          return { tilesOrder: data };
        }
      }
      
      return { tilesOrder };
    } catch (error) {
      console.error('❌ IPC: Fehler beim Abrufen von tiles-order:', error);
      return { tilesOrder: null };
    }
  }
  console.log('⚠️ IPC: Hauptfenster nicht verfügbar');
  return { tilesOrder: null };
});

// System-Stats mit Windows Performance Counter
let lastCpuInfo: { idle: number; total: number } | null = null;
let cachedStats = { cpu: 0, ram: 0, gpu: 0 };
let lastStatsUpdate = 0;
const STATS_CACHE_MS = 1000; // Cache für 1 Sekunde

async function getSystemCpuUsage(): Promise<number> {
  try {
    const os = require('os');
    const cpus = os.cpus();
    
    // Berechne CPU-Zeiten
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach((cpu: any) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
    
    const currentIdle = totalIdle;
    const currentTotal = totalTick;
    
    // Wenn wir vorherige Werte haben, berechne die Differenz
    if (lastCpuInfo) {
      const idleDiff = currentIdle - lastCpuInfo.idle;
      const totalDiff = currentTotal - lastCpuInfo.total;
      const usage = 100 - ~~(100 * idleDiff / totalDiff);
      
      lastCpuInfo = { idle: currentIdle, total: currentTotal };
      return Math.min(Math.max(usage, 0), 100);
    }
    
    // Erste Messung - speichere für nächstes Mal
    lastCpuInfo = { idle: currentIdle, total: currentTotal };
    return 0;
  } catch {
    return 0;
  }
}

async function getSystemGpuUsage(): Promise<number> {
  if (process.platform === 'win32') {
    try {
      const { exec } = require('child_process');
      return new Promise((resolve) => {
        // Versuche nvidia-smi zuerst (schneller und genauer für NVIDIA)
        exec('nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits', { timeout: 800 }, (err1: any, out1: string) => {
          if (!err1 && out1) {
            const usage = parseInt(out1.trim());
            if (!isNaN(usage)) {
              resolve(Math.min(usage, 100));
              return;
            }
          }
          
          // Fallback: Windows Performance Counter
          const psCommand = `try { $c = Get-Counter '\\GPU Engine(*engtype_3D)\\Utilization Percentage' -EA Stop; [Math]::Round(($c.CounterSamples | Measure -Property CookedValue -Maximum).Maximum, 0) } catch { 0 }`;
          
          exec(`powershell -NoProfile -Command "${psCommand}"`, { timeout: 800 }, (err2: any, out2: string) => {
            if (!err2 && out2) {
              const usage = parseInt(out2.trim());
              resolve(isNaN(usage) ? 0 : Math.min(usage, 100));
            } else {
              resolve(0);
            }
          });
        });
      });
    } catch {
      return 0;
    }
  }
  return 0;
}

function createMenu() {
  const template: any = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Einstellungen',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow?.webContents.send('open-settings');
          }
        },
        { type: 'separator' },
        {
          label: 'Beenden',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Rückgängig' },
        { role: 'redo', label: 'Wiederholen' },
        { type: 'separator' },
        { role: 'cut', label: 'Ausschneiden' },
        { role: 'copy', label: 'Kopieren' },
        { role: 'paste', label: 'Einfügen' },
        { role: 'selectAll', label: 'Alles auswählen' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Neu laden' },
        { role: 'forceReload', label: 'Erzwungenes Neuladen' },
        { role: 'toggleDevTools', label: 'Entwicklertools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom zurücksetzen' },
        { role: 'zoomIn', label: 'Vergrößern' },
        { role: 'zoomOut', label: 'Verkleinern' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Vollbild' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Neues Kachel-Fenster',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            createTileWindow();
          }
        },
        { type: 'separator' },
        { role: 'minimize', label: 'Minimieren' },
        { role: 'close', label: 'Schließen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Tutorial',
          click: () => {
            mainWindow?.webContents.send('show-tutorial');
          }
        },
        {
          label: 'Über StreamMatrix',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow!, {
              type: 'info',
              title: 'Über StreamMatrix',
              message: 'StreamMatrix',
              detail: `Version: ${app.getVersion()}\n\nEin Dashboard für Twitch-Streamer\n\n© 2024 StreamMatrix`
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function createTileWindow() {
  const windowId = `tile-window-${Date.now()}`;
  
  const tileWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0E0E10',
    title: 'Kachel-Fenster',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: true,
    titleBarStyle: 'default'
  });

  tileWindows.set(windowId, tileWindow);

  // Hole tiles-order vom Hauptfenster BEVOR wir das Fenster laden
  let tilesOrderData = null;
  if (mainWindow && !mainWindow.isDestroyed()) {
    try {
      tilesOrderData = await mainWindow.webContents.executeJavaScript(
        'localStorage.getItem("tiles-order")'
      );
      console.log('📦 Electron: tiles-order für neues Fenster:', tilesOrderData ? 'vorhanden' : 'null');
    } catch (error) {
      console.error('❌ Electron: Fehler beim Abrufen von tiles-order:', error);
    }
  }

  // Prüfe ob wir im Development-Modus sind
  const indexPath = path.join(__dirname, 'renderer', 'index.html');
  const fs = require('fs');
  const isDev = !fs.existsSync(indexPath);
  
  if (isDev) {
    // Prüfe welcher Port verwendet wird (5173 oder 5174)
    const port = process.env.VITE_PORT || '5173';
    await tileWindow.loadURL(`http://localhost:${port}/tile-window.html?windowId=${windowId}`);
  } else {
    const fileUrl = url.format({
      protocol: 'file',
      slashes: true,
      pathname: path.join(__dirname, 'renderer', 'tile-window.html')
    });
    await tileWindow.loadURL(`${fileUrl}?windowId=${windowId}`);
  }

  // NACH dem Laden: Setze tiles-order im localStorage des neuen Fensters
  if (tilesOrderData) {
    try {
      await tileWindow.webContents.executeJavaScript(
        `localStorage.setItem("tiles-order", ${JSON.stringify(tilesOrderData)})`
      );
      console.log('✅ Electron: tiles-order in neues Fenster kopiert');
    } catch (error) {
      console.error('❌ Electron: Fehler beim Setzen von tiles-order:', error);
    }
  }

  tileWindow.on('closed', () => {
    tileWindows.delete(windowId);
    mainWindow?.webContents.send('tile-window-closed', windowId);
  });

  // Sende Event an Hauptfenster
  mainWindow?.webContents.send('tile-window-opened', windowId);
}

// Manuell nach Updates suchen
ipcMain.handle('check-for-updates', async () => {
  if (appUpdater) {
    appUpdater.checkForUpdates();
    return { success: true };
  }
  return { success: false };
});

// System-Stats abrufen (Task Manager-kompatibel) mit Caching
ipcMain.handle('get-system-stats', async () => {
  const now = Date.now();
  
  // Verwende Cache wenn weniger als 1 Sekunde alt
  if (now - lastStatsUpdate < STATS_CACHE_MS) {
    return {
      ...cachedStats,
      bitrate: 0
    };
  }
  
  // Hole alle Stats parallel für bessere Performance
  const [cpuUsage, gpuUsage] = await Promise.all([
    getSystemCpuUsage(),
    getSystemGpuUsage()
  ]);
  
  // RAM-Auslastung (schnell, kein async nötig)
  const memInfo = process.getSystemMemoryInfo();
  const ramUsage = ((memInfo.total - memInfo.free) / memInfo.total) * 100;
  
  // Update Cache
  cachedStats = {
    cpu: cpuUsage,
    ram: Math.round(ramUsage),
    gpu: gpuUsage
  };
  lastStatsUpdate = now;
  
  return {
    ...cachedStats,
    bitrate: 0 // Bitrate wird vom Stream-Service berechnet
  };
});
