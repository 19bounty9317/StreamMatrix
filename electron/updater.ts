import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';

export class AppUpdater {
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.setupAutoUpdater();
  }

  private setupAutoUpdater() {
    // GitHub Repository für Updates
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: '19bounty9317',
      repo: 'StreamMatrix'
    });

    // Automatisch nach Updates suchen (alle 10 Minuten)
    autoUpdater.checkForUpdatesAndNotify();
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 10 * 60 * 1000);

    // Update verfügbar
    autoUpdater.on('update-available', (info) => {
      this.mainWindow.webContents.send('update-available', info);
    });

    // Update heruntergeladen
    autoUpdater.on('update-downloaded', (info) => {
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
      console.error('Update-Fehler:', error);
    });
  }

  // Manuell nach Updates suchen
  checkForUpdates() {
    autoUpdater.checkForUpdates();
  }
}
