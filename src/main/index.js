import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { homedir } from 'os'
import { ensureDir, ensureFile, readJSON, writeJson, writeFileSync } from 'fs-extra'

function createWindow() {
  const PRODUCT_OWNER_NAME = 'test'

  const productOwnerNameVite = process.env.VITE_PRODUCT_OWNER_NAME
  const productOwnerNameMain = process.env.MAIN_PRODUCT_OWNER_NAME

  console.log('VITE Product Owner Name:', productOwnerNameVite) // Should log "BOSS"
  console.log('Main Product Owner Name:', productOwnerNameMain)

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: PRODUCT_OWNER_NAME,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.openDevTools()

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  injectFileSystem()
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Actions
async function injectFileSystem() {
  try {
    const dir = `${homedir()}/Json-Files`

    const ITEMS_FILE_NAME = `${dir}/items.json`
    const INVOICES_FILE_NAME = `${dir}/invoices.json`

    await ensureDir(dir)
    await ensureFile(ITEMS_FILE_NAME)
    await ensureFile(INVOICES_FILE_NAME)

    await readJSON(ITEMS_FILE_NAME).catch(async () => await writeJson(ITEMS_FILE_NAME, []))
    await readJSON(INVOICES_FILE_NAME).catch(async () => await writeJson(INVOICES_FILE_NAME, []))

    // Items CRUD:
    ipcMain.handle('getItems', async (_, data) => {
      const file = await readJSON(ITEMS_FILE_NAME)
      return file
    })
    ipcMain.handle('createItem', async (_, data) => {
      const file = await readJSON(ITEMS_FILE_NAME)
      const result = [...file, data]
      await writeJson(ITEMS_FILE_NAME, result)
      return 'createItem'
    })
    ipcMain.handle('updateItem', async (_, data) => {
      const file = await readJSON(ITEMS_FILE_NAME)
      const result = file.map((val) => {
        if (val.id === data.id) {
          return { ...val, ...data }
        } else {
          return val
        }
      })
      await writeJson(ITEMS_FILE_NAME, result)
      return 'updateItem'
    })
    ipcMain.handle('delItem', async (_, data) => {
      const file = await readJSON(ITEMS_FILE_NAME)
      const result = file.filter((val) => val.id !== data.id)
      await writeJson(ITEMS_FILE_NAME, result)
      return result
    })

    // Invoice CRUD:
    ipcMain.handle('getInvoices', async () => {
      const file = await readJSON(INVOICES_FILE_NAME)
      const sortedResult = file.sort((a, b) => b.id - a.id)
      return sortedResult
    })

    ipcMain.handle('createInvoice', async (_, data) => {
      const file = await readJSON(INVOICES_FILE_NAME)
      const newId = file.length + 1 // Auto-increment ID
      const newInvoice = { ...data, id: newId }
      const result = [...file, newInvoice]
      await writeJson(INVOICES_FILE_NAME, result)
      return 'createInvoice'
    })

    ipcMain.handle('cancelInvoice', async (_, data) => {
      const file = await readJSON(INVOICES_FILE_NAME)
      const result = file.map((val) => {
        if (val.id === data.id) {
          return { ...val, isCancelled: true }
        } else {
          return val
        }
      })
      await writeJson(INVOICES_FILE_NAME, result)
      return 'cancelInvoice'
    })

    // SALES Logic:
    ipcMain.handle('getSales', async (_, data) => {
      const dateRange = data?.dateRange
      const date = dateRange ? dateRange.split(' to ') : []

      const startDate = new Date(date[0] || Date.now())
      const endDate = new Date(date[1] || startDate)

      // Normalizing the dates to ignore time components
      startDate.setHours(0, 0, 0, 0) // Start of the day
      endDate.setHours(23, 59, 59, 999) // End of the day

      const file = await readJSON(INVOICES_FILE_NAME)

      const filteredInvoices = file.filter((invoice) => {
        const invoiceDate = new Date(invoice.date)
        invoiceDate.setHours(0, 0, 0, 0) // Normalize the time to midnight

        if (!invoice.isCancelled) {
          return invoiceDate >= startDate && invoiceDate <= endDate
        }

        return false
      })

      const totalAmount = filteredInvoices.reduce((total, { amount }) => {
        return total + amount
      }, 0)

      return totalAmount
    })
  } catch (e) {
    console.log(e, 'ERRRR')
  }
}

// Printing Logic:
const printOptions = {
  silent: false,
  printBackground: true,
  color: true,
  margin: {
    marginType: 'printableArea'
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Page header',
  footer: 'Page footer'
}

ipcMain.handle('previewComponent', async (event, url, fileName = 'invoice') => {
  let win = new BrowserWindow({
    title: 'Print Preview',
    show: false,
    autoHideMenuBar: true
  })

  win.webContents.once('did-finish-load', async () => {
    try {
      const data = await win.webContents.printToPDF(printOptions)

      const savePath = dialog.showSaveDialogSync({
        title: 'Save Invoice',
        defaultPath: join(app.getPath('documents'), `${fileName}.pdf`),
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
      })

      if (savePath) {
        writeFileSync(savePath, data)
        win.close()
        return 'Invoice saved successfully.'
      } else {
        const buf = Buffer.from(data)
        const previewUrl = 'data:application/pdf;base64,' + buf.toString('base64')
        win.loadURL(previewUrl)
        win.show()
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    }
  })

  await win.loadURL(url)
})
