const ipcRenderer = require('electron').ipcRenderer;

var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let last_command = ""

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
  });
}

function onPlayerReady(event) {
  ipcRenderer.send("request-id") // Get the id of the session when everything on the page loads
}

function handleStateChange(playerStatus) {
  if (playerStatus == 1) { // Player is in a play state
    sendCommand("PLAY")
  } else if (playerStatus == 2) { // Player is in a pause state
    sendCommand("PAUSE")
  }
}

function sendCommand(command) {
  // Set the last command sent to the one being sent
  last_command = command

  // Send the command
  ipcRenderer.send("update", command)

  console.log(command)
}

function executeCommand(command) {
  // Since the server sends the command to everybody including the person
  // that sent the command, I don't want to execute the command if it was
  // sent from this client
  if (command === last_command) {
    return
  }

  console.log("RECEIVED:", command)

  if (command.includes("VIDEO:")) { // Somebody has queued up a video
    player.loadVideoById(command.substring("VIDEO:".length))
    player.pauseVideo() // Start it paused
  } else if (command === "PLAY") { // Somebody has played the video
    player.playVideo()
  } else if (command === "PAUSE") { // Somebody has paused the video
    player.pauseVideo()
  } else if (command.includes("TIME:")) { // Somebody changed the time
    let time = parseFloat(command.substring("TIME:".length))
    if (time !== player.getCurrentTime()) {
      player.seekTo(time)
    }
  }
}

// When the player encounters a change in state, send it to the server
function onPlayerStateChange(event) {
  handleStateChange(event.data);
}

const press = document.getElementById('video-id-button')
press.addEventListener('click', function() {
  // Grab the id from the text input
  let id = document.getElementById("video-id-input").value

  // Load the video and keep it paused at the start
  player.loadVideoById(id)
  player.pauseVideo()

  // Send command to server
  sendCommand("VIDEO:".concat(id))
})

ipcRenderer.on("update", (event, arg) => {
  executeCommand(arg)
})

ipcRenderer.on("get-id", (event, arg) => {
  document.getElementById('session-id').innerHTML = arg
})
