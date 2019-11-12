import { datasource } from "./datasource";

export default class Sender {
    constructor(roomName) {
        this.roomName = roomName;
        this.currentClient = null;
    }

    sendMsgToAll(msg) {
        const currentGame = datasource.games.find(game => game.name == this.roomName)
        console.log(currentGame.clients);
        currentGame.clients.forEach(client => client.write({ user: this.currentClient, text: msg }));
    }

    sendMsgToAllButIgnoreCurrentClient(msg) {
        console.log(datasource.games)
        console.log(this.roomName)
        const currentGame = datasource.games.find(game => game.name == this.roomName)
        console.log(currentGame.clients);
        const currentClients = currentGame.clients.filter(client => client.request.username != this.currentClient)
        currentClients.forEach(client => client.write({ user: this.currentClient, text: msg }));
    }

    sendMsgToCurrentClient(msg) {
        console.log(datasource.games)
        console.log(this.roomName)
        const currentGame = datasource.games.find(game => game.name == this.roomName)
        console.log(currentGame.clients);
        const currentClient = currentGame.clients.find(client => client.request.username == this.currentClient)
        currentClient.write({ user: this.currentClient, text: msg });
    }

}