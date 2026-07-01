const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let serverProcess;

function startServer() {
    // Fork the compiled Express server (dist/server.cjs)
    const serverPath = path.join(__dirname, 'dist', 'server.cjs');
    
    // Set environment variables
    process.env.NODE_ENV = 'production';
    process.env.PORT = '3000';
    
    serverProcess = fork(serverPath, [], {
        env: process.env
    });
    
    serverProcess.on('message', (msg) => {
        console.log('[Server Process]:', msg);
    });
    
    serverProcess.on('error', (err) => {
        console.error('[Server Error]:', err);
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Samyak Publisher",
        icon: path.join(__dirname, 'luka_512.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Wait a brief moment for the server to spin up, then load it
    setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
    }, 1500);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    startServer();
    createWindow();
});

app.on('window-all-closed', () => {
    // Kill the server process when all windows are closed
    if (serverProcess) {
        serverProcess.kill();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
