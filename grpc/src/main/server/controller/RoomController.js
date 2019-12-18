import { save, action } from "../util/logUtil"
import { Log } from "../model/log"
import * as roomService from "../service/RoomService"
import { verifyConsistentHash } from "../util/hashUtil"
import { serverProperties } from "../model/datasource"
import * as kafkaUtil from "../util/kafkaUtil"
import { getClient } from "../util/grpcClientUtil"

const port = process.argv[3] != null ? process.argv[3] : process.argv[2]
const kafkaTopicReply = "create-room-response-" + port
const kafkaTopicRequest = "create-room-request-" + port

kafkaUtil.createConsumer(kafkaTopicRequest, message => {
    save(new Log(action.createRoom, message.request))
    const response = roomService.createRoom(message.request.name)
    kafkaUtil.createProducer(kafkaTopicReply, JSON.stringify({
        response: {
            id: response.id,
            name: response.name
        },
        id: message.id
    }))
})
export async function createRoom(call, callback) {
    const { name } = call.request
    const serverTarget = verifyConsistentHash(name)
    console.log(serverTarget)
    if (serverTarget.port != null) {
        const grpcClient = await getClient(serverTarget.clients)
        grpcClient.createRoom({ name: name }, (err, response) => {
            if (err) throw err
            console.log("msg enviada", response)
            callback(null, response)
        })
    } else {
        const id = Math.random() * Math.pow(10, 9)
        kafkaUtil.createConsumer(kafkaTopicReply, message => {
            if (message.id == id) {
                callback(null, {
                    id: message.response.id,
                    name: message.response.name
                })
            }
        })
        kafkaUtil.createProducer(kafkaTopicRequest, JSON.stringify({
            request: call.request,
            id: id
        }))

    }

}
export async function listRooms(call, callback) {

    const { origin } = call.request == null ? [] : call.request
    console.log(origin)
    const atualServer = serverProperties.routes.self.base
    origin.push(atualServer.hash)

    new Promise((resolve, reject) => {
        let responses = []
        let clients = serverProperties.routes.fingerprinting.filter((element, i) => {
            const clientsAlreadyCalled = origin.filter(hash => element.hash == hash)
            return element.port != null && clientsAlreadyCalled.length == 0 && (i == 0 || element.hash != serverProperties.routes.fingerprinting[i - 1].hash)
        })
        if (clients.length == 0) {
            resolve(responses)
        }
        clients.forEach(async route => {
            const grpcClient = await getClient(route.clients)
            grpcClient.listRooms({ origin }, (err, response) => {
                let responseValue = response
                if (err) responseValue = { rooms: [] }
                console.log("msg enviada", responseValue)
                responses.push(responseValue)
                if (responses.length == clients.length) {
                    resolve(responses)
                }
            })
        });
    }).then(val => {
        let response = { rooms: [] }
        let rooms = roomService.listRoom()
        rooms.forEach(room => response.rooms.push({ id: room.id, name: room.name }))
        console.log("val", val)
        val.forEach(roomsOfVal => {
            console.log("val entrou no if:", roomsOfVal)
            roomsOfVal.rooms.forEach(room => response.rooms.push({ id: room.id, name: room.name }))
        })
        let responseNotRepeated = { rooms: uniq(response.rooms) }
        console.log("response: ", responseNotRepeated)
        callback(null, responseNotRepeated)
    })

}

function uniq(a) {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item.id) ? false : (seen[item.id] = true);
    });
}
