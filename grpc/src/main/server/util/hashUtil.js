import crypto from "crypto"
export function hashOf(value){
    crypto.createHash('md5').update(value).digest("hex")
}