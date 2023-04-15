# kafkajsnode


A quick repo to show how to use kafkajs with Confluent Cloud and Confluent Schema registry 

## Prerequisites  

* Confluent Cloud kafka cluster 
* Confluent Cloud Schema Registry cluster
* Install of kafkajs and kafkajs schema registry
 * `npm install kafkajs`
 * `npm install @kafkajs/confluent-schema-registry` 


## Start here

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

## Register Avro schema  


You can register schema, read IDs and read schemas with the client: 
```
node avro.js 
```


## Simple none SR producer/consumer 

```
node producer_consumer_no_SR.js
```

## Reference 

[kafkajs schema registry github](https://github.com/kafkajs/confluent-schema-registry/tree/a3921d3cbd203eb7c41a0cb321b12a2608c7ecd8)  
[kafkajs schema registry docs](https://kafkajs.github.io/confluent-schema-registry/)


[kafkajs github](https://github.com/tulios/kafkajs)  
[kafkajs docs](https://kafka.js.org/)