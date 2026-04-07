import { contextBridge, ipcRenderer } from 'electron'
import type { Companion } from './companion/types.js'

function listen<T>(channel: string, cb: (v: T) => void): () => void {
  const handler = (_e: Electron.IpcRendererEvent, v: T) => cb(v)
  ipcRenderer.on(channel, handler)
  return () => ipcRenderer.removeListener(channel, handler)
}

contextBridge.exposeInMainWorld('electronAPI', {
  getCompanion: (): Promise<Companion | null> => ipcRenderer.invoke('companion:get'),
  hatch: (): Promise<Companion | null> => ipcRenderer.invoke('companion:hatch'),
  rehatch: (): Promise<Companion | null> => ipcRenderer.invoke('companion:rehatch'),
  sendMessage: (text: string): Promise<string | null> => ipcRenderer.invoke('chat:send', text),
  onHatched: (cb: (c: Companion) => void) => listen('companion:hatched', cb),
  onError: (cb: (msg: string) => void) => listen('companion:error', cb),
})
