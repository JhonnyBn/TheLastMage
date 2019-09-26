const socketIo = require("socket.io");
const readline = require("readline");
const Game = require("./game.js");
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function main() {

  const socket = socketIo();
  const sender = new Sender(new Array());
  const currentGame = new Game(sender)


  socket.on("connection", client => {
    console.log("client connected");
    sender.connections.push(client);
    client.on("message", value => {
      currentGame.processInput(value)
    });
  });
  socket.listen(8080);
}

class Sender {

  constructor(connections) {
    this.connections = connections
  }

  sendMsgToAll(msg) {
    this.connections.forEach(connection => {
      connection.send(msg);
    });
  }

  sendMsgToAllButIgnoreOne(msg, ignoreClient) {
    this.connections
      .filter(client => client != ignoreClient)
      .forEach(connection => {
        connection.send(msg);
      });
  }
}

readlineInterface.on("line", line => sendMsgToAll(line));

main()
