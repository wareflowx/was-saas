import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire ipcRenderer API
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,

  // IPC methods will be added here as needed
  // For now, keeping it simple - you can add specific IPC methods later

  // Example:
  // getVersion: () => ipcRenderer.invoke('get-version'),
  // readConfig: () => ipcRenderer.invoke('read-config'),
})
