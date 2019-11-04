import { save, action } from "../util/logUtil"
import { Log } from "../model/log"
import { datasource } from "../model/datasource"
import * as roomService  from "../service/RoomService"

export function createRoom(call, callback){
    const { name } = call.request
    save(new Log(action.createRoom, call.request))
    const response = roomService.createRoom(name)
    callback(null,{
        id : response.id,
        name: response.name
    })

}