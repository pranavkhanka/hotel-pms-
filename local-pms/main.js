const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
// Import backend to start it automatically
require('./server.js');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For simple MVP IPC if needed, or secure it later
        },
    });

    // In Dev: Load Vite Dev Server
    // In Prod: Load built index.html
    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, 'ui/dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
