import DefaultAction from "../actionDefaultClass"

export default class Reboot extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "reboot", Reboot.prototype.processCommand)
        this.helpMsg = "reboot -> To reboot the game (reset and remove all players)."
    }

    processCommand(game) {

        game.rebootGame();

    }
}