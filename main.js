const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, Notification, shell } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, appIcon
var template, dailyIntervals = []

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

const execAction = (arg, index) => {
  // Create notification
  if (arg.action === 'notification') {

      new Notification({
        title: arg.actionValue
      }).show()
      if (arg.when === 'once') {
        template.splice(index, 1)
        updateTray()
      }

    // Open url
  } else if (arg.action === 'url') {

      shell.openExternalSync(arg.actionValue)
      if (arg.when === 'once') {
        template.splice(index, 1)
        updateTray()
      }
  }
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
    
    // Add timer to template array for tray
    var index = template.push({
      label: arg.actionValue.replace('https://', '') + ' (' + arg.time + (arg.when !== 'time' ? 'min' : '') + ')'
    })-1

    if (arg.when === 'time' ) {

      var varName = arg.actionValue + Math.round(Math.random() * 10)
      dailyIntervals[varName] = 0
     
      var intervalID = setInterval(() => {
        
        var now = new Date()
        var date = new Date((now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + arg.time)

        if (now.getHours() === date.getHours() && now.getMinutes() === date.getMinutes() && dailyIntervals[varName] === 0) {
          
          execAction(arg)

          dailyIntervals[varName] = 1

          template.splice(index, 1)
          updateTray()

        }

      }, 1000);

    } else {
      if (arg.when === 'interval') var intervalID = setInterval(() => { execAction(arg) }, arg.time * 60 * 1000)
      else if (arg.when === 'timeout') var intervalID = setTimeout(() => { execAction(arg, index) }, arg.time * 60 * 1000)
    }

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

if (isDev && process.platform == 'win32') app.setAppUserModelId(process.execPath)

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