import { app, dialog, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
function createWindow() {
  console.log("Creating window...");
  console.log("__dirname:", __dirname$1);
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    console.error("Failed to load:", errorCode, errorDescription, validatedURL);
    dialog.showErrorBox("Failed to load", `Failed to load: ${errorDescription}`);
  });
  win.webContents.on("render-process-gone", (event, details) => {
    console.error("Render process gone:", details);
    dialog.showErrorBox("Renderer process crashed", `Reason: ${details.reason}`);
  });
  if (process.env.NODE_ENV === "development") {
    console.log("Loading dev server at http://127.0.0.1:3000");
    win.loadURL("http://127.0.0.1:3000");
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname$1, "../dist/index.html");
    console.log("Loading production build:", indexPath);
    win.loadFile(indexPath).catch((err) => {
      console.error("Failed to load index.html:", err);
      dialog.showErrorBox("Error", `Failed to load index.html: ${err.message}`);
    });
    win.webContents.openDevTools();
  }
  win.on("closed", () => {
    console.log("Window closed");
  });
}
app.whenReady().then(() => {
  console.log("App is ready, creating window...");
  createWindow();
}).catch((err) => {
  console.error("Failed to initialize app:", err);
  dialog.showErrorBox("Initialization Error", err.message);
});
app.on("window-all-closed", () => {
  console.log("All windows closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    console.log("Activating app, creating window...");
    createWindow();
  }
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  dialog.showErrorBox("Uncaught Exception", err.message);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});
