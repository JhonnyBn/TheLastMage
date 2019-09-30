import assert from "assert";
import clientSocket from "socket.io-client"
import main from "../main/server"

let mockDatabase = {
  saveMsg: () => new Promise(resolve => resolve()),
  loadMsgs: () => { }
}

describe("Join Command", function () {

  this.timeout(15000);
  it("join player", function () {
    let testPromise = new Promise(async resolve => {
      const { currentGame, socket } = await main(mockDatabase)
      const socketClient1 = clientSocket("http://localhost:8080")
      socketClient1.on("connect", function () {
        console.log("Connected to the server.");
        socketClient1.send("join vinicius")
        socketClient1.on("message",() => {
          resolve({ currentGame, socket })
          socketClient1.close()
        })
      });

    }
    )
    return testPromise.then(function (result) {
      const { currentGame, socket } = result
      assert.equal(currentGame.players.length, 1)
      socket.close()
    });
  });

  it("join player 2 times.", function () {
    let testPromise = new Promise(async resolve => {
      const { currentGame, socket } = await main(mockDatabase)
      currentGame.resetGame()
      const socket1 = clientSocket("http://localhost:8080")
      socket1.on("connect", function () {
        console.log("Connected to the server.");
        socket1.send("join vinicius2")
        socket1.send("join vinicius2")
        socket1.on("message",() => {
          resolve({ currentGame, socket })
          socket1.close()
        })
      });

    }
    )
    return testPromise.then(function (result) {
      const { currentGame, socket } = result
      assert.equal(currentGame.players.length, 1)
      socket.close()
    });
  });

});