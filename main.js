const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, appIcon
var template, intervals = []

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 100,
    webPreferences: {
      nodeIntegration: true
    },
    show: false,
    frame: false
  })

  // and load the index.html of the app.
  win.loadFile('src/index.html')

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

const updateTray = () => {
  const contextMenu = Menu.buildFromTemplate(template)
  appIcon.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()

  const iconPath = path.join(__dirname, '/assets/icons/256x256.png')
  var image = nativeImage.createFromPath(iconPath)
  image = image.resize({width: 24, height: 24, quality: 'best'})
  appIcon = new Tray(image)
  template = [
    { role: 'quit' },
    {
      label: 'Add a timer',
      click: () => {
        win.show()
      }
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { require('electron').shell.openExternalSync('https://github.com/stickyPiston/notifier') }
        }
      ]
    },
    { type: 'separator' }
  ]

  appIcon.setToolTip('Notifier')
  updateTray()  

  ipcMain.on('formSubmitted', (e, arg) => {
    intervals.push(arg)
    var intervalID = setInterval(() => {
      e.sender.send('notify', arg)
    }, arg.time)
    var index = template.push({
      label: arg.title + ' (' + arg.time / 60000 + ' min)'
    })-1
    template[index].click = () => {
      template.splice(index, 1)
      updateTray()
      clearTimeout(intervalID)
    }
    updateTray()
  })
})

if (!isDev) {
  app.setLoginItemSettings({
    openAtLogin: true,
    args: [__dirname]
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})