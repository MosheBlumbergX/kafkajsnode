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
  ssl: true,
  sasl: {
      mechanism: 'plain',
      username: 'xxx',
      password: 'xxx'
  },
  //logLevel: logLevel.DEBUG
  })


const run = async () => {
    const schema = `
    {
      "type": "record",
      "name": "new",
      "namespace": "mysubject",
      "fields": [{ "type": "string", "name": "fullName" }]
    }
  `

// Register new schema 

const { id } =  registry.register({
    type: SchemaType.AVRO,
    schema
})


// Sleep to complete the registration 
console.log("waiting for the registration to complete")
 await sleep(5000)
 function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


// Get schmea ID with subject and version
 const subject = 'mysubject.new'
 const version = 1
 
 const id3 = await registry.getRegistryId(subject, version)
 console.log(id3)


// Get schmea latest ID with subject 
  const subject2 = 'mysubject.new'
  const id2 = await registry.getLatestSchemaId(subject2)
  console.log(id2)    
  


// Get schmea with ID
  const schemaout = await registry.getSchema(id2)
  console.log(schemaout)    

}









run().catch(async e => {
  console.error(e)
  process.exit(1)
})