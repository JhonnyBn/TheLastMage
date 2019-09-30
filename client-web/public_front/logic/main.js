let inAGame = false;
let name = "";

var socket = io("http://localhost:8080");

socket.on("connect", function () {
    printMsg("Connected to the server.");
    printMsg("Please type your name to join the game.");
});

socket.on("message", value => {
    if (value == "Name already in use. Please choose another.") {
        inAGame = false;
        name = "";
    }
    if (value.split(" ")[0] == "chat") {
        printChatOtherUser(value)
        return;
    }
    if (value.split(" ")[0] == "sended:") {
        printChatToUser(value)
        return;
    }
    printMsg(value);
});
socket.on("disconnect", function () { });

function enviar() {
    let line = document.getElementById("entrada").value;

    if (!inAGame) {
        if(line === "") {
            alert("Your name cant be blank.")
            return
        }
        socket.send("join " + line);
        name = line;
        inAGame = true;
    } else {
        let command = line.split(" ")
        socket.send(`${command[0]} ${name} ${command[1]}`);
    }
}

function enviarChat() {
    let line = document.getElementById("chatEntrada").value;

    if (name == "") {
        alert("Please inform your name before joining the chat.")
        return
    }

    socket.send(`chat ${name} ${line}`);

}

function printMsg(msg) {
    let output = document.getElementById("saida");
    output.innerHTML =
        output.innerHTML + "<br>" + msg.replace(/\n/g, "<br>");
}

function printChatOtherUser(msg) {
    let output = document.getElementById("saidaChat");
    let msgValue = msg.split(" ")
    msgValue.shift()
    msgValue = msgValue.join(" ")
    output.innerHTML =
        output.innerHTML + `<div class="container containerChat darker" style="text-align: left">${msgValue.replace(/\n/g, "<br>")}<div>`;
}

function printChatToUser(msg) {
    let output = document.getElementById("saidaChat");
    let msgValue = msg.split(" ")
    msgValue.shift()
    msgValue = msgValue.join(" ")
    output.innerHTML =
        output.innerHTML + `<div class="container containerChat" style="text-align: right">${msgValue.replace(/\n/g, "<br>")}<div>`;
}