import * as gameService from "../service/GameService";
import { Log } from '../model/log';
import { verifyConsistentHash } from '../util/hashUtil';
import gameFactory from "../factory/gameFactory";
import { datasource } from "../model/datasource";
import * as logUtil from "../util/logUtil"
import * as kafkaUtil from "../util/kafkaUtil"
import { getClient } from "../util/grpcClientUtil"

const port = process.argv[3] != null ? process.argv[3] : process.argv[2]
const kafkaTopicReply = "send-command-response-" + port
const kafkaTopicRequest = "send-command-request-" + port

kafkaUtil.createConsumer(kafkaTopicRequest, message => {
    const { username, room, text } = message.request
    logUtil.save(new Log(logUtil.action.send, message.request))
    gameService.send(username, room, text)
    kafkaUtil.createProducer(kafkaTopicReply, JSON.stringify({
        response: {},
        id: message.id
    }))
})
// Receive message from client joining
export async function join(call, callback) {
    const { room, username } = call.request
    const serverTarget = verifyConsistentHash(room)
    console.log(serverTarget)
    if (serverTarget.port != null) {
        const grpcClient = await getClient(serverTarget.clients)
        const socket = grpcClient.join({ username: username, room: room })
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
export async function send(call, callback) {

    const { username, room, text } = call.request
    const serverTarget = verifyConsistentHash(room)
    console.log(serverTarget)
    if (serverTarget.port != null) {
        const grpcClient = await getClient(serverTarget.clients)
        grpcClient.send({ username: username, room: room, text: text }, () => { })
    } else {
        // console.log(username, room, text)
        // logUtil.save(new Log(logUtil.action.send, call.request))
        // gameService.send(username, room, text)
        console.log("comando send recebido",call.request )
        const id = Math.random() * Math.pow(10, 9)
        kafkaUtil.createConsumer(kafkaTopicReply, message => {
            if (message.id == id) {
                callback(null, {})
            }
        })
        kafkaUtil.createProducer(kafkaTopicRequest, JSON.stringify({
            request: call.request,
            id: id
        }))
    }

}