const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const dbOperations = require('../src/database/db.cjs')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  // Establecer CSP
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['default-src \'self\' \'unsafe-inline\' \'unsafe-eval\'']
      }
    });
  });

  // En desarrollo, carga la URL del servidor de Vite
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.loadURL('http://localhost:5173')
    // Abre las herramientas de desarrollo (DevTools)
    mainWindow.webContents.openDevTools()
  } else {
    // En producción, carga el archivo index.html
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// IPC handlers
ipcMain.handle('db:getProducts', () => {
  return dbOperations.getProducts();
});

ipcMain.handle('db:addProduct', (_, product) => {
  return dbOperations.addProduct(product);
});

ipcMain.handle('db:createSale', (_, saleData) => {
  return dbOperations.createSale(saleData);
});

ipcMain.handle('db:getSales', () => {
  return dbOperations.getSales();
});

ipcMain.handle('db:checkSku', (_, sku) => {
  return dbOperations.checkSkuExists(sku);
});