
import DefaultAction from "../actionDefaultClass"

export default class Defend extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "defend", Defend.prototype.processCommand)
        this.helpMsg = "defend [playerNameOrigin] -> To defend yourself this turn."
    }

    processCommand(game, input) {

        if (game.running == 0) {
            game.sender.sendMsgToCurrentClient("Game is not running.")
            return;
        }
        const { param } = super.openInput(input)
        const playerName = param[0];
        if (playerName == undefined) {
            game.sender.sendMsgToCurrentClient("Please inform a playerNameOrigin.")
            return;
        }
        const player = game.getPlayerByName(playerName)
        if (player == undefined) {
            game.sender.sendMsgToCurrentClient("playerNameOrigin not found.")
            return;
        }

        if (game.isTheTurnOfThePlayer(playerName)) {

            player.defend();
            game.setNextPlayer();
            game.sender.sendMsgToCurrentClient("Defending until next turn.");
            game.sender.sendMsgToAllButIgnoreCurrentClient(player.name + " is defending until next turn.");
        } else {
            if (!player.alive) {
                game.sender.sendMsgToCurrentClient(
                    "You are dead. Please wait for the game to finish or start a new game."
                );
            } else {
                game.sender.sendMsgToCurrentClient(
                    'Please wait for your turn, or type "help" for the commands information.'
                );
            }
            return;
        }
    }
}

