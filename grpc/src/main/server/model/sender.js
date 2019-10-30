export default class Sender {
    constructor(connections) {
        this.connections = connections;
        this.currentClient = null;
    }

    sendMsgToAll(msg) {
        this.connections.forEach(connection => {
            connection.write({ user: this.currentClient, text: msg });
            console.log(msg);
        });
    }

    sendMsgToAllButIgnoreCurrentClient(msg) {
        this.connections
            .filter(client => client.request.user != this.currentClient)
            .forEach(connection => {
                connection.write({ user: this.currentClient, text: msg });
            });
        console.log(msg);
    }

    sendMsgToCurrentClient(msg) {
        this.connections
            .filter(client => client.request.user == this.currentClient)
            .forEach(client => client.write({ user: this.currentClient, text: msg }))
        console.log(msg);
    }

}