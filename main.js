const { app, BrowserWindow, ipcMain } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/index.html')
  win.webContents.openDevTools()
  win.setMenu(null) // Remove the menu
}

app.whenReady().then(createWindow)

// -----------------
// System Operations
// -----------------

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// -----------------



// -------------
// Page Switches
// -------------

ipcMain.on("create-session", function(event) {
  // Grab the main window
  win = BrowserWindow.getAllWindows()[0]

  // Load the create.html file
  win.loadFile('src/player.html')
})

ipcMain.on("join-session-popup", function(event) {
  // Check to see if there is already a second window
  if (BrowserWindow.getAllWindows().length === 2) {
    return null
  }

  // Create a new window
  let popup = new BrowserWindow({
    alwaysOnTop: true,
    width: 400,
    height: 200,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Remove the menu
  popup.setMenu(null)

  // Load the html
  popup.loadFile("src/join.html")
})

ipcMain.on("join-session", function(event, arg) {
  // Close the popup
  const popup = BrowserWindow.getFocusedWindow()
  popup.close()

  // Print the id
  console.log(arg)
})

// -------------
