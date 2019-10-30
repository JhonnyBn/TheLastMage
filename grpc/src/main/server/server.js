import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';
import * as datasourceUtil from "./datasource"
import gameFactory from "./factory/gameFactory"

const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";
const PROTO_PATH = __dirname + '../../../../protos/game.proto';

// Load protobuf
const proto = grpc.loadPackageDefinition(
    protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

// Receive message from client joining
function join(call, callback) {
    console.log("client connected");
    currentGame.sender.connections.push(call);
    call.write({ user: "Server", text: "new user joined ..." })
}

const currentGame = gameFactory()
async () => await datasourceUtil.loadMsgs(currentGame);

// Receive message from client
function send(call, callback) {
    datasourceUtil.saveMsg(call.request.text)
    currentGame.sender.currentClient = call.request.user;
    console.log(call.request)
    currentGame.processInput(call.request.text);

}

// Define server with the methods and start it
server.addService(proto.game.Actions.service, { join: join, send: send });

server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

server.start();