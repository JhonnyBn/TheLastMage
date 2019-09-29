import socketIo from "socket.io"
import gameFactory from "./factory/gameFactory"
import * as datasource from "./datasource"

const socket = socketIo();
const currentGame = gameFactory()

async function main() {

  await datasource.loadMsgs(currentGame);

  socket.on("connection", client => {
    console.log("client connected");
    currentGame.sender.connections.push(client);
    client.on("message", value => {
      datasource.saveMsg(value)
      currentGame.sender.currentClient = client;
      currentGame.processInput(value);
      //datasource.save(currentGame);
    });
  });
  socket.listen(8080);

  console.log("Started.")
}

main()
//datasource.load(currentGame);
