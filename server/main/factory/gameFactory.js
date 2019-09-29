import Game from "../model/game"
import Join from '../actions/join'
import Sender from "../model/sender"

export default function () {
    const sender = new Sender(new Array());
    return new Game(sender, new Join());
}