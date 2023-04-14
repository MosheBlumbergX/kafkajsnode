const path = require('path')
const { Kafka, logLevel } = require('kafkajs')
const { SchemaRegistry, SchemaType, avdlToAVSCAsync } = require('@kafkajs/confluent-schema-registry')

const registry = new SchemaRegistry({ 
    host: 'https://xxx.eu-west-2.aws.confluent.cloud',
    auth: {
    username: 'xxx',
    password: 'xxx',
    },
})

const kafka = new Kafka({ 
    clientId: 'example-consumer',
    brokers: ['xxx.eu-west-2.aws.confluent.cloud:9092'],
//  ,logLevel: logLevel.DEBUG
    ssl: true,
    sasl: {
        mechanism: 'plain', // scram-sha-256 or scram-sha-512
        username: 'xxx',
        password: 'xxx'
    },
    })


const consumer = kafka.consumer({ groupId: 'myconsumer-group' })
const producer = kafka.producer()

const incomingTopic = 'jskafkatopic'

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: incomingTopic })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const decodedMessage = {
        ...message,
        value: await registry.decode(message.value)
      }
      console.log(decodedMessage)
    },
  })
}

run().catch(async e => {
  console.error(e)
  consumer && await consumer.disconnect()
  producer && await producer.disconnect()
  process.exit(1)
})