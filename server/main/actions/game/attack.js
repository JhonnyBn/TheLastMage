import DefaultAction from "../actionDefaultClass"

export default class Attack extends DefaultAction {

    constructor(nextAction) {
        super(nextAction, "attack", Attack.prototype.processCommand)
        this.helpMsg = "attack [playerNameOrigin] [playerNameTarget] -> To attack other player."
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
        console.log(player)

        if (game.isTheTurnOfThePlayer(playerName)) {

            game.sender.sendMsgToAll(
                playerName + " is attacking " + targetName + "..."
            );
            console.log(player)
            if (player.attack(target)) {
                game.sender.sendMsgToAll(
                    "Success! Dealt " + player.attackDamage + " damage."
                );
                target.checkLife();
            } else {
                game.sender.sendMsgToAll("Fail! He or she blocked the attack.");
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