const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

/* 绿色版：数据放在 Spore.exe 旁边的 SporeData 文件夹（开发模式下放在工程目录） */
const base = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
app.setPath('userData', path.join(base, 'SporeData'));

if (!app.requestSingleInstanceLock()) app.quit();

let win;
function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 1180, height: 860, minWidth: 380, minHeight: 560,
    title: 'Spore', icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#ffffff', autoHideMenuBar: true, show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false, nodeIntegration: false, sandbox: false,
      spellcheck: false
    }
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'index.html'));
  /* 外部链接交给系统浏览器；工具自己用到的 about:blank 新窗口照常放行 */
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) { shell.openExternal(url); return { action: 'deny' }; }
    return { action: 'allow' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:')) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); }
  });
}
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
