console.clear();

const path = require("path");
const { app, BrowserWindow, globalShortcut } = require("electron");

const { centerWindowOnDisplayWithCursor } = require("./utils");
require("./commands");

let window;

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
//
(async () => {
  await app.whenReady();
  app.dock.hide(); // also hides from app switcher

  globalShortcut.register("Meta+Space", () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      centerWindowOnDisplayWithCursor(window);
      window.show();
    }
  });

  window = new BrowserWindow({
    width: 600,
    height: 260,
    alwaysOnTop: true,
    show: false,
    frame: false,
    minimizable: false,
    maximizable: false,
    resizable: false,
    closable: false,
    acceptFirstMouse: true,
    backgroundColor: "#1f2937",
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  // win.webContents.openDevTools()

  window.on("ready-to-show", () => {
    centerWindowOnDisplayWithCursor(window);
    window.show();
  });

  window.on("hide", () => {
    app.hide();
    window.webContents.send("hide");
  });

  window.on("focus", () => {
    globalShortcut.register("Esc", () => {
      window.hide();
    });
  });

  window.on("blur", () => {
    window.hide();
    globalShortcut.unregister("Esc");
  });

  window.loadURL("http://localhost:3005");
})();
