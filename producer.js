const path = require('path')


const { Kafka,logLevel } = require('kafkajs')
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
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: 'xxx',
        password: 'xxx'
    },
    //logLevel: logLevel.DEBUG
    })


const producer = kafka.producer()

const incomingTopic = 'jskafkatopic'

const run = async () => {

const schema = {
	type: 'record',
	namespace: 'test',
	name: 'B',
	fields: [{ name: 'fullName', type: 'string' }],
}

await registry.register(
	{ type: SchemaType.AVRO, 
    schema: JSON.stringify(schema) 
  },
	{ subject: 'jskafkatopic-value' },
)


 const subject = incomingTopic + '-value'
 const version = 1
 
 const id3 = await registry.getRegistryId(subject, version)

 console.log(id3)
 await producer.connect()

for (var i=1;i<=10; i++) {

const payload = { "fullName": 'John Doe' + i }

console.log(payload)

      const outgoingMessage = {
        value: await registry.encode(id3, payload)
      }
      
      await producer.send({
        topic: incomingTopic,
        messages: [ outgoingMessage ]
      })
    
      console.log(i)
    
    }
    producer.disconnect()

}
     

    
run().catch(async e => {
  console.error(e)
  producer && await producer.disconnect()
  process.exit(1)
})