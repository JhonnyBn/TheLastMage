import DefaultAction from "../actionDefaultClass"

export default class Chat extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "chat", Chat.prototype.processCommand)
        this.helpMsg = "chat [msg] -> To say something in the chat."
    }

    processCommand(game, input) {

        const { param } = super.openInput(input)
        const playerName = param[0];
        if (playerName == undefined) {
            game.sender.sendMsgToCurrentClient("Please inform a playerNameOrigin.")
            return;
        }
        param.shift()
        const msg = param.join(" ")
        if (param == undefined) {
            game.sender.sendMsgToCurrentClient("Please inform a msg.")
        }

        game.sender.sendMsgToAllButIgnoreCurrentClient(`chat ${playerName}: ${msg}`);
        game.sender.sendMsgToCurrentClient(`sended: ${msg}`)

    }
}