import DefaultAction from "./actionDefaultClass"

export default class Help extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "help", Help.prototype.processCommand)
    }

    processCommand(game) {
        const helpMsgs = this.getHelpMsg(game.action);
        game.sender.sendMsgToCurrentClient(helpMsgs);

    }

    getHelpMsg(action) {
        if (action == undefined) return "";
        if (action instanceof Help) return this.getHelpMsg(action.nextAction)
        return action.helpMsg + "\n" + this.getHelpMsg(action.nextAction)
    }
}