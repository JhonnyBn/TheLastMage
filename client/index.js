const readline = require("readline");
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var socket = require("socket.io-client")("http://localhost:8080");
socket.on("connect", function() {
  console.log("conectado");
});
socket.on("message", value => {
  console.log("msg:", value);
});
socket.on("disconnect", function() {});

readlineInterface.on("line", line => socket.send(line));
