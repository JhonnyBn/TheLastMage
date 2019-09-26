const readline = require("readline");
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let inAGame = false
let name

var socket = require("socket.io-client")("http://localhost:8080");
socket.on("connect", function () {
  console.log("connected");
});
socket.on("message", value => {
  console.log("msg:", value);
});
socket.on("disconnect", function () { });

readlineInterface.on("line", line => {
  if (!inAGame) {
    socket.send("new join " + line)
    name=line
    inAGame = true
  }else{
    socket.send(name + " " + line)
  }

})

console.log("Digite seu nome:")