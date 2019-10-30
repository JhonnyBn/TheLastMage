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

var Start =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(Start, _DefaultAction);

  function Start(nextAction) {
    var _this;

    (0, _classCallCheck2["default"])(this, Start);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Start).call(this, nextAction, "start", Start.prototype.processCommand));
    _this.helpMsg = "start -> To start the game.";
    return _this;
  }

  (0, _createClass2["default"])(Start, [{
    key: "processCommand",
    value: function processCommand(game) {
      if (!game.running) {
        game.run();
      } else {
        game.sender.sendMsgToCurrentClient("Game already started.");
      }
    }
  }]);
  return Start;
}(_actionDefaultClass["default"]);

exports["default"] = Start;
//# sourceMappingURL=start.js.map