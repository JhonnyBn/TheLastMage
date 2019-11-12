import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';
import gameFactory from "./factory/gameFactory"
import loginController from "./controller/LoginController"
import * as logUtil from "./util/logUtil"
import { createRoom, listRooms } from './controller/RoomController';
import { serverProperties, datasource } from "./model/datasource"
import fs from "fs"
import { hashOf, verifyConsistentHash } from './util/hashUtil';
import * as gameService from "./service/GameService";
import { Log } from './model/log';

function loadProto() {
    const PROTO_PATH = __dirname + '../../../../protos/game.proto';

    // Load protobuf
    return grpc.loadPackageDefinition(
        protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        })
    );
}
function loadServerProperties() {
    serverProperties.port = parseInt(process.argv[2])
    serverProperties.logSizeCacheSize = 3
    serverProperties.logServerPrefix = serverProperties.port + "_log_server"
    console.log(serverProperties.port.toString(), hashOf(serverProperties.port.toString()))
    const fileRouteName = hashOf(serverProperties.port.toString()) + ".json"
    const routes = JSON.parse(fs.readFileSync(fileRouteName), "utf8")
    serverProperties.routes = routes
    serverProperties.routes.forEach(element => {

        if (element.port != null) {
            var proto = loadProto()

            const REMOTE_SERVER = `0.0.0.0:${element.port}`
            //Create gRPC client
            const client = new proto.game.Actions(
                REMOTE_SERVER,
                grpc.credentials.createInsecure()
            )
            element.client = client
        }
    });
    if (isNaN(serverProperties.port)) throw ("Please set a port.")

}

function main() {

    const server = new grpc.Server();
    const SERVER_ADDRESS = `0.0.0.0:${serverProperties.port}`;
    const proto = new loadProto;

    // Define server with the methods and start it
    server.addService(proto.game.Actions.service, {
        join: join,
        send: send,
        login: loginController,
        createRoom: createRoom,
        listRooms: listRooms
    });

    server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

    server.start();

    logUtil.load()
}

// Receive message from client joining
function join(call, callback) {
    const { room, username } = call.request
    console.log(call.request)
    const serverTarget = verifyConsistentHash(room)
    console.log(serverTarget)
    if (serverTarget.port != null) {
        const socket = serverTarget.client.join({ username: username, room: room })
        socket.on("data", message => { call.write(message) })

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
    console.log(datasource.games)
}

// Receive message from client
function send(call, callback) {

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
loadServerProperties()
main()