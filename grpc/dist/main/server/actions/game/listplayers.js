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

var ListPlayers =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(ListPlayers, _DefaultAction);

  function ListPlayers(nextAction) {
    var _this;

    (0, _classCallCheck2["default"])(this, ListPlayers);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ListPlayers).call(this, nextAction, "listplayers", ListPlayers.prototype.processCommand));
    _this.helpMsg = "listplayers -> To list the name of all players in the game.";
    return _this;
  }

  (0, _createClass2["default"])(ListPlayers, [{
    key: "processCommand",
    value: function processCommand(game) {
      game.listPlayers();
    }
  }]);
  return ListPlayers;
}(_actionDefaultClass["default"]);

exports["default"] = ListPlayers;
//# sourceMappingURL=listplayers.js.map