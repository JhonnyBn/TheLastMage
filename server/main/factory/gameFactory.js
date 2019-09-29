import Game from "../model/game"
import Join from '../actions/game/join'
import Sender from "../model/sender"
import Help from "../actions/help";
import Start from "../actions/game/start";
import Reset from "../actions/game/reset";
import Attack from "../actions/game/attack";
import Defend from "../actions/game/defend";
import SpecialAttack from "../actions/game/specialattack";
import Chat from "../actions/game/chat";


export default function () {
    const sender = new Sender(new Array());

    const join = new Join();
    const help = new Help(join);
    const start = new Start(help);
    const reset = new Reset(start);
    const attack = new Attack(reset);
    const defend = new Defend(attack);
    const specialAttack = new SpecialAttack(defend);
    const chat = new Chat(specialAttack);

    return new Game(sender, chat);
}