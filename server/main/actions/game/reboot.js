import DefaultAction from "../actionDefaultClass"

export default class Reboot extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "reboot", Reboot.prototype.processCommand)
        this.helpMsg = "reboot -> To reboot the game(remove all players)."
    }

    processCommand(game) {

        if (game.running) {
            game.resetGame();
            game.players = new Array()
        } else {
            game.sender.sendMsgToCurrentClient("Game is not running.")
        }

    }
}