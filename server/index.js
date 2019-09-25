const socketIo = require("socket.io");
const readline = require("readline");
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const socket = socketIo();
const connections = new Array();

socket.on("connection", client => {
  console.log("client connected");
  connections.push(client);
  client.on("message", value => {
    console.log("msg:", value);
    sendMsgToAllButIgnoreOne(
      `Parece que o outro client me mandou uma msg.`,
      client
    );
  });
});
socket.listen(8080);

function sendMsgToAll(msg) {
  connections.forEach(connection => {
    connection.send(msg);
  });
}

function sendMsgToAllButIgnoreOne(msg, ignoreClient) {
  connections
    .filter(client => client != ignoreClient)
    .forEach(connection => {
      connection.send(msg);
    });
}

readlineInterface.on("line", line => sendMsgToAll(line));
