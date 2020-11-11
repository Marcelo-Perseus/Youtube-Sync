const { app, BrowserWindow, ipcMain } = require('electron')
const net = require('net') // For network stuffs like connecting to session
const settings = require('./settings.json') // For reading settings
const contextMenu = require('electron-context-menu') // Context menu for copying and pasting

// A global connection and session id variables
let connection = null
let session_id = ""

// Global context menu variable
const dispose = contextMenu({
    prepend: (actions, props, browserWindow) => [],
    showInspectElement: false,
    showSearchWithGoogle: false
})

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

  // Close the connection if there is one
  if (connection !== null) {
    connection.write("CLOSE")
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

  // Create a connection
  connection = new net.Socket()
  connection.connect({ port: 30493, host: settings["serverIP"] })

  // Add some event listeners
  connection.on('data', (data) => {
    // Get the message from the server and decode it
    message = data.toString('utf8')

    // Check if the message is the session id
    if (message.includes("ID:")) {
      session_id = message.substring(3)
    } else { // If it's not the session id, pass it to the renderer process
      win.webContents.send('update', data.toString('utf-8'))
    }
  });

  connection.on('close', (event) => {
    connection = null
  });

  // Create
  connection.write("CREATE")

  // Load the create.html file
  win.loadFile('src/player.html')
})

ipcMain.on("join-session-popup", (event) => {
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

// Creating the connection to the server and adding event listeners
ipcMain.on("join-session", (event, arg) => {
  // Close the popup
  const popup = BrowserWindow.getFocusedWindow()
  popup.close()

  // Get the window
  win = BrowserWindow.getAllWindows()[0]

  // Join the session
  connection = new net.Socket()
  connection.connect({ port: 30493, host: settings["serverIP"] })

  // Add some event listeners
  connection.on('data', (data) => {
    win.webContents.send('update', data.toString('utf-8'))
  });

  connection.on('close', (event) => {
    connection = null
  });

  // Talk to the server
  connection.write("JOIN")
  connection.write(arg)

  // Save the session id
  session_id = arg

  // Load the player
  if (connection !== null) {
    win.loadFile("src/player.html")
  }
})

// Send data to server
ipcMain.on("update", (event, arg) => {
  if (connection !== null) {
    connection.write(arg)
  }
})

// For handling the user input sending to the server
ipcMain.on("send", (event, arg) => {
  if (connection !== null) {
    connection.write(arg)
  }
})

// For handling the renderer process asking for the id
ipcMain.on("request-id", (event) => {
  event.reply("get-id", session_id)
})

// -------------
