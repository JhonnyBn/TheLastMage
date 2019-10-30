"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var protoLoader = _interopRequireWildcard(require("@grpc/proto-loader"));

var grpc = _interopRequireWildcard(require("grpc"));

var datasourceUtil = _interopRequireWildcard(require("./datasource"));

var _gameFactory = _interopRequireDefault(require("./factory/gameFactory"));

var server = new grpc.Server();
var SERVER_ADDRESS = "0.0.0.0:5001";
var PROTO_PATH = __dirname + '../../../../protos/game.proto'; // Load protobuf

var proto = grpc.loadPackageDefinition(protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})); // Receive message from client joining

function join(call, callback) {
  console.log("client connected");
  console.log(call);
  currentGame.sender.connections.push(call);
  call.write({
    user: "Server",
    text: "new user joined ..."
  });
}

var currentGame = (0, _gameFactory["default"])();

/*#__PURE__*/
(0, _asyncToGenerator2["default"])(
/*#__PURE__*/
_regenerator["default"].mark(function _callee() {
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return datasourceUtil.loadMsgs(currentGame);

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})); // Receive message from client

function send(call, callback) {
  datasourceUtil.saveMsg(call.request.text);
  currentGame.sender.currentClient = call.request.user;
  console.log(call.request);
  currentGame.processInput(call.request.text);
} // Define server with the methods and start it


server.addService(proto.game.Actions.service, {
  join: join,
  send: send
});
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();
//# sourceMappingURL=server.js.map