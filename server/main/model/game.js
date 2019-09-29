import Mage from "./mage"

export default class Game {
    constructor(sender, action) {
        this.sender = sender;
        this.players = [];
        this.turn = 0;
        this.currentPlayer = null;
        this.running = 0;
        this.action = action
    }

    // Inicia o jogo
    run() {
        this.running = 1;
        this.setNextPlayer();
    }

    // Reseta o jogo
    resetGame() {
        for (var player of this.players) {
            player.reset();
        }
        this.turn = 0;
        this.currentPlayer = null;
        this.running = 0;
        this.sender.sendMsgToAll(
            "The game has been reset.\nSay 'start' to begin a new game.\n"
        );
    }

    // Retorna True se haver somente um jogador vivo
    isGameFinished() {
        let nPlayersAlive = 0;
        for (var player of this.players) {
            if (player.alive) nPlayersAlive += 1;
        }
        return nPlayersAlive < 2;
    }

    // Parabeniza o vencedor do jogo
    congratulateWinner() {
        for (var player of this.players) {
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
        // Se o nome ja existe, nao adiciona
        if (this.getPlayerByName(name)) {
            this.sender.sendMsgToCurrentClient(
                "Name already in use. Please choose another."
            );
            return;
        }

        this.players.push(new Mage(name, this.sender));
        this.sender.sendMsgToCurrentClient("Welcome to the game, " + name + "!\n");
        this.sender.sendMsgToAllButIgnoreCurrentClient(name + " joined the game");
    }

    // Retorna um jogador com base em seu NAME
    getPlayerByName(name) {
        for (var mago of this.players) {
            if (mago.name == name) return mago;
        }
    }

    // Prepara a proxima rodada
    setNextPlayer() {
        let nplayers = this.players.length;
        this.currentPlayer = this.players[
            ((this.turn % nplayers) + nplayers) % nplayers
        ];
        this.turn += 1;
        this.currentPlayer.disableShield();

        // Se o jogador morreu, verifica se o jogo acabou
        // Caso tenha acabado, reinicia o jogo
        // Caso ainda nao tenha acabado, continua
        if (!this.currentPlayer.alive) {
            if (this.isGameFinished()) {
                this.congratulateWinner();
                this.resetGame();
            } else this.setNextPlayer();
        }
    }

    // Processa o texto de input para realizar as acoes do jogo
    processInput(input) {
        this.action.process(input, this)
    }
}
