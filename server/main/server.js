import socketIo from "socket.io"
import gameFactory from "./factory/gameFactory"


const socket = socketIo();
const currentGame = gameFactory()

socket.on("connection", client => {
  console.log("client connected");
  currentGame.sender.connections.push(client);
  client.on("message", value => {
    currentGame.sender.currentClient = client;
    currentGame.processInput(value);
  });
});
socket.listen(8080);

console.log("Started.")