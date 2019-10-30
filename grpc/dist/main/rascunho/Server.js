"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var GrpcUtil = _interopRequireWildcard(require("./util/GrpcUtil"));

var grpc = _interopRequireWildcard(require("grpc"));

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  callback(null, {
    message: 'Hello ' + call.request.name
  });
}
/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */


function main() {
  var server = new grpc.Server();
  server.addService(GrpcUtil.buildProtos().Greeter.service, {
    sayHello: sayHello
  });
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
//# sourceMappingURL=Server.js.map