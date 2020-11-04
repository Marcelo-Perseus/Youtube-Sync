const ipcRenderer = require('electron').ipcRenderer;

const create = document.getElementById('create-session')
create.addEventListener('click', function() {
  ipcRenderer.send("create-session")
});

const join = document.getElementById('join-session-popup')
join.addEventListener('click', function() {
  ipcRenderer.send("join-session-popup")
})
