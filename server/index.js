var readline = require('readline');
var r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const socket = require('socket.io')()
console.log("ola")
socket.on('connection', client => {
    console.log("client connected")
    r1.on('line', line => client.send(line))
    client.on("message", value => {
        console.log("msg:", value)
        
    })
})
socket.listen(8080)