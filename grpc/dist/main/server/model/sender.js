"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Sender =
/*#__PURE__*/
function () {
  function Sender(connections) {
    (0, _classCallCheck2["default"])(this, Sender);
    this.connections = connections;
    this.currentClient = null;
  }

  (0, _createClass2["default"])(Sender, [{
    key: "sendMsgToAll",
    value: function sendMsgToAll(msg) {
      this.connections.forEach(function (connection) {
        connection.write({
          user: currentClient,
          text: msg
        });
        console.log(msg);
      });
    }
  }, {
    key: "sendMsgToAllButIgnoreCurrentClient",
    value: function sendMsgToAllButIgnoreCurrentClient(msg) {
      this.connections.forEach(function (connection) {
        connection.write({
          user: currentClient,
          text: msg
        });
      });
      console.log(msg);
    }
  }, {
    key: "sendMsgToCurrentClient",
    value: function sendMsgToCurrentClient(msg) {
      var _this = this;

      console.log(this.connections);
      this.connections.forEach(function (client) {
        return client.write({
          user: _this.currentClient,
          text: msg
        });
      });
      console.log(msg);
    }
  }]);
  return Sender;
}();

exports["default"] = Sender;
//# sourceMappingURL=sender.js.map