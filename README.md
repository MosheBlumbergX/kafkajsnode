# kafkajsnode


A quick repo to show how to use kafkajs with Confluent Cloud and Confluent Schema registry 



* Create topic `jskafkatopic`: 

```
kafka-topics --bootstrap-server xxx.eu-west-2.aws.confluent.cloud:9092 --command-config <client.properties> --create --partitions 6 --replication-factor 3  --topic jskafkatopic
```

* In the `producer.js` file , replace the followings:
 * Schema Registry:
```
    host: 'https://xxxx.eu-west-2.aws.confluent.cloud',
    auth: {
    username: 'xxx',
    password: 'xxx',
```

  * Kafka 
```
    brokers: ['xxxx.eu-west-2.aws.confluent.cloud:9092'],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: 'xxx',
        password: 'xxx'
    },
```

The following code: 
* creates a schema in the schema registry called `jskafkatopic-value`, since this is the expected schema subject name to the used topic, it's shown in the UI as well.   
* Produce 100 messages in the format of `{ "fullName": 'John Doe' + i }` to the topic, which is encoded (line 72) with the schema, and writes it to the topic. 


```
node producer.js
```

The following code: 
* Consume from the topic with a given schema 

```
node consumer.js
```