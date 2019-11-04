import { datasource } from "../model/datasource"
import crypto from "crypto"

export default function loginService(username, password) {
    if (datasource.clients == undefined) {
        datasource.clients = []
    }
    const client = datasource.clients.find(client => client.username == username)
    const passwordHash = crypto.createHash('md5').update(password).digest("hex")
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