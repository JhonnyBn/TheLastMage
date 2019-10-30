"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var protoLoader = _interopRequireWildcard(require("@grpc/proto-loader"));

var grpc = _interopRequireWildcard(require("grpc"));

var readline = _interopRequireWildcard(require("readline"));

//Read terminal Lines
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
}); //Load the protobuf

var proto = grpc.loadPackageDefinition(protoLoader.loadSync("protos/game.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}));
var REMOTE_SERVER = "0.0.0.0:5001";
var username; //Create gRPC client

var client = new proto.game.Actions(REMOTE_SERVER, grpc.credentials.createInsecure()); //Start the stream between server and client

function startChat() {
  var channel = client.join({
    user: username
  });
  channel.on("data", onData);
  rl.on("line", function (text) {
    client.send({
      user: username,
      text: text
    }, function (res) {});
  });
} //When server send a message


function onData(message) {
  console.log(message);
  console.log("".concat(message.user, ": ").concat(message.text));
} //Ask user name then start the chat


rl.question("What's ur name? ", function (answer) {
  username = answer;
  startChat();
});
//# sourceMappingURL=client.js.map