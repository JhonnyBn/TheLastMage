"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _actionDefaultClass = _interopRequireDefault(require("../actionDefaultClass"));

var Chat =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(Chat, _DefaultAction);

  function Chat(nextAction) {
    var _this;

    (0, _classCallCheck2["default"])(this, Chat);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Chat).call(this, nextAction, "chat", Chat.prototype.processCommand));
    _this.helpMsg = "chat [msg] -> To say something in the chat.";
    return _this;
  }

  (0, _createClass2["default"])(Chat, [{
    key: "processCommand",
    value: function processCommand(game, input) {
      var _get$call = (0, _get2["default"])((0, _getPrototypeOf2["default"])(Chat.prototype), "openInput", this).call(this, input),
          param = _get$call.param;

      var playerName = param[0];

      if (playerName == undefined) {
        game.sender.sendMsgToCurrentClient("Please inform a playerNameOrigin.");
        return;
      }

      param.shift();
      var msg = param.join(" ");

      if (param == undefined) {
        game.sender.sendMsgToCurrentClient("Please inform a msg.");
      }

      game.sender.sendMsgToAllButIgnoreCurrentClient("chat ".concat(playerName, ": ").concat(msg));
      game.sender.sendMsgToCurrentClient("sended: ".concat(msg));
    }
  }]);
  return Chat;
}(_actionDefaultClass["default"]);

exports["default"] = Chat;
//# sourceMappingURL=chat.js.map