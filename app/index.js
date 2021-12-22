const electron = require('electron');
const axios = require('axios');
const { app } = electron;
const { BrowserWindow, ipcMain } = electron;
const express = require('express');

const { POST_CRAWLING_REQUEST } = require('./constant');

const expressApp = express();

expressApp.use('/', (req, res, next) => {
  res.status(200).send('Hello, Electron!');
});

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');

  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
}

expressApp.listen(3065, () => {
  app.on('ready', createWindow);

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on(POST_CRAWLING_REQUEST, async (event, args) => {
  try {
    const result = await axios.get(`https://jsonplaceholder.typicode.com/todos/2`);
    console.log(result.data);
  } catch (error) {
    console.log(error);
  }
});
