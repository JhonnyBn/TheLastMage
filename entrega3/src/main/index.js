import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';
import crypto from "crypto"
import { datasource } from './datasource'
import bigInt from "big-integer"

const serverProperties = {}
serverProperties.port = parseInt(process.argv[2])
serverProperties.maxIndexExponent = 3
serverProperties.maxIndex = bigInt(2).pow(serverProperties.maxIndexExponent)
//datasource.data.currentIndex = generateIndexByPort(serverProperties.port, serverProperties.maxIndex)
datasource.data.backIndex = null
datasource.data.currentIndex = "6"

console.log("Server Index:", datasource.data.currentIndex)

function genereateFingerTable() {
    for (let i = 0; i < serverProperties.maxIndexExponent; i++) {
        if (datasource.data.fingerTable == undefined) {
            datasource.data.fingerTable = {}
        }
        const key = addNumberToIndex(bigInt(2).pow(i))
        datasource.data.fingerTable[key] = { index: datasource.data.currentIndex, key, order: i }
    }
    console.log(datasource.data.fingerTable)
}

function addNumberToIndex(number) {
    console.log("number", number)
    let result = bigInt(datasource.data.currentIndex).add(number)
    if (result < serverProperties.maxIndex) {
        return result
    } else {
        return result.minus(serverProperties.maxIndex)
    }
}

function generateIndexByPort(port, maxIndex) {
    const portHash = hashOf(port)
    const randomInt = parseInt(Math.random() * 100)
    const hashBigInt = bigInt(portHash, 16).add(randomInt)
    return hashBigInt.divmod(maxIndex).remainder.toString()
}

function hashOf(value) {
    return crypto.createHash('md5').update(value.toString()).digest("hex")
}

function loadProto() {
    const PROTO_PATH = __dirname + '../../../protos/game.proto';

    // Load protobuf
    return grpc.loadPackageDefinition(
        protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        })
    );
}

function joinServer(call, callback) {
    const { url, index } = call.request
    if (!isValidIndex(index)) {
        callback(null, { key: "400", message: "Wrong Index" })
    } else {
        if (datasource.data.fingerTable == undefined) {
            genereateFingerTable()
            datasource.data.backIndex = index
            addServerToFingerTable(datasource.data.currentIndex, index, url)
            callback(null, { key: "201", message: "Created" })
            return
        }
        const firstIndex = getValidFirstIndex(index)
        if (firstIndex != -1) {
            addServerToFingerTable(firstIndex, index, url)
            datasource.data.backIndex = index
            callback(null, { key: "201", message: "Created" })
            return
        }
        addServerToFingerTable(datasource.data.currentIndex, index, url)
        callback(null, { key: "200", message: "OK" })
    }

}

function compareIndex(oldIndex, index) {
    const keyOfFirstFingerTable = addNumberToIndex(1)
    const lastKeyOfFingerTable = addNumberToIndex(serverProperties.maxIndex.divide(2))
    if (keyOfFirstFingerTable > lastKeyOfFingerTable) {
        if (oldIndex < keyOfFirstFingerTable) {
            let newIndex = bigInt(index).add(serverProperties.maxIndex)
            let newOldIndex = bigInt(oldIndex).add(serverProperties.maxIndex)
            console.log("newIndex", newOldIndex, newIndex)
            return newOldIndex.compare(newIndex) <= 0
        } else {
            let newIndex = bigInt(index).add(serverProperties.maxIndex)
            let newOldIndex = oldIndex
            console.log("newOldIndex", newOldIndex, newIndex)
            return newOldIndex.compare(newIndex) <= 0
        }
    } else {
        console.log("sameIndex", oldIndex, index)
        return oldIndex.key.compare(bigInt(index)) <= 0
    }
}

function getValidFirstIndex(index) {
    let firstKey = addNumberToIndex(1)
    let firstIndex = datasource.data.fingerTable[firstKey].index
    if (compareIndex(index, firstIndex)) {
        return firstIndex
    } else {
        return -1
    }
}


function isValidFingerTable(key, fingerTable) {
    return compareIndex(fingerTable.key, key)
}

function addServerToFingerTable(nextIndex, index, url) {
    Object.keys(datasource.data.fingerTable).forEach(key => {
        const table = datasource.data.fingerTable[key]
        if (table.index == nextIndex && isValidFingerTable(index, table)) {
            table.index = index
            table.url = url
        }
    })
}

function isValidIndex(index) {
    if (index == datasource.data.currentIndex) {
        return false
    }
    else {
        return true;
    }
}

function showFingerTable(call, callback) {
    let fingerTable = {}
    if (datasource.data.fingerTable != undefined) {
        fingerTable = datasource.data.fingerTable
    }
    const result = {
        fingerTable: Object.keys(fingerTable).map(key => {
            const table = fingerTable[key]
            return { index: table.index, key: table.key, url: table.url }
        })
    }
    console.log(result)
    callback(null, result)
}

function main() {

    const server = new grpc.Server();
    const SERVER_ADDRESS = `0.0.0.0:${serverProperties.port}`;
    const proto = new loadProto;

    // Define server with the methods and start it
    server.addService(proto.game.Actions.service, {
        joinServer: joinServer,
        showFingerTable: showFingerTable
    });

    server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

    server.start();
}
main()