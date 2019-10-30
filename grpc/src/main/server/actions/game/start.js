import DefaultAction from "../actionDefaultClass"

export default class Start extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "start", Start.prototype.processCommand)
        this.helpMsg = "start -> To start the game."
    }

    processCommand(game) {

        if (!game.running) {
            game.run();
        } else {
            game.sender.sendMsgToCurrentClient("Game already started.")
        }

    }
}