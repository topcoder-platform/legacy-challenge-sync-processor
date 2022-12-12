# Topcoder - Legacy Challenge Sync Processor

This microservice processes kafka events related to challenges and updates data in ElasticSearch and DynamoDB

### Development deployment status
[![CircleCI](https://circleci.com/gh/topcoder-platform/legacy-challenge-sync-processor/tree/develop.svg?style=svg)](https://circleci.com/gh/topcoder-platform/legacy-challenge-sync-processor/tree/develop)

### Production deployment status
[![CircleCI](https://circleci.com/gh/topcoder-platform/legacy-challenge-sync-processor/tree/master.svg?style=svg)](https://circleci.com/gh/topcoder-platform/legacy-challenge-sync-processor/tree/master)
  
## Intended use

- Processor for updating challenge data in ES and DynamoDB
  
## Prerequisites

-  [NodeJS](https://nodejs.org/en/) (v8+)
-  [Elasticsearch v6](https://www.elastic.co/)
-  [Kafka](https://kafka.apache.org/)
-  [Docker](https://www.docker.com/)
-  [Docker Compose](https://docs.docker.com/compose/)

## Configuration

Configuration for the processor is at `config/default.js` and `config/production.js`.
The following parameters can be set in config files or in env variables:

- DISABLE_LOGGING: whether to disable logging, default is false
- LOG_LEVEL: the log level; default value: 'debug'
- AUTH0_URL: AUTH0 URL, used to get M2M token
- AUTH0_AUDIENCE: AUTH0 audience, used to get M2M token, default value is 'https://www.topcoder-dev.com'
- TOKEN_CACHE_TIME: AUTH0 token cache time, used to get M2M token
- AUTH0_PROXY_SERVER_URL: Auth0 proxy server url, used to get TC M2M token
- AUTH0_CLIENT_ID: AUTH0 client id, used to get M2M token
- AUTH0_CLIENT_SECRET: AUTH0 client secret, used to get M2M token
- KAFKA_URL: comma separated Kafka hosts; default value: 'localhost:9092'
- KAFKA_GROUP_ID: the Kafka group id; default value: 'legacy-challenge-sync-processor'
- KAFKA_CLIENT_CERT: Kafka connection certificate, optional; default value is undefined;
if not provided, then SSL connection is not used, direct insecure connection is used;
if provided, it can be either path to certificate file or certificate content
- KAFKA_CLIENT_CERT_KEY: Kafka connection private key, optional; default value is undefined;
if not provided, then SSL connection is not used, direct insecure connection is used;
if provided, it can be either path to private key file or private key content
- OR_NOTIFICATION_TOPIC: OR notification Kafka topic, default value is 'or.notification.create'
- esConfig: config object for Elasticsearch

Refer to `esConfig` variable in `config/default.js` for ES related configuration.

Set the following environment variables so that the app can get TC M2M token (use 'set' insted of 'export' for Windows OS):
```
export AUTH0_CLIENT_ID=EkE9qU3Ey6hdJwOsF1X0duwskqcDuElW
export AUTH0_CLIENT_SECRET=Iq7REiEacFmepPh0UpKoOmc6u74WjuoJriLayeVnt311qeKNBvhRNBe9BZ8WABYk
export AUTH0_URL=https://topcoder-dev.auth0.com/oauth/token
export AUTH0_AUDIENCE=https://m2m.topcoder-dev.com/
```

Also note that there is a `/health` endpoint that checks for the health of the app. This sets up an expressjs server and listens on the environment variable `PORT`. It's not part of the configuration file and needs to be passed as an environment variable

## Available commands
1. install dependencies `npm i`
2. run code lint check `npm run lint`, running `npm run lint:fix` can fix some lint errors if any
3. start processor app `npm start`

  
## Local Deployment

### Foreman Setup
To install foreman follow this [link](https://theforeman.org/manuals/1.24/#3.InstallingForeman)
To know how to use foreman follow this [link](https://theforeman.org/manuals/1.24/#2.Quickstart)

### Local Kafka setup

-  `http://kafka.apache.org/quickstart` contains details to setup and manage Kafka server,
below provides details to setup Kafka server in Mac, Windows will use bat commands in bin/windows instead

- download kafka at `https://www.apache.org/dyn/closer.cgi?path=/kafka/1.1.0/kafka_2.11-1.1.0.tgz`

- extract out the doanlowded tgz file
- go to extracted directory kafka_2.11-0.11.0.1
- start ZooKeeper server:
`bin/zookeeper-server-start.sh config/zookeeper.properties`
- use another terminal, go to same directory, start the Kafka server:
`bin/kafka-server-start.sh config/server.properties`
- note that the zookeeper server is at localhost:2181, and Kafka server is at localhost:9092
- use another terminal, go to same directory, create topics:
`bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic or.notification.create`

- verify that the topics are created:

`bin/kafka-topics.sh --list --zookeeper localhost:2181`,

it should list out the created topics
- run the producer and then write some message into the console to send to the `or.notification.create` topic:

`bin/kafka-console-producer.sh --broker-list localhost:9092 --topic or.notification.create`

in the console, write message, one message per line:

```json
{
  "topic": "or.notification.create",
  "originator": "tc-online-review",
  "mime-type": "application/json",
  "timestamp": "2022-05-31T06:15:05.584Z",
  "payload": {
    "challengeId": 721,
    "userId": 132456,
    "type": "messageType",
    "data": {}
  }
}
```

- optionally, use another terminal, go to same directory, start a consumer to view the messages:

`bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic or.notification.create --from-beginning`

- send/view messages to/from other topics are similar

### Local Elasticsearch setup
- in the `docker-es` folder, run `docker-compose up`

### Local deployment without Docker
- run `npm i` and `npm start`
- install dependencies `npm i`
- run code lint check `npm run lint`, running `npm run lint:fix` can fix some lint errors if any
- start processor app `npm start`

### Local Deployment with Docker

To run the Challenge ES Processor using docker, follow the below steps
1. Navigate to the directory `docker`
2. Rename the file `sample.api.env` to `api.env`
3. Set the required AWS credentials in the file `api.env`
4. Once that is done, run the following command
```
docker-compose up
```
5. When you are running the application for the first time, It will take some time initially to download the image and install the dependencies

 
## Production deployment

- TBD

## Running tests Locally

### Configuration

The following test parameters can be set in config file or in env variables:

- esConfig: config object for Elasticsearch

Integration tests use different index `challenge-test` which is not same as the usual index `challenge`.

Please ensure to create the index `challenge-test` or the index specified in the environment variable `ES_INDEX_TEST` before running the Integration tests. You could re-use the existing scripts to create index but you would need to set the below environment variable
```
export ES_INDEX=challenge-test
```

## Verification
Refer to the verification document `Verification.md`

Commit to force redeployment
