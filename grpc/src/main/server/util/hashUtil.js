import crypto from "crypto"
import { serverProperties } from "../model/datasource"
export function hashOf(value) {
    return crypto.createHash('md5').update(value).digest("hex")
}

export function verifyConsistentHash(value) {
    console.log(value)
    console.log("------------------------------------------------------------------------")
    console.log(serverProperties.routes)
    const hashValue = hashOf(value)
    console.log(hashValue)
    console.log(hashValue, serverProperties.routes[0].hash)
    if (hashValue >= serverProperties.routes[0].hash) {
        console.log(hashValue, serverProperties.routes[0].hash)
        return serverProperties.routes[0]
    }
    else {
        return serverProperties.routes.find((element, index) => {
            if (index + 1 <= serverProperties.routes.length - 1) {
                console.log(serverProperties.routes[index + 1].hash, hashValue)
                if (hashValue < serverProperties.routes[index + 1].hash || element.hash == hashValue)
                    return element
            } else {
                return element
            }
        });

    }
}