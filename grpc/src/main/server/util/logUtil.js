import fs from "fs";
import loginService from "../service/LoginService";
import { datasource, datasourceValue } from "../model/datasource";

const logSizeCacheSize = 20

export function save(log) {

    fs.appendFile('log.txt', JSON.stringify(log) + ";", function (err) {
        if (err) throw err
        console.log('Saved!')
    })
    datasource.logSize += 1
    console.log(datasource.logSize)
    if (datasource.logSize % logSizeCacheSize == 0) {
        fs.appendFile(`datasource${datasource.logSize / logSizeCacheSize}.json`, JSON.stringify(datasource), function (err) {
            if (err) throw err
            console.log('Saved!')
        })
    }
}
export function load() {
    datasource.logSize = 1;
    fs.readFile('./log.txt', "utf8", (err, fileData) => {
        if (err) return
        const logsInString = fileData.split(";")
        const cacheSize = logsInString.length - 1
        if (cacheSize >= logSizeCacheSize) {
            const cacheName = parseInt(cacheSize / logSizeCacheSize)
            fs.readFile(`datasource${cacheName}.json`, "utf8", (err, fileData) => {
                const cacheDatasource = JSON.parse(fileData)
                datasourceValue.data = cacheDatasource
                callServices(logsInString.slice(cacheName * logSizeCacheSize))
            })
        }
        else {
            callServices(logsInString)
        }
        datasource.logSize = cacheSize

    }
    )

}

function callServices(logsInString) {
    console.log(logsInString)
    logsInString.forEach(logString => {
        if (logString != "") {
            const log = JSON.parse(logString)
            if (log.action == action.login) {
                loginService(log.request.username, log.request.password)
            }
            console.log(log)
        }

    });
}


export const action = {
    login: "login",
    createRoom: "create_room"
}