const readline = require("readline");
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let inAGame = false;
let name;

var socket = require("socket.io-client")("http://localhost:8080");
socket.on("connect", function () {
  console.log("Connected to the server.");
  console.log("Type your name:");
  inAGame = false;
});
socket.on("message", value => {
  console.log(value);
});
socket.on("disconnect", function () { });

readlineInterface.on("line", line => {
  // if (!inAGame) {
  //   socket.send("new join " + line);
  //   name = line;
  //   inAGame = true;
  // } else {
  //   socket.send(name + " " + line);
  // }
  console.log(line)
  socket.send(line)
});
