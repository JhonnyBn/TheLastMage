import { datasource } from "../model/datasource"
import { hashOf } from "../util/hashUtil"


export default function loginService(username, password) {
    if (datasource.clients == undefined) {
        datasource.clients = []
    }
    const client = datasource.clients.find(client => client.username == username)
    const passwordHash = hashOf(password)
    if (client == undefined) {
        const newClient = {
            username: username,
            password: passwordHash
        }
        datasource.clients.push(newClient)
        return true
    }
    if (client.password == passwordHash) {
        return true
    } else {
        return false
    }
}