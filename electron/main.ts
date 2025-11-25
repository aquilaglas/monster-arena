import { app, BrowserWindow, ipcMain } from "electron"
import path from "path"
import { spawn } from "child_process"
import isDev from "electron-is-dev"

let mainWindow: BrowserWindow | null = null
let nextServerProcess: any = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    icon: path.join(__dirname, "../public/icon.png"),
  })

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../.next/standalone/.next/server/app")}`

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

const startNextServer = () => {
  if (isDev) {
    // In development, Next.js dev server is started separately
    return
  }

  // In production, start the standalone Next.js server
  const serverPath = path.join(__dirname, "../.next/standalone/server.js")
  nextServerProcess = spawn("node", [serverPath], {
    cwd: path.join(__dirname, "../"),
    stdio: "inherit",
  })
}

app.on("ready", () => {
  startNextServer()
  createWindow()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }

  if (nextServerProcess) {
    nextServerProcess.kill()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC handlers for app info
ipcMain.handle("get-app-version", () => app.getVersion())
ipcMain.handle("get-app-name", () => app.getName())
ipcMain.handle("get-app-path", () => app.getAppPath())
