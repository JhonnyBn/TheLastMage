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

var _actionDefaultClass = _interopRequireDefault(require("./actionDefaultClass"));

var Help =
/*#__PURE__*/
function (_DefaultAction) {
  (0, _inherits2["default"])(Help, _DefaultAction);

  function Help(nextAction) {
    (0, _classCallCheck2["default"])(this, Help);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Help).call(this, nextAction, "help", Help.prototype.processCommand));
  }

  (0, _createClass2["default"])(Help, [{
    key: "processCommand",
    value: function processCommand(game) {
      var helpMsgs = "Help:\n" + this.getHelpMsg(game.action);
      game.sender.sendMsgToCurrentClient(helpMsgs);
    }
  }, {
    key: "getHelpMsg",
    value: function getHelpMsg(action) {
      if (action == undefined) return "";
      if (action instanceof Help) return this.getHelpMsg(action.nextAction);
      return action.helpMsg + "\n" + this.getHelpMsg(action.nextAction);
    }
  }]);
  return Help;
}(_actionDefaultClass["default"]);

exports["default"] = Help;
//# sourceMappingURL=help.js.map