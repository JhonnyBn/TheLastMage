const readline = require("readline");
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let inAGame = false;
let name = "";

var socket = require("socket.io-client")("http://localhost:8080");

socket.on("connect", function () {
  console.log("Connected to the server.\nPlease type your name to join the game.");
});
socket.on("message", value => {
  if (value == "Name already in use. Please choose another.") {
      inAGame = false;
      name = "";
  }
  if (value.split(" ")[0] == "sended:") {
      let msg = value.split(" ")
      msg.shift() // discard "sended:"
      msg = msg.join(" ")

      console.log(msg)
      return;
  }
  console.log(value);
});
socket.on("disconnect", function () { });

readlineInterface.on("line", line => {
  
  if (!inAGame) {
      if(line === "") {
          console.log("Your name cant be blank.")
          return
      }
      name = line.split(" ")[0];
      inAGame = true;
      socket.send(`join ${name}`);
  } else {
      let command = line.split(" ")
      socket.send(`${command[0]} ${name} ${command[1]}`);
  }

});