import assert from "assert";
import clientSocket from "socket.io-client"
import main from "../main/server"
import * as datasource from "../main/datasource"

describe("Datasource Test", function () {

	this.timeout(15000);
	it("save join commands", function () {
		let testPromise = new Promise(async resolve => {
			datasource.deleteDatasource()
			const { currentGame, socket } = await main(datasource)
			const socketClient1 = clientSocket("http://localhost:8080")
			socketClient1.on("connect", function () {
				console.log("Connected to the server.");
				socketClient1.send("join vinicius")
				socketClient1.send("join clemente")
				socketClient1.send("start")
				let count = 0
				socketClient1.on("message", async () => {
					count++
					if (count == 3) {
						socket.close()
						const main2 = await main(datasource)
						resolve(main2)
						socketClient1.close()

					}

				})
			});

		}
		)
		return testPromise.then(function (result) {
			const { currentGame, socket } = result
			assert.equal(currentGame.running, 1)
			assert.equal(currentGame.players.length, 2)
			socket.close()
			datasource.deleteDatasource()
		});
	});

});