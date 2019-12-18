import loginService from "../service/LoginService"
import { save, action } from "../util/logUtil"
import { Log } from "../model/log"
import { verifyConsistentHash, hashOf } from "../util/hashUtil"
import * as kafkaUtil from "../util/kafkaUtil"

const port = process.argv[3] != null ? process.argv[3] : process.argv[2]
const kafkaTopicReply = "login-response-" + port
const kafkaTopicRequest = "login-request-" + port

kafkaUtil.createConsumer(kafkaTopicRequest, message => {
    const { username, password } = message.request
    save(new Log(action.login, message.request))
    const resposta = {
        username: username,
        success: loginService(username, password)
    }
    kafkaUtil.createProducer(kafkaTopicReply, JSON.stringify({
        response: resposta,
        id: message.id
    }))
})
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
        // save(new Log(action.login, call.request))
        // const resposta = {
        //     username: username,
        //     success: loginService(username, password)
        // }
        // callback(null, resposta)

        const id = Math.random() * Math.pow(10, 9)
        kafkaUtil.createConsumer(kafkaTopicReply, message => {
            if (message.id == id) {
                callback(null, message.response)
            }
        })
        kafkaUtil.createProducer(kafkaTopicRequest, JSON.stringify({
            request: call.request,
            id: id
        }))
    }

}