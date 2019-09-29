import fs from "fs";
import mage from "./model/mage";

export function save(game) {
    const gameCopy = Object.assign(Object.create(Object.getPrototypeOf(game)), game)
    gameCopy.sender = null
    gameCopy.action = null
    gameCopy.players.map(player => {
        player.sender = null
        return player
    })
    if (gameCopy.currentPlayer != null) {
        gameCopy.currentPlayer.sender = null
    }

    console.log(gameCopy)
    const gameToSave = JSON.stringify(gameCopy)
    fs.writeFile('./database.json', gameToSave, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}
export function load(game) {
    fs.readFile('./database.json', (err, fileData) => {
        if (err) {
            console.log('Error reading file', err)
            return
        }
        const object = JSON.parse(fileData)
        object.players.map(
            player => {
                const name = player.name
                const playerCopy = Object.assign(player, new mage())
                playerCopy.name = name
                playerCopy.sender = game.sender
                return playerCopy
            }
        )
        game.players = object.players
        game.turn = object.turn
        game.currentPlayer = object.currentPlayer
        game.currentPlayer.sender = game.sender
        game.running = object.running
        console.log(game)
    })

}
