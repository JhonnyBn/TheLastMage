import { save, action } from "../util/logUtil"
import { Log } from "../model/log"
import * as roomService from "../service/RoomService"
import { verifyConsistentHash } from "../util/hashUtil"
import { serverProperties } from "../model/datasource"

export function createRoom(call, callback) {
    const { name } = call.request
    const serverTarget = verifyConsistentHash(name)
    console.log(serverTarget)
    if (serverTarget.port != null) {
        serverTarget.client.createRoom({ name: name }, (err, response) => {
            if (err) throw err
            console.log("msg enviada", response)
            callback(null, response)
        })
    } else {
        save(new Log(action.createRoom, call.request))
        const response = roomService.createRoom(name)
        callback(null, {
            id: response.id,
            name: response.name
        })
    }

}
export function listRooms(call, callback) {

    const { origin } = call.request == null ? [] : call.request
    console.log(origin)
    const atualServer = serverProperties.routes.find(route => route.port == null)
    origin.push(atualServer.hash)

    new Promise((resolve, reject) => {
        let responses = []
        let clients = serverProperties.routes.filter(element => {
            const clientsAlreadyCalled = origin.filter(hash => element.hash == hash)
            return element.port != null && clientsAlreadyCalled.length == 0
        })
        if (clients.length == 0) {
            resolve(responses)
        }
        clients.forEach(route => {
            route.client.listRooms({ origin }, (err, response) => {
                if (err) throw err
                console.log("msg enviada", response)
                responses.push(response)
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
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
