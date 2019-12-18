var kafka = require('kafka-node')

const KAFKA_TOPIC = 'teste13'

async function main() {

    Consumer = kafka.Consumer
    HighLevelProducer = kafka.HighLevelProducer
    client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' })
    producer = new HighLevelProducer(client);
    const admin = new kafka.Admin(client);
    await (new Promise((resolve, reject) => {
        admin.listTopics((err, res) => {

            var topics = Object.keys(res[1].metadata)
            if (KAFKA_TOPIC in topics == false) {
                client.createTopics([{
                    topic: KAFKA_TOPIC,
                    partitions: 2,
                    replicationFactor: 1
                }], (error, result) => {
                    console.log(error, result)
                    setTimeout(resolve,2000)
                });
            } else {
                resolve()
            }
        })
    }))
    consumer = new Consumer(
        client,
        [
            { topic: KAFKA_TOPIC, partition: 0 }
        ],
        {
            autoCommit: false,
            fromOffset: 'latest'
        }
    );
    var offset = new kafka.Offset(client);
    var latestOffset = 0
    offset.fetch([{ topic: KAFKA_TOPIC, partition: 0, time: -1 }], function (err, data) {
        latestOffset = data[KAFKA_TOPIC]['0'][0];
        console.log("Consumer current offset: " + latestOffset);
        consumer.on('message', function (message) {
            if (message.offset >= latestOffset)
                console.log(message);
        });
    });

    function send(msg) {
        producer.send([{
            topic: KAFKA_TOPIC,
            messages: msg,
            attributes: 2
        }], (err, data) => console.log(data))
    }

    function loop(i) {
        send("Hello World " + i)
        setTimeout(() => loop(++i), 1000)
    }

    producer.on('ready', function () {
        setTimeout(() => loop(0), 1000)
    });

    loop(0)
}
main()