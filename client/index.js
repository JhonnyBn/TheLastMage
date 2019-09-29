const readline = require("readline");
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var socket = require("socket.io-client")("http://localhost:8080");
socket.on("connect", function () {
  console.log("Connected to the server.");
});
socket.on("message", value => {
  console.log(value);
});
socket.on("disconnect", function () { });

readlineInterface.on("line", line => {
  socket.send(line)
});
