import DefaultAction from "../actionDefaultClass"

export default class Join extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "join", Join.prototype.processCommand)
        this.helpMsg = "join -> To join the game again."
    }

    processCommand(game, input) {
        const { param } = super.openInput(input)

        // Nao colocou o nome
        if (!param) {
            game.sender.sendMsgToCurrentClient(
                'To join the game again, please say "join"'
            );
            return;
        }

        // Adiciona o player
        game.addPlayer(param[0]);

    }
}