import { datasource } from "../model/datasource"
import gameFactory from "../factory/gameFactory"

export function send(username, room, text) {
    console.log(username, room, text)
    console.log(datasource)
    if (datasource.games == undefined) datasource.games = []
    if (datasource.games.find(game => game.name == room) == undefined) {
        datasource.games.push({
            name: room,
            clients: [],
            game: gameFactory(room)
        })
    }
    const currentGame = datasource.games.find(game => game.name == room)
    currentGame.game.sender.currentClient = username
    currentGame.game.processInput(text)
    console.log(currentGame)
}