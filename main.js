const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initialize, enable } = require('@electron/remote/main');

initialize();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    minWidth: 500,
    minHeight: 700,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  enable(mainWindow.webContents);

  mainWindow.loadFile('index.html');

  mainWindow.setMenu(null);
  
  // mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

