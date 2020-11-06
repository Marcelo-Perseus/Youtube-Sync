const ipcRenderer = require('electron').ipcRenderer;

var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
  document.getElementById('player').style.borderColor = '#FF6D00';
}

function changeBorderColor(playerStatus) {
  var color;
  if (playerStatus == -1) {
    color = "#37474F"; // unstarted = gray
  } else if (playerStatus == 0) {
    color = "#FFFF00"; // ended = yellow
  } else if (playerStatus == 1) {
    color = "#33691E"; // playing = green
  } else if (playerStatus == 2) {
    color = "#DD2C00"; // paused = red
  } else if (playerStatus == 3) {
    color = "#AA00FF"; // buffering = purple
  } else if (playerStatus == 5) {
    color = "#FF6DOO"; // video cued = orange
  }
  if (color) {
    document.getElementById('player').style.borderColor = color;
  }
}

function onPlayerStateChange(event) {
  changeBorderColor(event.data);
}

const press = document.getElementById('press-me')
press.addEventListener('click', function() {
  player.loadVideoById("M7lc1UVf-VE")
})

ipcRenderer.on("update", (event, arg) => {
  console.log(arg)
})
