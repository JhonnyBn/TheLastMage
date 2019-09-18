var readline = require('readline');
var r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var socket = require('socket.io-client')('http://localhost:8080');
socket.on('connect', function(){
    console.log("conectado")
    socket.send("new_msg","ola")
});
socket.on("message", value => {
    console.log("msg:", value)
    
})
socket.on('disconnect', function(){});

r1.on('line', line => socket.send(line))
