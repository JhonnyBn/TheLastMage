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

var Attack =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(Attack, _DefaultAction);

  function Attack(nextAction) {
    var _this;

    (0, _classCallCheck2["default"])(this, Attack);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Attack).call(this, nextAction, "attack", Attack.prototype.processCommand));
    _this.helpMsg = "attack [TargetPlayerName] -> To attack other player.";
    return _this;
  }

  (0, _createClass2["default"])(Attack, [{
    key: "processCommand",
    value: function processCommand(game, input) {
      if (game.running == 0) {
        game.sender.sendMsgToCurrentClient("Game is not running.");
        return;
      }

      var _get$call = (0, _get2["default"])((0, _getPrototypeOf2["default"])(Attack.prototype), "openInput", this).call(this, input),
          param = _get$call.param;

      var playerName = param[0];

      if (playerName == undefined) {
        game.sender.sendMsgToCurrentClient("Please inform a playerNameOrigin.");
        return;
      }

      var targetName = param[1];

      if (targetName == undefined) {
        game.sender.sendMsgToCurrentClient("Please inform a playerNameTarget.");
        return;
      }

      var target = game.getPlayerByName(targetName);

      if (target == undefined) {
        game.sender.sendMsgToCurrentClient("PlayerNameTarget not found.");
        return;
      }

      var player = game.getPlayerByName(playerName);

      if (player == undefined) {
        game.sender.sendMsgToCurrentClient("playerNameOrigin not found.");
        return;
      }

      console.log(player);

      if (game.isTheTurnOfThePlayer(playerName)) {
        game.sender.sendMsgToAll(playerName + " is attacking " + targetName + "...");
        console.log(player);

        if (player.attack(target)) {
          game.sender.sendMsgToAll("Success! Dealt " + player.attackDamage + " damage.");
          target.checkLife();
        } else {
          game.sender.sendMsgToAll("Fail! He or she blocked the attack.");
        }

        game.setNextPlayer();
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
  return Attack;
}(_actionDefaultClass["default"]);

exports["default"] = Attack;
//# sourceMappingURL=attack.js.map