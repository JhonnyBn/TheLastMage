import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';
import loginController from "./controller/LoginController"
import * as logUtil from "./util/logUtil"
import { createRoom, listRooms } from './controller/RoomController';
import { serverProperties } from "./model/datasource"
import fs from "fs"
import { hashOf } from './util/hashUtil';
import { join, send } from './controller/GameController';


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
    const port = process.argv[3] != null ? process.argv[3] : serverProperties.port.toString()
    const fileRouteName = hashOf(port) + ".json"
    const routes = JSON.parse(fs.readFileSync(fileRouteName), "utf8")
    serverProperties.routes = routes
    serverProperties.routes.fingerprinting.forEach(element => {
        var proto = loadProto()

        const remoteServers = []
        remoteServers[0] = `0.0.0.0:${element.port}`
        remoteServers[1] = `0.0.0.0:${(element.port + 100)}`
        remoteServers[2] = `0.0.0.0:${(element.port + 200)}`
        element.clients = remoteServers.map(
            server => new proto.game.Actions(
                server,
                grpc.credentials.createInsecure(),
                {
                    'grpc.min_reconnect_backoff_ms': 1000,
                    'grpc.max_reconnect_backoff_ms': 100000,
                }
            )
        )

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
        listRooms: listRooms,
        ping:ping
    });

    server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

    server.start();

    logUtil.load()
}

function ping(call, callback){
    callback(null, {status:200})
}


loadServerProperties()
main()