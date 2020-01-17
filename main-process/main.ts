import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import MtsParser from "./MtsParser";

const url = require('url');

let mainWindow: any;

const args = process.argv.slice(1);
const devMode = args.some((val) => val === '--serve');
const debugMode = args.some((val) => val === '--debug');

function createWindow() {
    const iconUrl = url.format({
        // pathname: path.join(__dirname, 'Icon/Icon.icns'),
        pathname: path.join(__dirname, 'appIcon.png'),
        protocol: 'file:',
        slashes: true
       });

    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        icon: './appIcon.png',
       // icon: iconUrl,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL(
        devMode ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`
    );

    mainWindow.on("closed", () => (mainWindow = null));

    if (debugMode) {
        mainWindow.openDevTools({mode: 'detach'});
    }
}

ipcMain.on('process-file', async (event, filePath) => {
    let runner = new MtsParser(filePath);
    let res = await runner.run();
    event.sender.send('results', {total: res})
});

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

