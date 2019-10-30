"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var grpc = _interopRequireWildcard(require("grpc"));

var protoLoader = _interopRequireWildcard(require("@grpc/proto-loader"));

var PROTO_PATH = __dirname + '../../../protos/helloworld.proto';
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
  var client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  var user;

  if (process.argv.length >= 3) {
    user = process.argv[2];
  } else {
    user = 'world';
  }

  client.sayHello({
    name: user
  }, function (err, response) {
    console.log('Greeting:', response.message);
  });
}

main();
//# sourceMappingURL=Client.js.map