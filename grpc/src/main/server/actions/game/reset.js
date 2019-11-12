import DefaultAction from "../actionDefaultClass"
import { datasource } from "../../model/datasource";
export default class Reset extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "reset", Reset.prototype.processCommand)
        this.helpMsg = "reset -> To reset the game."
    }

    processCommand(game) {

        if (datasource.data.game[game.roomName].running) {
            game.resetGame();
        } else {
            game.sender.sendMsgToCurrentClient("Game is not running.")
        }

    }
}