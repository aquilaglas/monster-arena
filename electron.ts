import isDev from "electron-is-dev"
import path from "path"

export const isDevelopment = isDev
export const appPath = path.app.getPath("exe")
export const publicPath = isDev ? path.join(__dirname, "../public") : path.join(appPath, "../resources/public")
export const preloadPath = isDev
  ? path.join(__dirname, "../electron/preload.js")
  : path.join(appPath, "../resources/electron/preload.js")
