"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var protoLoader = _interopRequireWildcard(require("@grpc/proto-loader"));

var grpc = _interopRequireWildcard(require("grpc"));

var server = new grpc.Server();
var SERVER_ADDRESS = "0.0.0.0:5001";
var PROTO_PATH = __dirname + '../../../protos/chat.proto'; // Load protobuf

var proto = grpc.loadPackageDefinition(protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}));
var users = []; // Receive message from client joining

function join(call, callback) {
  console.log(call);
  users.push(call);
  notifyChat({
    user: "Server",
    text: "new user joined ..."
  });
} // Receive message from client


function send(call, callback) {
  console.log(call);
  notifyChat(call.request);
} // Send message to all connected clients


function notifyChat(message) {
  users.forEach(function (user) {
    user.write(message);
  });
} // Define server with the methods and start it


server.addService(proto.example.Chat.service, {
  join: join,
  send: send
});
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();
//# sourceMappingURL=ServerSteam.js.map