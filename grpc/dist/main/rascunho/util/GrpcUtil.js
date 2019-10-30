"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildProtos = buildProtos;

var grpc = _interopRequireWildcard(require("grpc"));

var protoLoader = _interopRequireWildcard(require("@grpc/proto-loader"));

var PROTO_PATH = __dirname + '../../../../protos/helloworld.proto';

function buildProtos() {
  var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  return grpc.loadPackageDefinition(packageDefinition).helloworld;
}
//# sourceMappingURL=GrpcUtil.js.map