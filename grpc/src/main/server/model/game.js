import Mage from "./mage"
import { datasource } from "./datasource";

export default class Game {
    constructor(sender, action, roomName) {
        this.roomName = roomName
        if (datasource.data.game == undefined) datasource.data.game = {}
        if (datasource.data.game[this.roomName] == undefined) {
            datasource.data.game[this.roomName] = {
                players: new Array(),
                turn: 0,
                currentPlayer: null,
                running: 0
            }
        }

        this.sender = sender;
        this.action = action
    }

    // Inicia o jogo
    run() {
        if (datasource.data.game[this.roomName].players.length < 2) {
            this.sender.sendMsgToCurrentClient("between 2 and 4 playter to start the game.")
            return
        }

        datasource.data.game[this.roomName].running = 1;
        this.sender.sendMsgToAll("The game has started!\n");

        this.setNextPlayer();
    }

    // Reseta o jogo
    resetGame() {
        for (var player of datasource.data.game[this.roomName].players) {
            player.reset();
        }
        datasource.data.game[this.roomName].turn = 0;
        datasource.data.game[this.roomName].currentPlayer = null;
        datasource.data.game[this.roomName].running = 0;
        this.sender.sendMsgToAll(
            "The game has been reset.\nSay 'start' to begin a new game.\n"
        );
    }

    // Reboota o jogo (reseta e remove personagens)
    rebootGame() {
        datasource.data.game[this.roomName].players = new Array();
        datasource.data.game[this.roomName].turn = 0;
        datasource.data.game[this.roomName].currentPlayer = null;
        datasource.data.game[this.roomName].running = 0;
        this.sender.sendMsgToAll(
            "The game has been rebooted.\nSay 'join' to join again and 'start' to begin a new game.\n"
        );
    }

    // Retorna True se haver somente um jogador vivo
    isGameFinished() {
        let nPlayersAlive = 0;
        for (var player of datasource.data.game[this.roomName].players) {
            if (player.alive) nPlayersAlive += 1;
        }
        return nPlayersAlive < 2;
    }

    // Parabeniza o vencedor do jogo
    congratulateWinner() {
        for (var player of datasource.data.game[this.roomName].players) {
            if (player.alive) {
                this.sender.sendMsgToAll(
                    "Congratulations " + player.name + "! You won the game!\n"
                );
                return;
            }
        }
    }

    // Adiciona um novo jogador
    addPlayer(name) {

        // O nome nao pode estar vazio
        if (name === "") {
            this.sender.sendMsgToCurrentClient(
                "Your name cant be blank. Please choose another."
            );
            return;
        }

        // Se o nome ja existe, nao adiciona
        if (this.getPlayerByName(name) != undefined) {
            this.sender.sendMsgToCurrentClient(
                "Name already in use. Please choose another."
            );
            return;
        }

        datasource.data.game[this.roomName].players.push(new Mage(name, this.roomName));
        this.sender.sendMsgToCurrentClient("Welcome to the game, " + name + "!\n");
        this.sender.sendMsgToAllButIgnoreCurrentClient(name + " joined the game");
    }

    // Retorna um jogador com base em seu NAME
    getPlayerByName(name) {
        return datasource.data.game[this.roomName].players.find(mage => mage.name == name)
    }

    // Lista o nome dos jogadores em jogo
    listPlayers() {
        let names = "";
        datasource.data.game[this.roomName].players.map(player => names += player.name + ", ")
        names = names.slice(0, -2)

        if (names === "") {
            this.sender.sendMsgToCurrentClient("There are no players in the game.");
        } else {
            this.sender.sendMsgToCurrentClient("Players in the game: " + names);
        }

        return names
    }

    // Prepara a proxima rodada
    setNextPlayer() {
        console.log(datasource.data.game)
        let nplayers = datasource.data.game[this.roomName].players.length;
        datasource.data.game[this.roomName].currentPlayer = datasource.data.game[this.roomName].players[
            ((datasource.data.game[this.roomName].turn % nplayers) + nplayers) % nplayers
        ];
        datasource.data.game[this.roomName].turn += 1;
        datasource.data.game[this.roomName].currentPlayer.disableShield();

        // Se o jogador morreu, verifica se o jogo acabou
        // Caso tenha acabado, reinicia o jogo
        // Caso ainda nao tenha acabado, continua
        if (!datasource.data.game[this.roomName].currentPlayer.alive) {
            if (this.isGameFinished()) {
                this.congratulateWinner();
                this.resetGame();
            } else this.setNextPlayer();
        }
    }

    // Processa o texto de input para realizar as acoes do jogo
    processInput(input) {
        this.action.process(this, input)
    }

    isTheTurnOfThePlayer(playerName) {
        return datasource.data.game[this.roomName].currentPlayer.name == playerName
    }
}
