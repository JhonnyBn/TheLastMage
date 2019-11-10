import crypto from "crypto"

const numberOfServer = parseInt(process.argv[2])
const inicialPort = parseInt(process.argv[3])
const servers = []
const serversSorted = []
const routes = []

console.log("numberOfServer:" + numberOfServer)
if (numberOfServer <= 1 || isNaN(numberOfServer)) throw ("number of server should be Bigger or equal to 1.")
console.log("inicialPort:" + inicialPort)
if (inicialPort <= 1024 || isNaN(inicialPort)) throw ("inicial port should be Bigger or equal to 1024.")

function main() {

    for (let index = inicialPort; index < (inicialPort + numberOfServer); index++) {
        servers.push(hashOf(index.toString()))
    }
    servers.sort()
    serversSorted.push(servers[servers.length - 1])
    servers.forEach(server => server != servers[servers.length - 1] ? serversSorted.push(server) : null)
    serversSorted.forEach((server, index) => {
        const route = []
        for (let j = 0; parseInt(j) < parseInt(Math.sqrt(serversSorted.length + 1)); j++) {
            route.push(serversSorted[(Math.pow(2, j) + index) % serversSorted.length])
        }
        routes.push({
            server,
            route
        })
    }
    )
    console.log(routes)
}

function hashOf(value) {
    return crypto.createHash('md5').update(value).digest("hex")
}