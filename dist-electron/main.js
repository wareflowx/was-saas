import { app as t, dialog as n, BrowserWindow as a } from "electron";
import i from "path";
import { fileURLToPath as p } from "url";
const l = i.dirname(p(import.meta.url));
function d() {
  console.log("Creating window..."), console.log("__dirname:", l);
  const o = new a({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: i.join(l, "preload.js"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  if (o.webContents.on("did-fail-load", (r, e, s, c) => {
    console.error("Failed to load:", e, s, c), n.showErrorBox("Failed to load", `Failed to load: ${s}`);
  }), o.webContents.on("render-process-gone", (r, e) => {
    console.error("Render process gone:", e), n.showErrorBox("Renderer process crashed", `Reason: ${e.reason}`);
  }), process.env.NODE_ENV === "development")
    console.log("Loading dev server at http://127.0.0.1:3000"), o.loadURL("http://127.0.0.1:3000"), o.webContents.openDevTools();
  else {
    const r = i.join(l, "../dist/index.html");
    console.log("Loading production build:", r), o.loadFile(r).catch((e) => {
      console.error("Failed to load index.html:", e), n.showErrorBox("Error", `Failed to load index.html: ${e.message}`);
    }), o.webContents.openDevTools();
  }
  o.on("closed", () => {
    console.log("Window closed");
  });
}
t.whenReady().then(() => {
  console.log("App is ready, creating window..."), d();
}).catch((o) => {
  console.error("Failed to initialize app:", o), n.showErrorBox("Initialization Error", o.message);
});
t.on("window-all-closed", () => {
  console.log("All windows closed"), process.platform !== "darwin" && t.quit();
});
t.on("activate", () => {
  a.getAllWindows().length === 0 && (console.log("Activating app, creating window..."), d());
});
process.on("uncaughtException", (o) => {
  console.error("Uncaught exception:", o), n.showErrorBox("Uncaught Exception", o.message);
});
process.on("unhandledRejection", (o) => {
  console.error("Unhandled rejection:", o);
});
