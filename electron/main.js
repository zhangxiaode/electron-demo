const { app, protocol, BrowserWindow, globalShortcut, ipcMain } = require('electron')
// 需在当前文件内开头引入 Node.js 的 'path' 模块
const path = require('path')
 
app.commandLine.appendSwitch("--ignore-certificate-errors", "true");
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } }
]);
 
const createWindow = () => {
    const win = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        width: 800,
        height: 600,
        //窗口是否在屏幕居中. 默认值为 false
        center: true,
        //设置为 false 时可以创建一个无边框窗口 默认值为 true。
        frame: false,
        //窗口是否在创建时显示。 默认值为 true。
        show: true,
        webPreferences: {
            contextIsolation: false, // 沙箱 上下文隔离
            nodeIntegration: true, // 允许html页面上的 javascipt 代码访问 nodejs 环境 api
            allowMediaDevices: true,// 允许访问摄像头和麦克风
            // backgroundThrottling: false,   // 设置应用在后台正常运行
            nodeIntegrationInWorker: true,
            preload: path.resolve(__dirname, 'preload.js'),
            webSecurity: false,
        }
    })
    // win.setMenu(null)
    ipcMain.on('min', () => win.minimize())
    ipcMain.on('max', () => {
        if (win.isMaximized()) {
            win.unmaximize()
        } else {
            win.maximize()
        }
    })
    ipcMain.on('close', () => win.close())
    if (app.isPackaged) {
        win.loadURL(`file://${path.resolve(__dirname, '../dist/index.html')}`)
    } else {
        // win.loadURL('http://127.0.0.1:8888/')
        win.loadURL('http://localhost:8888/')
        win.webContents.openDevTools()
    }
    globalShortcut.register("CommandOrControl+Shift+i", function () {
        win.webContents.openDevTools();
    });

    // 获取当前窗口的会话对象
    const session = win.webContents.session
    // 响应 session 的权限请求
    session.setPermissionRequestHandler((_, permission, callback) => {
        // if (webBrowserWindow.webContents.getURL() === 'http://hostlocal:8086/') {
        //   return callback(true)
        // }
        // 默认响应全部请求
        callback(true)
    })
    session.setPermissionCheckHandler(() => true)
}
 
app.whenReady().then(() => {
 
    createWindow()
 
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
