/* eslint-disable */

const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');
const url = require('url');

let mainWindow;
let server;

function createWindow() {
    const expressApp = express();
    
    // Check if we're in development or production
    const isDev = process.env.ELECTRON_START_URL ? true : false;
    
    if (!isDev) {
        // In production, serve from the app's resources
        const staticPath = path.join(__dirname, '/');
        expressApp.use('/', express.static(staticPath));
        
        // Start the server
        server = expressApp.listen(4200, 'localhost', () => {
            console.log('Express server running on localhost:4200');
        });
    }

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'assets/icons/icon.png')
    });

    // Load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:4200';
    mainWindow.loadURL(startUrl);

    // Open DevTools in development
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
        if (server) {
            server.close();
        }
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// Clean up server when app quits
app.on('before-quit', () => {
    if (server) {
        server.close();
    }
});