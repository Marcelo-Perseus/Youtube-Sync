const ipcRenderer = require('electron').ipcRenderer;

const join = document.getElementById('join-session')
join.addEventListener('click', function() {
  sessionID = document.getElementById("sessionID").value;
  ipcRenderer.send("join-session", sessionID)
})
