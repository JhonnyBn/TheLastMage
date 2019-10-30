import DefaultAction from "../actionDefaultClass"

export default class ListPlayers extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "listplayers", ListPlayers.prototype.processCommand)
        this.helpMsg = "listplayers -> To list the name of all players in the game."
    }

    processCommand(game) {

        game.listPlayers();

    }
}