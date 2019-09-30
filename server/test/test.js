import assert from "assert";
import clientSocket from "socket.io-client"
import main from "../main/server"

let mockDatabase = {
  saveMsg: () => new Promise(resolve => resolve()),
  loadMsgs: () => { }
}

describe("Array", function () {
  describe("#indexOf()", function () {
    this.timeout(15000);
    it("join player", function () {
      let testPromise = new Promise(resolve => {
        const currentGame = main(mockDatabase)
        const socket1 = clientSocket("http://localhost:8080")
        console.log(socket1)
        socket1.on("connect", function () {
          console.log("Connected to the server.");
          socket1.send("join vinicius")

          setTimeout(() => resolve(currentGame), 3000);
        });

      }
      )
      return testPromise.then(function (result) {
        console.log(result)
        assert.equal(result.players.length, 1)
      });
    });
  });
});

