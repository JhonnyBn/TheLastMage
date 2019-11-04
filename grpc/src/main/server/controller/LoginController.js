import loginService from "../service/LoginService"
import { save, action } from "../util/logUtil"
import { Log } from "../model/log"

export default function login(call, callback) {
    const { username, password } = call.request
    save(new Log(action.login, call.request))
    const resposta = {
        username: username,
        success: loginService(username, password)
    }
    callback(null, resposta)
}