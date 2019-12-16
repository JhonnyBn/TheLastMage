import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';
import crypto from "crypto"
import { datasource } from './datasource'
import bigInt from "big-integer"

const serverProperties = {}
serverProperties.port = parseInt(process.argv[2])
serverProperties.parentUrl = process.argv[3]
serverProperties.maxIndexExponent = 3
serverProperties.maxIndex = bigInt(2).pow(serverProperties.maxIndexExponent)
datasource.data.currentIndex = generateIndexByPort(serverProperties.port, serverProperties.maxIndex)
//datasource.data.currentIndex = "4"

console.log("Server Index:", datasource.data.currentIndex)

function genereateFingerTable() {
    for (let i = 0; i < serverProperties.maxIndexExponent; i++) {
        if (datasource.data.fingerTable == undefined) {
            datasource.data.fingerTable = {}
        }
        const key = addNumberToIndex(bigInt(2).pow(i))
        datasource.data.fingerTable[key] = {
            index: datasource.data.currentIndex, key, order: i, url: getCurrentUrl()
        }
    }
    console.log(datasource.data.fingerTable)
}

function addNumberToIndex(number) {
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
        //if (datasource.data.fingerTable == undefined) {
        //    genereateFingerTable()
        //    addServerToFingerTable(datasource.data.currentIndex, index, url)
        //    callback(null, { key: "201", message: "Created" })
        //    return
        //}
        const firstIndex = getValidFirstIndex(index)
        if (firstIndex != -1) {
            addServerToFingerTable(firstIndex, index, url)
            const newFirstIndex = datasource.data.fingerTable[addNumberToIndex(1)]
            const client = buildClient(newFirstIndex.url)
            client.syncServer({ newIndex: index, newIndexUrl: url, oldIndex: firstIndex }, (err, resp) => console.log(resp))
            callback(null, { key: "201", message: "Created" })
            return
        }
        addServerToFingerTable(datasource.data.currentIndex, index, url)
        callback(null, { key: "200", message: "OK" })
    }

}

function syncServer(call, callback) {
    console.log("--------------------sync-----------------------")
    console.log(datasource.data.fingerTable)
    const { newIndex, newIndexUrl, oldIndex } = call.request
    console.log(call.request)
    addServerToFingerTable(oldIndex, newIndex, newIndexUrl)
    callback(null, { status: "200" })
}

function compareIndex(oldIndex, index) {
    const keyOfFirstFingerTable = addNumberToIndex(1)
    const lastKeyOfFingerTable = addNumberToIndex(serverProperties.maxIndex.divide(2))
    if (keyOfFirstFingerTable > lastKeyOfFingerTable) {
        if (oldIndex < keyOfFirstFingerTable) {
            let newIndex = bigInt(index).add(serverProperties.maxIndex)
            let newOldIndex = bigInt(oldIndex).add(serverProperties.maxIndex)
            console.log("newIndex", newOldIndex, newIndex)
            return bigInt(newOldIndex).compare(newIndex) <= 0
        } else {
            let newIndex = bigInt(index).add(serverProperties.maxIndex)
            let newOldIndex = oldIndex
            console.log("newOldIndex", newOldIndex, newIndex)
            return bigInt(newOldIndex).compare(newIndex) <= 0
        }
    } else {
        if (index < datasource.data.currentIndex) {
            let newIndex = bigInt(index).add(serverProperties.maxIndex)
            console.log("sameIndex1", oldIndex, newIndex)
            return bigInt(oldIndex).compare(bigInt(newIndex)) <= 0
        } else {
            console.log("sameIndex2", oldIndex, index)
            return bigInt(oldIndex).compare(bigInt(index)) <= 0
        }

    }
}

