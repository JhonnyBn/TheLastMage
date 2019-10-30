"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var not_found_action_msg = "Command not found type \"help\" for the commands information.";

var DefaultAction =
/*#__PURE__*/
function () {
  function DefaultAction(nextAction, key, callBack) {
    (0, _classCallCheck2["default"])(this, DefaultAction);
    this.nextAction = nextAction;
    this.key = key;
    this.callBack = callBack;
  }

  (0, _createClass2["default"])(DefaultAction, [{
    key: "process",
    value: function process(game, input) {
      var _this$openInput = this.openInput(input),
          command = _this$openInput.command;

      if (command == this.key) {
        this.callBack(game, input);
        return;
      }

      if (this.nextAction) {
        this.nextAction.process(game, input);
      } else {
        game.sender.sendMsgToCurrentClient(not_found_action_msg);
      }
    }
  }, {
    key: "openInput",
    value: function openInput(input) {
      var inputSplited = input.split(" ");
      var command = inputSplited[0];
      inputSplited.shift();
      var param = inputSplited;
      return {
        command: command,
        param: param
      };
    }
  }]);
  return DefaultAction;
}();

exports["default"] = DefaultAction;
//# sourceMappingURL=actionDefaultClass.js.map