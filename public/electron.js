// 引入electron并创建一个Browserwindow
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

let mainWindow;

ipcMain.on('isDev', event => event.returnValue = isDev);

function createWindow() {
    //创建浏览器窗口,宽高自定义具体大小你开心就好
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 1080,
        frame: true,
        // titleBarStyle: 'hidden'
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            webviewTag: true
        }
    });

    // 加载应用
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000/');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadURL(url.format({
            pathname: path.resolve(__dirname, '../build/index.html'),
            protocol: 'file:',
            slashes: true
        }));
        Menu.setApplicationMenu(null);
    }


    mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
        event.preventDefault()
        const win = new BrowserWindow({
            show: false,
            width: 1280,
            height: 1080
        })
        win.once('ready-to-show', () => win.show())
        win.loadURL(url) // existing webContents will be navigated automatically
        // event.newGuest = win
    })

    // 关闭window时触发下列事件.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

// 所有窗口关闭时退出应用.
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
