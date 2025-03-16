/* eslint-disable */

const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    const server = express();
    server.use('/', express.static(path.join(__dirname, '/dist/Savis4')));
    server.listen(4200);

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: 'localhost:4200',
        protocol: 'http:',
    });
    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', function () {
        mainWindow = null
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
