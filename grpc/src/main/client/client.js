import * as protoLoader from '@grpc/proto-loader'
import * as grpc from 'grpc'
import * as readlineLib from 'readline'

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

const REMOTE_SERVER = "0.0.0.0:8080"

let username

//Create gRPC client
let client = new proto.game.Actions(
    REMOTE_SERVER,
    grpc.credentials.createInsecure()
)

function createRoom() {
    readline.question("Digite o nome da sala:", answer => {
        client.createRoom({ name: answer }, (err, response) => {
            if (err) throw err
            console.log(response)
            showMainMenu()
        })
    });

}

function listRooms() {
    client.listRooms({}, (err, response) => {
        if (err) { console.log(err); throw err }
        console.log(response)
        showMainMenu()
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

//let channel = client.join({ user: username }, { user: username })
//channel.on("data", onData)
//channel.on('end', () => { console.log('end'); });

//rl.on("line", function (text) {
//    let command = text.split(" ")
//    client.send({ user: username, text: `${command[0]} ${username} ${command[1]}` }, res => { })
//})

//When server send a message
function onData(message) {
    console.log(`${message.text}`)
}

function login() {

    //Ask user name then start the chat
    readline.question("What's ur name? ", answer => {
        username = answer;
        readline.question("What's ur password? ", password => {
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
//login()
listRooms()