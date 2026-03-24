import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Add any IPC methods you need here
  ipcRenderer: {
    send: (channel, ...args) => {
      // Implement if needed
    },
    on: (channel, listener) => {
      // Implement if needed
    },
  },
});
