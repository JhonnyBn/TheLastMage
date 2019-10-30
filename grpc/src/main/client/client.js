import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';
import * as readline from 'readline'

//Read terminal Lines
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Load the protobuf
var proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("protos/game.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const REMOTE_SERVER = "0.0.0.0:5001";

let username;

//Create gRPC client
let client = new proto.game.Actions(
    REMOTE_SERVER,
    grpc.credentials.createInsecure()
);

//Start the stream between server and client
function startChat() {
    let channel = client.join({ user: username }, { user: username });

    channel.on("data", onData);

    rl.on("line", function (text) {
        client.send({ user: username, text: text }, res => { });
    });
}

//When server send a message
function onData(message) {
    console.log(message)
    console.log(`${message.user}: ${message.text}`);
}

//Ask user name then start the chat
rl.question("What's ur name? ", answer => {
    username = answer;

    startChat();
});