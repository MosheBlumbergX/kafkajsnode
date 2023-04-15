const { Kafka, CompressionTypes, logLevel } = require('kafkajs')

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({ 
  clientId: 'example-consumer',
  brokers: ['xxx.eu-west-2.aws.confluent.cloud:9092'],
  ssl: true,
  sasl: {
      mechanism: 'plain',
      username: 'xxx',
      password: 'xxx'
  },
  //logLevel: logLevel.DEBUG
  })


const producer = kafka.producer()
producer.on('producer.connect', () => {
  console.log(`KafkaProvider: connected`);
});
producer.on('producer.disconnect', () => {
  console.log(`KafkaProvider: could not connect`);
});
producer.on('producer.network.request_timeout', (payload) => {
  console.log(`KafkaProvider: request timeout ${payload.clientId}`);
});
const run = async () => {
  // Producing
  await producer.connect()
  await producer.send({
    topic: 'topickafkajsnotavro',
    messages: [
      {
        value: Buffer.from(JSON.stringify(
          {
            "event_name": "QA",
            "external_id": "5a12cba8",
            "payload": {
              "supplier_id": "dsfsdf",
              "assessment": {
                "performance": 7,
                "quality": 7,
                "communication": 7,
                "flexibility": 7,
                "cost": 7,
                "delivery": 6
              }
            },
            "metadata": {
              "user_uuid": "5a12cba8-f4b5-495b-80ea-d0dd5d4ee17e"
            }
          }
        ))
      },
    ],
  })

  // Consuming

const topic = 'topickafkajsnotavro'
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`- ${prefix} ${message.key}#${message.value}`)
    },
  })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})






}

run().catch(console.error)