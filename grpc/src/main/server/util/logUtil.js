import fs from "fs";
import loginService from "../service/LoginService";
import { datasource, serverProperties } from "../model/datasource";

let logAtualName = ""
export function save(log) {
    console.log(datasource)
    datasource.logSize += 1
    console.log(datasource.logSize)
    if (datasource.logSize % serverProperties.logSizeCacheSize == 0) {
        const logSize = datasource.logSize / serverProperties.logSizeCacheSize
        logAtualName = `${serverProperties.logServerPrefix}_${logSize + 1}.txt`
        fs.appendFile(
            `${serverProperties.logServerPrefix}_datasource${logSize}.json`,
            JSON.stringify(datasource),
            (err) => { if (err) throw err; else console.log('Saved!') }
        )
    }
    console.log(logAtualName)
    fs.appendFile(logAtualName, JSON.stringify(log) + ";", function (err) {
        if (err) throw err
        console.log('Saved!')
    })

}
export function load() {
    datasource.data = {}
    const files = fs.readdirSync("./")
    const serverFiles = files.filter(file => file.indexOf(serverProperties.logServerPrefix) > -1)
    const serverLogsFiles = serverFiles.filter(file => file.indexOf("datasource") <= -1)
    const serverDatabasesFiles = serverFiles.filter(file => file.indexOf("datasource") > -1)
    const sortedDatabasesFiles = serverDatabasesFiles.sort(file => getIndeOfDatasourceFileName(file))
    logAtualName = serverProperties.logServerPrefix + "_1.txt"
    if (sortedDatabasesFiles.length > 0) {
        const lastDatabase = sortedDatabasesFiles[0]
        const lastDatabaseIndex = getIndeOfDatasourceFileName(lastDatabase)
        const content = fs.readFileSync(lastDatabase, "utf8")
        const jsonData = JSON.parse(content)
        datasource.data = jsonData.data

        datasource.logSize = jsonData.logSize - 1
        console.log(datasource)
        executeLogFile(serverLogsFiles
            .filter(file => getIndeOfLogFileName(file) > lastDatabaseIndex))

    } else {
        datasource.logSize = 0
        console.log(datasource)
        executeLogFile(serverLogsFiles)
    }

    // loadFiles(serverFiles, serverLogsFiles)

}
function executeLogFile(files) {
    files.sort(file => getIndeOfLogFileName(file) * -1)
        .forEach(file => {
            const content = fs.readFileSync(file, "utf8")
            const logsInString = content.split(";")
            datasource.logSize += logsInString.length - 1
            console.log(datasource)
            logAtualName = serverProperties.logServerPrefix + "_" + getIndeOfLogFileName(file) + ".txt"
            console.log(logAtualName)
            callServices(logsInString)
        })
}
function getIndeOfDatasourceFileName(datasourceName) {
    return parseInt(datasourceName.replace(serverProperties.logServerPrefix + "_datasource", "").replace(".json", ""))
}
function getIndeOfLogFileName(datasourceName) {
    return parseInt(datasourceName.replace(serverProperties.logServerPrefix + "_", "").replace(".json", ""))
}

function loadFiles(serverFiles, serverLogsFiles) {
    return new Promise(async (resolve, rejects) => {
        if (serverLogsFiles.length > 0) {

            const lastFileName = serverLogsFiles
                .map(file => file.replace(serverProperties.logServerPrefix, ""))
                .sort(file => parseInt(file.replace("_", "").replace(".txt", "")))
            [0]
            console.log("lastFileName", lastFileName)
            fs.readFile(serverProperties.logServerPrefix + lastFileName, "utf8", async (err, fileData) => {
                if (err) {
                    throw err
                }
                const logsInString = fileData.split(";")
                const cacheSize = logsInString.length - 1
                if (cacheSize >= serverProperties.logSizeCacheSize) {
                    const cacheName = serverProperties.logServerPrefix + "_datasource" + lastFileName.replace(".txt", ".json").replace("_", "")
                    fs.readFile(cacheName, "utf8", async (err, fileData) => {
                        try {
                            if (err) {
                                throw err
                            }
                            const cacheDatasource = JSON.parse(fileData)
                            datasource.data = cacheDatasource
                            callServices(logsInString.slice(cacheName * serverProperties.logSizeCacheSize))
                        } catch (e) {
                            console.log(err)
                            await loadFiles(serverFiles, serverLogsFiles.filter(file => file != serverProperties.logServerPrefix + lastFileName))
                            callServices(logsInString)
                        }
                    })

                }
                else {
                    callServices(logsInString)
                }
                datasource.logSize = cacheSize
                logAtualName = `${serverProperties.logServerPrefix}_${parseInt(cacheSize / serverProperties.logSizeCacheSize)}.txt`
                console.log("logAtualName", logAtualName)
                resolve()

            }
            )
        } else {
            logAtualName = `${serverProperties.logServerPrefix}_1.txt`
            resolve()
        }
    })
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