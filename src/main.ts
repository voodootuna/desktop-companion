import { app, BrowserWindow, ipcMain } from 'electron'
import started from 'electron-squirrel-startup'
import { join } from 'path'
import { getCompanion, hatchCompanion, deleteSoul } from './companion/index.js'
import { sendMessage, resetHistory } from './chat.js'

if (started) app.quit()

async function main() {
  await app.whenReady()

  let companion = getCompanion()

  const win = new BrowserWindow({
    width: 480,
    height: 680,
    minWidth: 380,
    minHeight: 500,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0d0d0d',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  ipcMain.handle('companion:get', () => companion)

  ipcMain.handle('companion:hatch', async () => {
    if (companion) return companion  // already hatched
    try {
      const c = await hatchCompanion()
      companion = c
      win.webContents.send('companion:hatched', c)
      return c
    } catch (err) {
      const msg = String(err)
      win.webContents.send('companion:error', msg)
      return null
    }
  })

  ipcMain.handle('companion:rehatch', async () => {
    companion = null
    deleteSoul()
    resetHistory()
    try {
      const c = await hatchCompanion()
      companion = c
      win.webContents.send('companion:hatched', c)
      return c
    } catch (err) {
      const msg = String(err)
      win.webContents.send('companion:error', msg)
      return null
    }
  })

  ipcMain.handle('chat:send', async (_e, text: string) => {
    if (!companion) return null
    try {
      return await sendMessage(text, companion)
    } catch (err) {
      console.error('[main] chat:send failed:', err)
      return null
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}

main().catch(console.error)
