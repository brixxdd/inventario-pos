const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, data) => {
    const validChannels = [
      'db:getProducts',
      'db:addProduct',
      'db:createSale',
      'db:getSales',
      'db:checkSku'
    ];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  }
}); 