const socket = require('socket.io')()
console.log("ola")
socket.on('connection', client =>{
    console.log(client)
})
socket.listen(8080)