import { datasource } from "./datasource";

export default class Sender {
    constructor(roomName) {
        this.roomName = roomName;
        this.currentClient = null;
    }

    sendMsgToAll(msg) {
        this.connections.forEach(connection => {
            connection.write({ user: this.currentClient, text: msg });
            console.log(msg);
        });
    }

    sendMsgToAllButIgnoreCurrentClient(msg) {
        // this.connections
        //     .filter(client => client.request.user != this.currentClient)
        //     .forEach(connection => {
        //         connection.write({ user: this.currentClient, text: msg });
        //     });
        // console.log(msg);
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