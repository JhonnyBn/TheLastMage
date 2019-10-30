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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _actionDefaultClass = _interopRequireDefault(require("../actionDefaultClass"));

var Reset =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(Reset, _DefaultAction);

  function Reset(nextAction) {
    var _this;

    (0, _classCallCheck2["default"])(this, Reset);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Reset).call(this, nextAction, "reset", Reset.prototype.processCommand));
    _this.helpMsg = "reset -> To reset the game.";
    return _this;
  }

  (0, _createClass2["default"])(Reset, [{
    key: "processCommand",
    value: function processCommand(game) {
      if (game.running) {
        game.resetGame();
      } else {
        game.sender.sendMsgToCurrentClient("Game is not running.");
      }
    }
  }]);
  return Reset;
}(_actionDefaultClass["default"]);

exports["default"] = Reset;
//# sourceMappingURL=reset.js.map