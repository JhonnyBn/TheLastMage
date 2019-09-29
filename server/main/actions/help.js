import DefaultAction from "./actionDefaultClass"

var helpText =
    "The current commands are:\n" +
    "" +
    "start\t\t\t\t\tTo start the game\n" +
    "attack <player>\t\t\tTo attack other player\n" +
    "specialattack <player>\tTo use special attack on other player\n" +
    "defend\t\t\t\t\tTo defend yourself this turn\n" +
    "help\t\t\t\t\tTo display this list of commands.\n";

export default class Help extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "help", Help.prototype.processCommand)
    }

    processCommand(game) {
        const helpMsgs = this.getHelpMsg(game.action);
        game.sender.sendMsgToCurrentClient(helpMsgs);

    }

    getHelpMsg(action) {
        if (action == undefined) return "---\n";
        if (action instanceof Help) return this.getHelpMsg(action.nextAction)
        return action.helpMsg + "\n" + this.getHelpMsg(action.nextAction)
    }
}