import DefaultAction from "./actionDefaultClass"

export default class Join extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "join", Join.prototype.processCommand)
    }

    processCommand(input, game) {
        console.log(super.openInput(input))
        const { param } = super.openInput(input)

        // Nao colocou o nome
        if (!param) {
            game.sender.sendMsgToCurrentClient(
                'To join the game, please say "join <yourName>"'
            );
            return;
        }

        // Adiciona o player
        game.addPlayer(param);

    }
}