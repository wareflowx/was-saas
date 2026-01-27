import { contextBridge } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  // Tu peux ajouter des APIs ici plus tard
  platform: process.platform
});
