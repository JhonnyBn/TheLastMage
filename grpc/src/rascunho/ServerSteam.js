import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';

const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";
const PROTO_PATH = __dirname + '../../../protos/chat.proto';

// Load protobuf
let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let users = [];

// Receive message from client joining
function join(call, callback) {
    console.log(call)
    users.push(call);
    notifyChat({ user: "Server", text: "new user joined ..." });
}

// Receive message from client
function send(call, callback) {
    console.log(call)
    notifyChat(call.request);
}

// Send message to all connected clients
function notifyChat(message) {
    users.forEach(user => {
        user.write(message);
    });
}

// Define server with the methods and start it
server.addService(proto.example.Chat.service, { join: join, send: send });

server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

server.start();