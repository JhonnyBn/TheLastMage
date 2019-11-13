import * as gameService from "../service/GameService";
import { Log } from '../model/log';
import { verifyConsistentHash } from '../util/hashUtil';
import gameFactory from "../factory/gameFactory";
import { datasource } from "../model/datasource";
import * as logUtil from "../util/logUtil"

// Receive message from client joining
export function join(call, callback) {
    const { room, username } = call.request
    const serverTarget = verifyConsistentHash(room)
    console.log(serverTarget)
    if (serverTarget.port != null) {
        const socket = serverTarget.client.join({ username: username, room: room })
        socket.on("data", message => { call.write(message) })
        socket.on('error', () => { })

    } else {
        if (datasource.games == undefined) datasource.games = []
        const currentGame = datasource.games.find(game => game.name == room)
        if (currentGame == undefined) {
            datasource.games.push({
                name: room,
                clients: [call],
                game: gameFactory(room)
            })
        } else {
            currentGame.clients.push(call)
        }
        console.log("client connected");
        call.write({ user: "Server", text: "new user joined ..." })

    }
}

// Receive message from client
export function send(call, callback) {

    const { username, room, text } = call.request
    const serverTarget = verifyConsistentHash(room)
    console.log(serverTarget)
    if (serverTarget.port != null) {
        serverTarget.client.send({ username: username, room: room, text: text }, () => { })
    } else {
        console.log(username, room, text)
        logUtil.save(new Log(logUtil.action.send, call.request))
        gameService.send(username, room, text)
    }

}