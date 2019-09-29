export default class Sender {
    constructor(connections) {
        this.connections = connections;
        this.currentClient = null;
    }

    sendMsgToAll(msg) {
        this.connections.forEach(connection => {
            connection.send(msg);
            console.log(msg);
        });
    }

    sendMsgToAllButIgnoreCurrentClient(msg) {
        this.connections
            .filter(client => client != this.currentClient)
            .forEach(connection => {
                connection.send(msg);
            });
        console.log(msg);
    }

    sendMsgToCurrentClient(msg) {
        this.currentClient.send(msg);
        console.log(msg);
    }
}