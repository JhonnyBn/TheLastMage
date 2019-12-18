import * as kafka from 'kafka-node'

const Consumer = kafka.Consumer
const HighLevelProducer = kafka.HighLevelProducer
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' })
const producer = new HighLevelProducer(client);
const admin = new kafka.Admin(client);

async function verifyIfTopicExist(topic) {
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
        callback(JSON.parse(message.value))
        consumer.commit(function (err, data) { console.log(err, data) });

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