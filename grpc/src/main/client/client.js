import * as protoLoader from '@grpc/proto-loader'
import * as grpc from 'grpc'
import * as readlineLib from 'readline'
import { parse } from 'path'

let username = undefined
let roomName = undefined


//Read terminal Lines
var readline = readlineLib.createInterface({
    input: process.stdin,
    output: process.stdout
})

//Load the protobuf
var proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("protos/game.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
)

const REMOTE_SERVER = "0.0.0.0:9092"

const serverInicialPort = parseInt(8080)
const remoteServers = []
remoteServers[0] = `0.0.0.0:${serverInicialPort}`
remoteServers[1] = `0.0.0.0:${(serverInicialPort + 100)}`
remoteServers[2] = `0.0.0.0:${(serverInicialPort + 200)}`

//Create gRPC client
let clients = remoteServers.map(
    server => new proto.game.Actions(
        server,
        grpc.credentials.createInsecure(),
        {
            'grpc.min_reconnect_backoff_ms': 1000,
            'grpc.max_reconnect_backoff_ms': 10000,
        }
    )
)

async function createRoom() {
    readline.question("Digite o nome da sala:", async answer => {
        const client = await getClient(clients)
        client.createRoom({ name: answer }, (err, response) => {
            if (err) throw err
            console.log(response)
            showMainMenu()
        })
    });

}

async function listRooms() {
    const client = await getClient(clients)
    client.listRooms({}, async(err, response) => {
        if (err) { console.log(err); throw err }
        console.log("0: voltar.")
        response.rooms.forEach((room, index) => {

            console.log(`${index + 1}: ${room.name}`)
        });
        readline.question("Sua escolha:", answer => {
            if (answer >= 1 && answer <= response.rooms.length) {
                joinRoom(response.rooms[answer - 1].name)
            } else {

                switch (answer) {
                    case '0': showMainMenu(); break;
                    default: listRooms()
                }
            }
        })


    })
}

function showMainMenu() {
    console.log(`
        Main menu:\n\n
        1: Criar sala
        2: Listar salas
        0: Sair
    
    `)
    readline.question("Sua escolha:", answer => {
        switch (answer) {
            case '1': createRoom(); break;
            case '2': listRooms(); break;
            case '0': login(); break;
            default: showMainMenu()
        }
    })
}

async function joinRoom(name) {
    const client = await getClient(clients)
    roomName = name
    let channel = client.join({ username: username, room: name })
    channel.on("data", onData)
    channel.on('end', () => { console.log('end'); });
    channel.on('error', () => { });

    readline.on("line", async function (text) {
        let command = text.split(" ")
        if (command[0] == "reconnect") {
            channel.cancel()
            const newClient = await getClient(clients)
            channel = newClient.join({ username: username, room: name })
            channel.on("data", onData)
            channel.on('end', () => { console.log('end'); });
            channel.on('error', () => { })
        } else {
            client.send({ room: name, username: username, text: `${command[0]} ${username} ${command[1]}` }, res => { })
        }
    })
}

//When server send a message
function onData(message) {
    console.log(`${message.text}`)
}

export async function getClient(clients) {
    console.log("Clients", clients)
    return new Promise(async(resolve, reject) => {
        clients.forEach(client => {
            client.ping({}, (err, msg) => {
                if (!err) resolve(client)
            })
        });
    }
    )
}

async function login() {

    //Ask user name then start the chat
    readline.question("What's ur name? ", async answer => {
        username = answer;
        readline.question("What's ur password? ", async password => {
            const client = await getClient(clients)
            client.login({ username: username, password: password }, (err, response) => {
                if (err) { throw err }
                if (response.success == 'true') {
                    console.log("Bem Vindo", response.username)
                    showMainMenu()

                } else {
                    console.log("Senha incorreta.")
                    login()
                }

            })
        })
    })


}

login()