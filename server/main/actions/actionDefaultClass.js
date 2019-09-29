export default class DefaultAction {

    constructor(nextAction, key, callBack) {
        this.nextAction = nextAction
        this.key = key
        this.callBack = callBack
    }

    process(input, game) {

        const { command } = this.openInput(input)
        if (command == this.key) {
            this.callBack(input, game)
        }
        if (this.nextAction) {
            this.nextAction.process(command, game)
        }
    }

    openInput(input) {
        input = input.split(" ");
        let command = input[0];
        let param = input[1];

        return { command, param }
    }
}