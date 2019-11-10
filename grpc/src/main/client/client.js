import * as protoLoader from '@grpc/proto-loader'
import * as grpc from 'grpc'
import * as readline from 'readline'

//Read terminal Lines
var rl = readline.createInterface({
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

const REMOTE_SERVER = "0.0.0.0:8081"

let username

//Create gRPC client
let client = new proto.game.Actions(
    REMOTE_SERVER,
    grpc.credentials.createInsecure()
)

//Start the stream between server and client
function startChat(password) {
    client.login({ username: username, password: password }, (err, response) => {
        console.log("msg enviada", response)
        main()
    })

    //let channel = client.join({ user: username }, { user: username })
    //channel.on("data", onData)

    //rl.on("line", function (text) {
    //    let command = text.split(" ")
    //    client.send({ user: username, text: `${command[0]} ${username} ${command[1]}` }, res => { })
    //})
}

//When server send a message
function onData(message) {
    console.log(`${message.text}`)
}

function main() {

    //Ask user name then start the chat
    rl.question("What's ur name? ", answer => {
        username = answer;
        rl.question("What's ur password? ", answer2 => {
            startChat(answer2);
        })
    })

}
main()