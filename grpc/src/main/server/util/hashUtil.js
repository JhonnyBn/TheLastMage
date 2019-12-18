import crypto from "crypto"
import { serverProperties } from "../model/datasource"
export function hashOf(value) {
    return crypto.createHash('md5').update(value).digest("hex")
}

export function verifyConsistentHash(value) {
    console.log("------------------------------------------------------------------------")
    const hashValue = hashOf(value)
    let server = undefined
    if (serverProperties.routes.self.base.hash > serverProperties.routes.self.before.hash) {
        console.log(hashValue, serverProperties.routes.self.base.hash, hashValue, serverProperties.routes.self.before.hash)
        if (hashValue <= serverProperties.routes.self.base.hash && hashValue > serverProperties.routes.self.before.hash) {
            server = serverProperties.routes.self.base
        }
    } else {
        if (hashValue > serverProperties.routes.self.before.hash || hashValue <= serverProperties.routes.self.base.hash) {
            server = serverProperties.routes.self.base
        }
    }
    if (server == undefined) {
        server = serverProperties.routes.fingerprinting.find((s, i) => {
            if (i == 0 || s.index > serverProperties.routes.fingerprinting[0].index) {
                return hashValue >= s.index;
            }
            else {
                return hashValue <= s.index
            }
        })
    }

    if (server == undefined) {server=serverProperties.routes.fingerprinting.slice(-1)[0]}

    console.log(hashValue, server)
    return server
}