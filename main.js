const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initialize, enable } = require('@electron/remote/main');

initialize();

function createWindow() {
  let iconPath;

  if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, 'assets/timer_icon.icns'); // macOS icon
  } else if (process.platform === 'win32') {
    iconPath = path.join(__dirname, 'assets/timer_icon.ico'); // Windows icon
  } else {
    iconPath = path.join(__dirname, 'assets/timer_icon.png'); // Linux and others
  }

  const mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    minWidth: 500,
    minHeight: 700,
    frame: false,
    icon: iconPath,
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

