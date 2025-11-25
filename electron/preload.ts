import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electron", {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getAppName: () => ipcRenderer.invoke("get-app-name"),
  getAppPath: () => ipcRenderer.invoke("get-app-path"),
})

declare global {
  interface Window {
    electron: {
      getAppVersion: () => Promise<string>
      getAppName: () => Promise<string>
      getAppPath: () => Promise<string>
    }
  }
}
