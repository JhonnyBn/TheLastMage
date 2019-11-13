import crypto from "crypto"
import fs from "fs"
import bigInt from "big-integer"

function sumHashWithDecimal(hash, sum) {
    let decimalMax = bigInt('ffffffffffffffffffffffffffffffff', 16)
    let decimal = bigInt(hash, 16)
    let newDecimal = decimal.plus(sum)
    if (newDecimal.compare(decimalMax) == 1) {
        newDecimal = newDecimal.minus(decimalMax)
        console.log(newDecimal.toString(16))
        console.log(addZeroIfNeed(newDecimal.toString(16)))
    }
    return addZeroIfNeed(newDecimal.toString(16))

}

function addZeroIfNeed(hash) {
    if (hash.length < 32) {
        return addZeroIfNeed("0" + hash)
    } else {
        return hash
    }
}


const numberOfServer = parseInt(process.argv[2])
const inicialPort = parseInt(process.argv[3])
const servers = []
const routes = []

console.log("numberOfServer:" + numberOfServer)
if (numberOfServer <= 1 || isNaN(numberOfServer)) throw ("number of server should be Bigger or equal to 1.")
console.log("inicialPort:" + inicialPort)
if (inicialPort <= 1024 || isNaN(inicialPort)) throw ("inicial port should be Bigger or equal to 1024.")

function main() {

    for (let index = inicialPort; index < (inicialPort + numberOfServer); index++) {
        servers.push({ hash: hashOf(index.toString()), port: index })
    }
    servers.sort((a, b) => a.hash < b.hash ? -1 : a.hash > b.hash ? 1 : 0)
    servers.forEach((server) => {
        const fingerprinting = []
        for (let j = 0; j < 128; j++) {
            let newHash = sumHashWithDecimal(server.hash, bigInt(2).pow(j))
            let serverForHash = servers.find(s => newHash <= s.hash)
            if (serverForHash == undefined) serverForHash = servers[0]
            fingerprinting.push({ hash: serverForHash.hash, port: serverForHash.port, index: newHash })
        }
        const beforeServer = servers.find((e, i) => {
            let nextElement = undefined
            if (i + 1 == servers.length) {
                nextElement = servers[0]
            } else {
                nextElement = servers[i + 1]
            }
            return nextElement.hash == server.hash
        })
        routes.push({
            server,
            routes: {
                fingerprinting,
                self: {
                    base: { hash: server.hash },
                    before: beforeServer
                }

            }
        })
    }
    )
    routes.forEach(route => {
        fs.writeFile(route.server.hash + ".json", JSON.stringify(route.routes), function (err) {
            if (err) throw err
            console.log('Saved!')
        })
    })
}

function hashOf(value) {
    return crypto.createHash('md5').update(value).digest("hex")
}

main()