function getValidFirstIndex(index) {
    let firstKey = addNumberToIndex(1)
    let firstIndex = datasource.data.fingerTable[firstKey]
    if (compareIndex(index, firstIndex.index) || firstIndex.index == datasource.data.currentIndex) {
        return firstIndex.index
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
        if (table.index == nextIndex && isValidFingerTable(index, table) && compareIndex(index, table.index)) {
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
    let newFingerTable = Object.keys(fingerTable)
        .map(key => fingerTable[key])
        .sort((a, b) => a.order - b.order)
        .map(table => {
            console.log(table)
            return { index: table.index, key: table.key, url: table.url }
        })
    const result = {
        fingerTable: newFingerTable,
        currentIndex: datasource.data.currentIndex
    }
    console.log(result)
    callback(null, result)
}

function main() {

    const server = new grpc.Server();
    const SERVER_ADDRESS = `0.0.0.0:${serverProperties.port}`;
    const proto = new loadProto();

    // Define server with the methods and start it
    server.addService(proto.game.Actions.service, {
        joinServer: joinServer,
        showFingerTable: showFingerTable,
        getServerUrlByKey: getServerUrlByKey,
        syncServer: syncServer
    });

    server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

    server.start();
}

function getServerUrlByKey(call, callback) {
    const { key, origins } = call.request
    let fingerTable = {}
    if (datasource.data.fingerTable != undefined) {
        fingerTable = datasource.data.fingerTable
    }
    console.log("key", key)
    const fingerOfindex = fingerTable[key]
    console.log("fingerOfindex", fingerOfindex)
    if (fingerOfindex != null) {
        if (fingerOfindex.index == key || fingerOfindex.index in origins) {
            callback(null, { url: fingerOfindex.url, index: fingerOfindex.index, key: key })
        } else {
            const lastKey = addNumberToIndex(serverProperties.maxIndex / 2)
            let proto = loadProto()
            let client = new proto.game.Actions(
                fingerTable[lastKey].url,
                grpc.credentials.createInsecure(),
                {
                    'grpc.min_reconnect_backoff_ms': 1000,
                    'grpc.max_reconnect_backoff_ms': 10000,
                }
            )
            origins.push(datasource.data.currentIndex)
            client.getServerUrlByKey({
                key: key,
                origins: origins
            }, (err, resp) => {
                callback(null, { url: resp.url, index: resp.index, key: resp.key })
            })
        }
    } else {
        const firstKey = addNumberToIndex(1)
        const lastKey = addNumberToIndex(serverProperties.maxIndex / 2)
        const finger = Object.keys(fingerTable)
            .map(key => {
                let table = fingerTable[key]
                if (table.key < firstKey) {
                    const copyObject = Object.assign(table);
                    copyObject.key = bigInt(copyObject.key).add(serverProperties.maxIndex)
                    return compareIndex
                }
                return table
            })
            .sort((a, b) => a.key - b.key)
            .find(table => compareIndex(bigInt(key), bigInt(table.key)))
        console.log("finger", finger)
        if (finger == null) {
            return callback(null, { url: getCurrentUrl(), index: datasource.data.currentIndex, key: key })
        }
        if (finger.index == key || finger.index in origins) {
            return callback(null, { url: finger.url, index: finger.index, key: key })
        } else {
            const client = buildClient(
                datasource.data.fingerTable[lastKey].url
            )
            origins.push(datasource.data.currentIndex)
            client.getServerUrlByKey({
                key: key,
                origins: origins
            }, (err, resp) => {
                callback(null, { url: resp.url, index: resp.index, key: resp.key })
            })
        }
    }
}

function buildClient(url) {
    let proto = loadProto()
    let client = new proto.game.Actions(
        url,
        grpc.credentials.createInsecure(),
        {
            'grpc.min_reconnect_backoff_ms': 1000,
            'grpc.max_reconnect_backoff_ms': 10000,
        }
    )
    return client
}
function getCurrentUrl() {
    return "localhost:" + serverProperties.port
}

main()

async function buildFingerTable() {
    if (serverProperties.parentUrl != null) {
        const client = buildClient(serverProperties.parentUrl)
        for (let i = 0; i < serverProperties.maxIndexExponent; i++) {
            if (datasource.data.fingerTable == undefined) {
                datasource.data.fingerTable = {}
            }
            const key = addNumberToIndex(bigInt(2).pow(i))
            await new Promise((resolve, reject) => {
                client.getServerUrlByKey({
                    key: key,
                    origins: [datasource.data.currentIndex]
                }, (err, resp) => {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    datasource.data.fingerTable[resp.key] = {
                        index: resp.index, key: resp.key, order: i, url: resp.url
                    }
                    resolve()
                })
            })
        }
        console.log(datasource.data.fingerTable)
        client.joinServer({ index: datasource.data.currentIndex, url: getCurrentUrl() }, (err, resp) => {
            console.log(resp)
        })
    } else {
        genereateFingerTable()
    }
}
buildFingerTable()

