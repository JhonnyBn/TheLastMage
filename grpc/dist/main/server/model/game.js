"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _mage = _interopRequireDefault(require("./mage"));

var Game =
/*#__PURE__*/
function () {
  function Game(sender, action) {
    (0, _classCallCheck2["default"])(this, Game);
    this.sender = sender;
    this.players = new Array();
    this.turn = 0;
    this.currentPlayer = null;
    this.running = 0;
    this.action = action;
  } // Inicia o jogo


  (0, _createClass2["default"])(Game, [{
    key: "run",
    value: function run() {
      if (this.players.length < 2) {
        this.sender.sendMsgToCurrentClient("between 2 and 4 playter to start the game.");
        return;
      }

      this.running = 1;
      this.sender.sendMsgToAll("The game has started!\n");
      this.setNextPlayer();
    } // Reseta o jogo

  }, {
    key: "resetGame",
    value: function resetGame() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var player = _step.value;
          player.reset();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.turn = 0;
      this.currentPlayer = null;
      this.running = 0;
      this.sender.sendMsgToAll("The game has been reset.\nSay 'start' to begin a new game.\n");
    } // Reboota o jogo (reseta e remove personagens)

  }, {
    key: "rebootGame",
    value: function rebootGame() {
      this.players = new Array();
      this.turn = 0;
      this.currentPlayer = null;
      this.running = 0;
      this.sender.sendMsgToAll("The game has been rebooted.\nSay 'join' to join again and 'start' to begin a new game.\n");
    } // Retorna True se haver somente um jogador vivo

  }, {
    key: "isGameFinished",
    value: function isGameFinished() {
      var nPlayersAlive = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.players[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var player = _step2.value;
          if (player.alive) nPlayersAlive += 1;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return nPlayersAlive < 2;
    } // Parabeniza o vencedor do jogo

  }, {
    key: "congratulateWinner",
    value: function congratulateWinner() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.players[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var player = _step3.value;

          if (player.alive) {
            this.sender.sendMsgToAll("Congratulations " + player.name + "! You won the game!\n");
            return;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    } // Adiciona um novo jogador

  }, {
    key: "addPlayer",
    value: function addPlayer(name) {
      // O nome nao pode estar vazio
      if (name === "") {
        this.sender.sendMsgToCurrentClient("Your name cant be blank. Please choose another.");
        return;
      } // Se o nome ja existe, nao adiciona


      if (this.getPlayerByName(name) != undefined) {
        this.sender.sendMsgToCurrentClient("Name already in use. Please choose another.");
        return;
      }

      this.players.push(new _mage["default"](name, this.sender));
      this.sender.sendMsgToCurrentClient("Welcome to the game, " + name + "!\n");
      this.sender.sendMsgToAllButIgnoreCurrentClient(name + " joined the game");
    } // Retorna um jogador com base em seu NAME

  }, {
    key: "getPlayerByName",
    value: function getPlayerByName(name) {
      return this.players.find(function (mage) {
        return mage.name == name;
      });
    } // Lista o nome dos jogadores em jogo

  }, {
    key: "listPlayers",
    value: function listPlayers() {
      var names = "";
      this.players.map(function (player) {
        return names += player.name + ", ";
      });
      names = names.slice(0, -2);

      if (names === "") {
        this.sender.sendMsgToCurrentClient("There are no players in the game.");
      } else {
        this.sender.sendMsgToCurrentClient("Players in the game: " + names);
      }

      return names;
    } // Prepara a proxima rodada

  }, {
    key: "setNextPlayer",
    value: function setNextPlayer() {
      var nplayers = this.players.length;
      this.currentPlayer = this.players[(this.turn % nplayers + nplayers) % nplayers];
      this.turn += 1;
      this.currentPlayer.disableShield(); // Se o jogador morreu, verifica se o jogo acabou
      // Caso tenha acabado, reinicia o jogo
      // Caso ainda nao tenha acabado, continua

      if (!this.currentPlayer.alive) {
        if (this.isGameFinished()) {
          this.congratulateWinner();
          this.resetGame();
        } else this.setNextPlayer();
      }
    } // Processa o texto de input para realizar as acoes do jogo

  }, {
    key: "processInput",
    value: function processInput(input) {
      this.action.process(this, input);
    }
  }, {
    key: "isTheTurnOfThePlayer",
    value: function isTheTurnOfThePlayer(playerName) {
      return this.currentPlayer.name == playerName;
    }
  }]);
  return Game;
}();

exports["default"] = Game;
//# sourceMappingURL=game.js.map