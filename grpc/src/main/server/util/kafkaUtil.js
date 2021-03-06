import * as kafka from 'kafka-node'
import * as fs from 'fs'
import * as path from 'path'
import { serverProperties } from '../model/datasource'

const Consumer = kafka.Consumer
const HighLevelProducer = kafka.HighLevelProducer
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' })
const producer = new HighLevelProducer(client);
const admin = new kafka.Admin(client);

const port = parseInt(process.argv[2])
const offSetFileName = `offSets_${port}.json`
let offSets = null
function init() {
    if (!fs.existsSync(offSetFileName)) {
        fs.writeFile(
            offSetFileName,
            "{}",
            (err) => { if (err) throw err; else loadOffSets() }
        )
    } else loadOffSets()
}

function loadOffSets() {
    try {
        const offSetFile = fs.readFileSync(offSetFileName, "utf8")
        console.log(offSetFile)
        const offSetsData = JSON.parse(offSetFile)
        offSets = offSetsData
    } catch (e) { }
}

function saveOffSets(topic, offset) {
    if (offSets > offSets[topic] || offSets[topic] == null) {
        offSets[topic] = offset
        fs.writeFile(
            offSetFileName,
            JSON.stringify(offSets),
            (err) => { if (err) throw err; else console.log('OffSets Saved!') }
        )
    }
}
init()

async function verifyIfTopicExist(topic) {
    if (offSets == null) init()
    return new Promise((resolve, reject) => {
        admin.listTopics((err, res) => {

            var topics = Object.keys(res[1].metadata)
            console.log(topics)
            console.log("Topics exist:", topic in topics, topics, topic)
            if (topics.find(t => t == topic) == null) {
                client.createTopics([{
                    topic: topic,
                    partitions: 1,
                    replicationFactor: 1
                }], (error, result) => {
                    console.log(error, result)
                    setTimeout(resolve, 2000)
                });
            } else {
                resolve()
            }
        })
    })
}

export async function createConsumer(topic, callback) {

    await verifyIfTopicExist(topic)
    const clientForConsumer = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' })
    const consumer = new Consumer(
        clientForConsumer,
        [
            { topic: topic, partition: 0 }
        ],
        {
            autoCommit: false,

        }
    );
    consumer.on('message', function (message) {
        console.log("Consumer message:", message)
        if (offSets[topic] < message.offset || offSets[topic] == null) {
            saveOffSets(message.topic, message.offset)
            callback(JSON.parse(message.value))
            // consumer.commit(function (err, data) { console.log(err, data) });
        }
    });

}


export async function createProducer(topic, message) {
    await verifyIfTopicExist(topic)
    console.log(`Sending to topic ${topic}, message:`, message)
    producer.send([{
        topic: topic,
        messages: message,
        attributes: 2
    }], (err, data) => console.log("Producer:", data))
}