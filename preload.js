/* 让工具走“下载 → 系统另存为对话框”这条路径，行为在 Electron 里最稳定 */
try { delete window.showSaveFilePicker; delete window.showOpenFilePicker; } catch (e) {}
