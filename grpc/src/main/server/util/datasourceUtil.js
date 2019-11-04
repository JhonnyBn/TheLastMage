import fs from "fs";

const msgs = new Array()

export function saveMsg(msg) {
    msgs.push({ msg })
    fs.writeFile('./database.json', JSON.stringify(msgs), err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

export function loadMsgs(game) {
    return new Promise(resolve => {

        fs.readFile('./database.json', (err, fileData) => {
            if (err) {
                console.log('Error reading file', err)
                resolve(msgs)
                return;
            }
            const msgsLoaded = JSON.parse(fileData)
            console.log(msgsLoaded)
            msgsLoaded.forEach(data => {
                game.processInput(data.msg)
                msgs.push(data)
            })
            resolve(msgs)
        })

    })
}

export function deleteDatasource(){
    fs.writeFile('./database.json', "[]", err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}