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

var Reboot =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(Reboot, _DefaultAction);

  function Reboot(nextAction) {
    var _this;

    (0, _classCallCheck2["default"])(this, Reboot);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Reboot).call(this, nextAction, "reboot", Reboot.prototype.processCommand));
    _this.helpMsg = "reboot -> To reboot the game (reset and remove all players).";
    return _this;
  }

  (0, _createClass2["default"])(Reboot, [{
    key: "processCommand",
    value: function processCommand(game) {
      game.rebootGame();
    }
  }]);
  return Reboot;
}(_actionDefaultClass["default"]);

exports["default"] = Reboot;
//# sourceMappingURL=reboot.js.map