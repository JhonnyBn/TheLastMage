import assert from "assert";
import clientSocket from "socket.io-client"
import main from "../main/server"

let mockDatabase = {
  saveMsg: () => new Promise(resolve => resolve()),
  loadMsgs: () => { }
}

describe("Start Command", function () {

  this.timeout(15000);
  it("start succefy", function () {
    let testPromise = new Promise(async resolve => {
      const { currentGame, socket } = await main(mockDatabase)
      const socketClient1 = clientSocket("http://localhost:8080")
      socketClient1.on("connect", function () {
        console.log("Connected to the server.");
        socketClient1.send("join vinicius")
        socketClient1.send("join clemente")
        socketClient1.send("start")
        socketClient1.close()
        setTimeout(() => resolve({ currentGame, socket }), 3000);
      });

    }
    )
    return testPromise.then(function (result) {
      const { currentGame, socket } = result
      assert.equal(currentGame.running, 1)
      socket.close()
    });
  });

  it("start fail because 1 player", function () {
    let testPromise = new Promise(async resolve => {
      const { currentGame, socket } = await main(mockDatabase)
      const socketClient1 = clientSocket("http://localhost:8080")
      socketClient1.on("connect", function () {
        console.log("Connected to the server.");
        socketClient1.send("join vinicius")
        socketClient1.send("start")
        socketClient1.close()
        setTimeout(() => resolve({ currentGame, socket }), 3000);
      });

    }
    )
    return testPromise.then(function (result) {
      const { currentGame, socket } = result
      assert.equal(currentGame.running, 0)
      socket.close()
    });
  });

  it("start fail because 0 player", function () {
    let testPromise = new Promise(async resolve => {
      const { currentGame, socket } = await main(mockDatabase)
      const socketClient1 = clientSocket("http://localhost:8080")
      socketClient1.on("connect", function () {
        console.log("Connected to the server.");
        socketClient1.send("start")
        socketClient1.close()
        setTimeout(() => resolve({ currentGame, socket }), 3000);
      });

    }
    )
    return testPromise.then(function (result) {
      const { currentGame, socket } = result
      assert.equal(currentGame.running, 0)
      socket.close()
    });
  });


});