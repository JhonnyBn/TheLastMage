import { datasource } from "../model/datasource"

export function send(username, room, text) {
    console.log(username, room, text)
    if (datasource.games.find(game => game.name == room) == undefined) {
        datasource.games.push({
            name: room,
            clients: [call],
            game: gameFactory(room)
        })
    }
    const currentGame = datasource.games.find(game => game.name == room)
    currentGame.game.sender.currentClient = username
    currentGame.game.processInput(text)
    console.log(currentGame)
}