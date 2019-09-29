import DefaultAction from "../actionDefaultClass"

export default class SpecialAttack extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "specialattack", SpecialAttack.prototype.processCommand)
        this.helpMsg = "specialattack <playerNameOrigin> <playerNameTarget> -> To use special attack on other player."
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
        const targetName = param[1];
        if (targetName == undefined) {
            game.sender.sendMsgToCurrentClient("Please inform a playerNameTarget.")
            return;
        }
        const target = game.getPlayerByName(targetName)
        if (target == undefined) {
            game.sender.sendMsgToCurrentClient("PlayerNameTarget not found.")
            return;
        }
        const player = game.getPlayerByName(playerName)
        if (player == undefined) {
            game.sender.sendMsgToCurrentClient("playerNameOrigin not found.")
            return;
        }

        if (game.isTheTurnOfThePlayer(playerName)) {

            if (game.currentPlayer.specialAttacksLeft < 1) {
                game.sender.sendMsgToCurrentClient("You can't use more special attacks this game.")
                return;
            }

            game.sender.sendMsgToAll(
                game.name + " is using special attack on " + target.name + "..."
            );

            if (player.specialAttack(target)) {
                game.sender.sendMsgToAll(
                    "Success! Dealt " + player.specialDamage + " damage."
                );
                target.checkLife();
            }
            else {
                game.sender.sendMsgToAll("Fail! He or she blocked the special attack.");
            }
            game.setNextPlayer();
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