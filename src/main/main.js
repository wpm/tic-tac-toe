import { app, BrowserWindow } from 'electron';
// Bug fix for issue #9: Use namespace import for CommonJS interop
// When TypeScript compiles ES module imports to CommonJS, 'import path from "path"'
// becomes 'path_1.default.join()' which fails because Node.js built-in modules
// don't have a default export. Using 'import * as path' correctly generates 'path_1.join()'.
import * as path from 'path';
var mainWindow = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../../../dist-renderer/index.html'));
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
