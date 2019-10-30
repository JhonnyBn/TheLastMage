import DefaultAction from "../actionDefaultClass"

export default class Reset extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "reset", Reset.prototype.processCommand)
        this.helpMsg = "reset -> To reset the game."
    }

    processCommand(game) {

        if (game.running) {
            game.resetGame();
        } else {
            game.sender.sendMsgToCurrentClient("Game is not running.")
        }

    }
}