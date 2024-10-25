import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getItems: (data) => ipcRenderer.invoke('getItems', data),
  createItem: (data) => ipcRenderer.invoke('createItem', data),
  updateItem: (data) => ipcRenderer.invoke('updateItem', data),
  delItem: (data) => ipcRenderer.invoke('delItem', data),

  getInvoices: (data) => ipcRenderer.invoke('getInvoices', data),
  createInvoice: (data) => ipcRenderer.invoke('createInvoice', data),
  cancelInvoice: (data) => ipcRenderer.invoke('cancelInvoice', data),

  getSales: (data) => ipcRenderer.invoke('getSales', data),

  previewComponent: (url, fileName) => ipcRenderer.invoke('previewComponent', url, fileName)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
