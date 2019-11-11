import { save, action } from "../util/logUtil"
import { Log } from "../model/log"
import * as roomService from "../service/RoomService"
import { verifyConsistentHash } from "../util/hashUtil"

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