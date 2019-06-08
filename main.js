const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, Notification, shell } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, appIcon
var template, intervals = []

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 680,
    height: 370,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
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

  // Get the image and resize it to be large enough for a tray icon
  const iconPath = path.join(__dirname, '/assets/icons/256x256.png')
  var image = nativeImage.createFromPath(iconPath)
  image = image.resize({width: 24, height: 24, quality: 'best'})

  // Create tray
  appIcon = new Tray(image)

  // Create template array that can be updated later
  template = [
    { role: 'quit', accelerator: 'CmdOrCtrl+Q' },
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
          label: 'Github Page',
          click() { shell.openExternalSync('https://github.com/stickyPiston/notifier') }
        }
      ]
    },
    { type: 'separator' }
  ]

  // Set tooltip for tray
  appIcon.setToolTip('Notifier')

  // Update tray to contain initial template
  updateTray()  

  // When the addTimer form is completed
  ipcMain.on('formSubmitted', (_e, arg) => {
    // Add timer to intervals array
    intervals.push(arg)

    // Add timer to template array for tray
    var index = template.push({
      label: arg.actionValue.replace('https://', '') + ' (' + arg.time / 60000 + ' min)'
    })-1

    // When 'every' input is checked
    if (arg.when === 'every') {

      // Create notification
      if (arg.action === 'notification') {

        var intervalID = setInterval(() => {
          new Notification({
            title: arg.actionValue
          }).show()
        }, arg.time)

      // Open url
      } else if (arg.action === 'url') {
        
        var intervalID = setInterval(() => {
          shell.openExternalSync(arg.actionValue)
        }, arg.time)

      }

    // When 'once' input is checked
    } else if (arg.when === 'once') {

      // Create notification
      if (arg.action === 'notification') {

        var intervalID = setTimeout(() => {
          new Notification({
            title: arg.title
          }).show()
          template.splice(index, 1)
          updateTray()
        }, arg.time)

        // Open url
      } else if (arg.action === 'url') {

        var intervalID = setTimeout(() => {
          shell.openExternalSync(arg.actionValue)
          template.splice(index, 1)
          updateTray()
        }, arg.time)

      }

    } // endif

    // Set click event on the tray element
    template[index].click = () => {
      template.splice(index, 1)
      updateTray()
      clearTimeout(intervalID)
    }

    // Update the tray
    updateTray()
  })

  
})

// When the app isn't in development mode, set the app to open at boot
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