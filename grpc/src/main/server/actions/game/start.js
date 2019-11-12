import DefaultAction from "../actionDefaultClass"
import { datasource } from "../../model/datasource";
export default class Start extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "start", Start.prototype.processCommand)
        this.helpMsg = "start -> To start the game."
    }

    processCommand(game) {

        if (!datasource.data.game[game.roomName].running) {
            game.run();
        } else {
            game.sender.sendMsgToCurrentClient("Game already started.")
        }

    }
}