const not_found_action_msg = "Command not found type \"help\" for the commands information."

export default class DefaultAction {

    constructor(nextAction, key, callBack) {
        this.nextAction = nextAction
        this.key = key
        this.callBack = callBack
    }

    process(game, input) {

        const { command } = this.openInput(input)
        if (command == this.key) {
            this.callBack(game, input)
            return;
        }
        if (this.nextAction) {
            this.nextAction.process(game, input)
        } else {
            game.sender.sendMsgToCurrentClient(not_found_action_msg)
        }
    }

    openInput(input) {
        const inputSplited = input.split(" ");
        const command = inputSplited[0];
        inputSplited.shift();
        const param = inputSplited;

        return { command, param }
    }

}