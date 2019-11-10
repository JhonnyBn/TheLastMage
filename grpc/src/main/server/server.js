import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';
import gameFactory from "./factory/gameFactory"
import loginController from "./controller/LoginController"
import * as logUtil from "./util/logUtil"
import { createRoom } from './controller/RoomController';
import { serverProperties } from "./model/datasource"
import fs from "fs"
import { hashOf } from './util/hashUtil';

const currentGame = gameFactory()

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
    const routes = JSON.parse(fs.readFileSync(fileRouteName), "utf8").route
    routes.push({ hash: hashOf(serverProperties.port.toString()) })
    routes.sort((a, b) => a.hash < b.hash ? -1 : a.hash > b.hash ? 1 : 0)
    serverProperties.routes = []
    serverProperties.routes.push(routes[routes.length - 1])
    routes.forEach(route => route.hash != routes[routes.length - 1].hash ? serverProperties.routes.push(route) : null)
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
        createRoom: createRoom
    });

    server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

    server.start();

    logUtil.load()
}

// Receive message from client joining
function join(call, callback) {
    console.log("client connected");
    currentGame.sender.connections.push(call);
    call.write({ user: "Server", text: "new user joined ..." })
}

// Receive message from client
function send(call, callback) {
    datasourceUtil.saveMsg(call.request.text)
    currentGame.sender.currentClient = call.request.user;
    console.log(call.request)
    currentGame.processInput(call.request.text);

}
loadServerProperties()
main()