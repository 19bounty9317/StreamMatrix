import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog, app } from 'electron';

export class AppUpdater {
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.setupAutoUpdater();
  }

  private setupAutoUpdater() {
    // Prüfe ob wir in einem gepackten Build sind
    const isDev = !app.isPackaged;
    
    if (isDev) {
      console.log('⚠️ Auto-Update ist im Development-Modus deaktiviert');
      console.log('💡 Installiere die App mit dem Installer um Updates zu testen');
      return;
    }

    console.log('🔄 Auto-Update aktiviert');
    console.log('📦 Repository: 19bounty9317/StreamMatrix');
    console.log('📍 App-Version:', app.getVersion());

    // GitHub Repository für Updates
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: '19bounty9317',
      repo: 'StreamMatrix'
    });

    // Logging aktivieren
    autoUpdater.logger = console;
    
    // Deaktiviere Auto-Download für bessere Kontrolle
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    // Automatisch nach Updates suchen (alle 10 Minuten)
    console.log('🔍 Erste Update-Prüfung...');
    autoUpdater.checkForUpdatesAndNotify();
    
    setInterval(() => {
      console.log('🔍 Automatische Update-Prüfung...');
      autoUpdater.checkForUpdatesAndNotify();
    }, 10 * 60 * 1000);

    // Update verfügbar
    autoUpdater.on('update-available', (info) => {
      console.log('✅ Update verfügbar:', info.version);
      this.mainWindow.webContents.send('update-available', info);
      this.mainWindow.webContents.send('update-status', {
        status: 'available',
        message: `Update ${info.version} verfügbar! Download startet...`
      });
    });

    // Kein Update verfügbar
    autoUpdater.on('update-not-available', (info) => {
      console.log('✅ Keine Updates verfügbar');
      this.mainWindow.webContents.send('update-status', {
        status: 'not-available',
        message: 'Du bist auf dem neuesten Stand!'
      });
    });

    // Update wird heruntergeladen
    autoUpdater.on('download-progress', (progress) => {
      const percent = Math.round(progress.percent);
      console.log(`📥 Download: ${percent}%`);
      this.mainWindow.webContents.send('update-status', {
        status: 'downloading',
        message: `Update wird heruntergeladen: ${percent}%`,
        progress: percent
      });
    });

    // Update heruntergeladen
    autoUpdater.on('update-downloaded', (info) => {
      console.log('✅ Update heruntergeladen:', info.version);
      this.mainWindow.webContents.send('update-status', {
        status: 'downloaded',
        message: `Update ${info.version} bereit zur Installation!`
      });
      
      dialog.showMessageBox(this.mainWindow, {
        type: 'info',
        title: 'Update bereit',
        message: `StreamMatrix ${info.version} wurde heruntergeladen.`,
        detail: 'Die App wird beim nächsten Start aktualisiert.',
        buttons: ['Jetzt neu starten', 'Später']
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    // Fehler beim Update
    autoUpdater.on('error', (error) => {
      console.error('❌ Update-Fehler:', error);
      this.mainWindow.webContents.send('update-status', {
        status: 'error',
        message: 'Fehler beim Suchen nach Updates'
      });
    });
  }

  // Manuell nach Updates suchen
  checkForUpdates() {
    const isDev = !app.isPackaged;
    
    if (isDev) {
      console.log('⚠️ Auto-Update ist im Development-Modus deaktiviert');
      this.mainWindow.webContents.send('update-status', {
        status: 'error',
        message: 'Auto-Update nur in installierter App verfügbar'
      });
      return;
    }

    console.log('🔍 Manuelle Update-Prüfung gestartet...');
    console.log('📍 Aktuelle Version:', app.getVersion());
    console.log('📦 Prüfe: https://github.com/19bounty9317/StreamMatrix/releases');
    
    autoUpdater.checkForUpdates()
      .then(result => {
        console.log('✅ Update-Check erfolgreich:', result);
      })
      .catch(error => {
        console.error('❌ Update-Check Fehler:', error);
        this.mainWindow.webContents.send('update-status', {
          status: 'error',
          message: 'Fehler beim Suchen nach Updates: ' + error.message
        });
      });
  }
}
