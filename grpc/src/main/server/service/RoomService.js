import { datasource } from "../model/datasource";
import Room from '../model/Room'
import { hashOf } from "../util/hashUtil";

export function createRoom(name) {
    if (datasource.data.rooms == undefined) datasource.data.rooms = []
    const newRoom = new Room(
        hashOf(name),
        name
    )
    datasource.data.rooms.push(
        newRoom
    )
    console.log(datasource.data.rooms)
    return newRoom
}

export function listRoom() {
    if (datasource.data.rooms == undefined) datasource.data.rooms = []
    return datasource.data.rooms
}