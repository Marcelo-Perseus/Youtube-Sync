const ipcRenderer = require('electron').ipcRenderer

const join = document.getElementById('join-session')
join.addEventListener('click', () => {
  sessionID = document.getElementById("sessionID").value
  ipcRenderer.send("join-session", sessionID)
})

const text = document.getElementById("sessionID")
text.addEventListener('keyup', (e) => {
  if (e.key === "Enter" || e.keyCode === 13) {
    sessionID = document.getElementById("sessionID").value
    ipcRenderer.send("join-session", sessionID)
  }
})
