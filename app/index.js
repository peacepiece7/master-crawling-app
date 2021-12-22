const electron = require("electron");
const { app } = electron;
const { BrowserWindow } = electron;
const express = require("express");

const expressApp = express();

expressApp.use("/", (req, res, next) => {
  res.status(200).send("Hello, Electron!");
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

  win.loadURL(`http://localhost:3065/`);

  win.webContents.openDevTools();
  win.on("closed", () => {
    win = null;
  });
}

expressApp.listen(3065, () => {
  app.on("ready", createWindow);

  app.on("activate", () => {
    if (win === null) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
