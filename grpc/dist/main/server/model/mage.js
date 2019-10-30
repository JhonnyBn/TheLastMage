"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var mage =
/*#__PURE__*/
function () {
  function mage(name, sender) {
    (0, _classCallCheck2["default"])(this, mage);
    this.name = name;
    this.sender = sender;
    this.life = 100;
    this.alive = 1;
    this.attackDamage = 25;
    this.specialDamage = 50;
    this.defending = 0;
    this.specialAttacksLeft = 3;
  }

  (0, _createClass2["default"])(mage, [{
    key: "reset",
    value: function reset() {
      this.life = 100;
      this.alive = 1;
      this.attackDamage = 25;
      this.specialDamage = 50;
      this.defending = 0;
      this.specialAttacksLeft = 3;
    }
  }, {
    key: "checkLife",
    value: function checkLife() {
      if (this.life <= 0) {
        this.sender.sendMsgToAll(this.name + " just died.\n");
        this.alive = 0;
      } else {
        this.sender.sendMsgToAll(this.name + " has now " + this.life + " life.\n");
      }
    } // Ataca um jogador,
    // retorna 1 se obteve sucesso, 0 caso contrário

  }, {
    key: "attack",
    value: function attack(target) {
      if (target.isValid()) {
        target.life -= this.attackDamage;
        return 1;
      }

      return 0;
    } // Ataca um jogador com o especial,
    // retorna 1 se obteve sucesso, 0 caso contrario

  }, {
    key: "specialAttack",
    value: function specialAttack(target) {
      this.specialAttacksLeft -= 1;

      if (target.isValid()) {
        target.life -= this.specialDamage;
        return 1;
      }

      return 0;
    } // Defende para nao ser atacado por um turno

  }, {
    key: "defend",
    value: function defend() {
      this.defending = 1;
    } // A cada turno a defesa deve ser resetada

  }, {
    key: "disableShield",
    value: function disableShield() {
      this.defending = 0;
    } // Verifica se o jogador eh um alvo valido
    // Ele eh valido se nao estiver defendendo

  }, {
    key: "isValid",
    value: function isValid() {
      return !this.defending && this.alive;
    }
  }]);
  return mage;
}();

exports["default"] = mage;
//# sourceMappingURL=mage.js.map