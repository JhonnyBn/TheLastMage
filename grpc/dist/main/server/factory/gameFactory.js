"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _game = _interopRequireDefault(require("../model/game"));

var _join = _interopRequireDefault(require("../actions/game/join"));

var _sender = _interopRequireDefault(require("../model/sender"));

var _help = _interopRequireDefault(require("../actions/help"));

var _start = _interopRequireDefault(require("../actions/game/start"));

var _reset = _interopRequireDefault(require("../actions/game/reset"));

var _attack = _interopRequireDefault(require("../actions/game/attack"));

var _defend = _interopRequireDefault(require("../actions/game/defend"));

var _specialattack = _interopRequireDefault(require("../actions/game/specialattack"));

var _chat = _interopRequireDefault(require("../actions/game/chat"));

var _reboot = _interopRequireDefault(require("../actions/game/reboot"));

var _listplayers = _interopRequireDefault(require("../actions/game/listplayers"));

function _default() {
  var sender = new _sender["default"](new Array());
  var join = new _join["default"]();
  var help = new _help["default"](join);
  var start = new _start["default"](help);
  var reset = new _reset["default"](start);
  var attack = new _attack["default"](reset);
  var defend = new _defend["default"](attack);
  var specialAttack = new _specialattack["default"](defend);
  var chat = new _chat["default"](specialAttack);
  var listplayers = new _listplayers["default"](chat);
  var reboot = new _reboot["default"](listplayers);
  return new _game["default"](sender, reboot);
}
//# sourceMappingURL=gameFactory.js.map