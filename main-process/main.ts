import log from 'electron-log';
import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import isDev from "electron-is-dev";
import fs from 'fs';
import ParsersFactory from "./ParsersFactory";
import {Parser} from "./constants";

let mainWindow: any;

const args = process.argv.slice(1);
const devMode = isDev;
const debugMode = args.some((val) => val === '--debug');

log.debug('hello', {devMode, debugMode});

function createWindow(): void {
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

ipcMain.on('process-file', async (event, filePath, fromDate) => {
  const dataBuffer = fs.readFileSync(filePath);
  const parser: Parser = await ParsersFactory.createByPdfData(dataBuffer);
  const res = parser.run(fromDate);
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

