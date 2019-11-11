import { datasource } from "../model/datasource";
import Room from '../model/Room'
import { hashOf } from "../util/hashUtil";

export function createRoom(name) {
    if (datasource.rooms == undefined) datasource.rooms = []
    const newRoom = new Room(
        hashOf(name),
        name
    )
    datasource.rooms.push(
        newRoom
    )
    console.log(datasource.rooms)
    return newRoom
}

export function listRoom() {
    if (datasource.rooms == undefined) datasource.rooms = []
    return datasource.rooms
}