const net = require('net');
const fs = require('fs');

const settings = require('../settings.json')

// Create the connection to the server
const client = new net.Socket();
client.connect({ port: 30493, host: settings["serverIP"] });

// Add some event listeners
client.on('data', (data) => {
  console.log(data.toString('utf-8'));
});

client.on('close', (event) => {
  console.log("closed");
});

// Do some testy stuffs
client.write("CREATE")

setTimeout(() => {
  client.write("CLOSE");
}, 4000)
