import { datasource } from "../model/datasource"
import { hashOf } from "../util/hashUtil"


export default function loginService(username, password) {
    console.log(datasource)
    if (datasource.data.clients == undefined) {
        datasource.data.clients = []
    }
    const client = datasource.data.clients.find(client => client.username == username)
    const passwordHash = hashOf(password)
    if (client == undefined) {
        const newClient = {
            username: username,
            password: passwordHash
        }
        datasource.data.clients.push(newClient)
        return true
    }
    if (client.password == passwordHash) {
        return true
    } else {
        return false
    }

}