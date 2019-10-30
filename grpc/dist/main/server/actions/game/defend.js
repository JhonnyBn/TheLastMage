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

var Defend =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(Defend, _DefaultAction);

  function Defend(nextAction) {
    var _this;

    (0, _classCallCheck2["default"])(this, Defend);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Defend).call(this, nextAction, "defend", Defend.prototype.processCommand));
    _this.helpMsg = "defend -> To defend yourself this turn.";
    return _this;
  }

  (0, _createClass2["default"])(Defend, [{
    key: "processCommand",
    value: function processCommand(game, input) {
      if (game.running == 0) {
        game.sender.sendMsgToCurrentClient("Game is not running.");
        return;
      }

      var _get$call = (0, _get2["default"])((0, _getPrototypeOf2["default"])(Defend.prototype), "openInput", this).call(this, input),
          param = _get$call.param;

      var playerName = param[0];

      if (playerName == undefined) {
        game.sender.sendMsgToCurrentClient("Please inform a playerNameOrigin.");
        return;
      }

      var player = game.getPlayerByName(playerName);

      if (player == undefined) {
        game.sender.sendMsgToCurrentClient("playerNameOrigin not found.");
        return;
      }

      if (game.isTheTurnOfThePlayer(playerName)) {
        player.defend();
        game.setNextPlayer();
        game.sender.sendMsgToCurrentClient("Defending until next turn.");
        game.sender.sendMsgToAllButIgnoreCurrentClient(player.name + " is defending until next turn.");
      } else {
        if (!player.alive) {
          game.sender.sendMsgToCurrentClient("You are dead. Please wait for the game to finish or start a new game.");
        } else {
          game.sender.sendMsgToCurrentClient('Please wait for your turn, or type "help" for the commands information.');
        }

        return;
      }
    }
  }]);
  return Defend;
}(_actionDefaultClass["default"]);

exports["default"] = Defend;
//# sourceMappingURL=defend.js.map