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

var SpecialAttack =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(SpecialAttack, _DefaultAction);

  function SpecialAttack(nextAction) {
    var _this;

    (0, _classCallCheck2["default"])(this, SpecialAttack);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SpecialAttack).call(this, nextAction, "specialattack", SpecialAttack.prototype.processCommand));
    _this.helpMsg = "specialattack [TargetPlayerName] -> To use special attack on other player.";
    return _this;
  }

  (0, _createClass2["default"])(SpecialAttack, [{
    key: "processCommand",
    value: function processCommand(game, input) {
      if (game.running == 0) {
        game.sender.sendMsgToCurrentClient("Game is not running.");
        return;
      }

      var _get$call = (0, _get2["default"])((0, _getPrototypeOf2["default"])(SpecialAttack.prototype), "openInput", this).call(this, input),
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

      if (game.isTheTurnOfThePlayer(playerName)) {
        if (game.currentPlayer.specialAttacksLeft < 1) {
          game.sender.sendMsgToCurrentClient("You can't use more special attacks this game.");
          return;
        }

        game.sender.sendMsgToAll(player.name + " is using special attack on " + target.name + "...");

        if (player.specialAttack(target)) {
          game.sender.sendMsgToAll("Success! Dealt " + player.specialDamage + " damage.");
          target.checkLife();
        } else {
          game.sender.sendMsgToAll("Fail! He or she blocked the special attack.");
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
  return SpecialAttack;
}(_actionDefaultClass["default"]);

exports["default"] = SpecialAttack;
//# sourceMappingURL=specialattack.js.map