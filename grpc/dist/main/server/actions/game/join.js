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

var Join =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(Join, _DefaultAction);

  function Join(nextAction) {
    var _this;

    (0, _classCallCheck2["default"])(this, Join);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Join).call(this, nextAction, "join", Join.prototype.processCommand));
    _this.helpMsg = "join -> To join the game again.";
    return _this;
  }

  (0, _createClass2["default"])(Join, [{
    key: "processCommand",
    value: function processCommand(game, input) {
      var _get$call = (0, _get2["default"])((0, _getPrototypeOf2["default"])(Join.prototype), "openInput", this).call(this, input),
          param = _get$call.param; // Nao colocou o nome


      if (!param) {
        game.sender.sendMsgToCurrentClient('To join the game again, please say "join"');
        return;
      } // Adiciona o player


      game.addPlayer(param[0]);
    }
  }]);
  return Join;
}(_actionDefaultClass["default"]);

exports["default"] = Join;
//# sourceMappingURL=join.js.map