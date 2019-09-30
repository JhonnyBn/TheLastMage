import assert from "assert";
import clientSocket from "socket.io-client"
import main from "../main/server"

let mockDatabase = {
  saveMsg: () => new Promise(resolve => resolve()),
  loadMsgs: () => { }
}

describe("Attack Command", function () {

  this.timeout(15000);
  it("attack player with more than 1 connection.", function () {
    let testPromise = new Promise(async resolve => {
      const { currentGame, socket } = await main(mockDatabase)
      const socketClient1 = clientSocket("http://localhost:8080")
      const socketClient2 = clientSocket("http://localhost:8080")
      socketClient1.on("connect", function () {
        console.log("Connected to the server.");
        socketClient1.send("join vinicius")
        
        socketClient1.on("message",value => {
          if(value.match("The game has started!"))
          {
            socketClient1.send("attack vinicius clemente")
          }
          if(value.match("clemente has now 75 life."))
          {
            resolve({ currentGame, socket })
            socketClient1.close()
            socketClient2.close()
          }
        })
      });
      socketClient2.on("connect", function () {
        console.log("Connected to the server.");
        socketClient2.send("join clemente")
        socketClient2.send("start")
        
       
      });

    }
    )
    return testPromise.then(function (result) {
      const { currentGame, socket } = result
      console.log(currentGame)
      assert.equal(currentGame.players.length, 2)
      assert.equal(currentGame.running, 1)
      assert.equal(currentGame.players.reduce((a,b) => a.life+b.life), 175)
      socket.close()
    });
  });
});