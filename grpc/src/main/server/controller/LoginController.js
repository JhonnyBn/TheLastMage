import loginService from "../service/LoginService"
import { save, action } from "../util/logUtil"
import { Log } from "../model/log"
import { verifyConsistentHash, hashOf } from "../util/hashUtil"

export default function login(call, callback) {

    const { username, password } = call.request
    const serverTarget = verifyConsistentHash(username)
    console.log(serverTarget)
    if (serverTarget.port != null) {
        serverTarget.client.login({ username: username, password: password }, (err, response) => {
            if (err) throw err
            console.log("msg enviada", response)
            callback(null, response)
        })
    } else {
        save(new Log(action.login, call.request))
        const resposta = {
            username: username,
            success: loginService(username, password)
        }
        callback(null, resposta)
    }

}