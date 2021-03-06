import log from 'electron-log';
import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import isDev from "electron-is-dev";
import fs from 'fs';
import pdf from 'pdf-parse';
import MtsParser from "./MtsParser";

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
  const runner = new MtsParser();
  const dataBuffer = fs.readFileSync(filePath);
  const rawData = await pdf(dataBuffer);
  log.debug('parsed PDF text', rawData.text);
  const res = await runner.run(rawData.text, fromDate);
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

