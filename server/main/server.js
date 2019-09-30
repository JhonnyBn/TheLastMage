import socketIo from "socket.io"
import gameFactory from "./factory/gameFactory"

export default async function main(datasourceUtil) {
  return new Promise(async resolve => {
    const socket = socketIo();
    const currentGame = gameFactory()

    await datasourceUtil.loadMsgs(currentGame);

    socket.on("connection", client => {
      console.log("client connected");
      currentGame.sender.connections.push(client);
      client.on("message", value => {
        datasourceUtil.saveMsg(value)
        currentGame.sender.currentClient = client;
        currentGame.processInput(value);
      });
    });
    socket.listen(8080);

    console.log("Started.")

    resolve(currentGame);
  });
}