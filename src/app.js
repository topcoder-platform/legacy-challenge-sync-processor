/**
 * The application entry point
 */

global.Promise = require('bluebird')
const config = require('config')
const ProcessorService = require('./services/ProcessorService')
const createKafkaConsumer = require('./common/kafkaConsumer')

// create consumer
const options = {
  connectionString: config.KAFKA_URL,
  handlerConcurrency: 1,
  groupId: config.KAFKA_GROUP_ID
}
if (config.KAFKA_CLIENT_CERT && config.KAFKA_CLIENT_CERT_KEY) {
  options.ssl = { cert: config.KAFKA_CLIENT_CERT, key: config.KAFKA_CLIENT_CERT_KEY }
}

createKafkaConsumer([
  config.OR_NOTIFICATION_TOPIC
],
options,
async (topic, messageJSON) => {
  switch (topic) {
    case config.OR_NOTIFICATION_TOPIC:
      await ProcessorService.process(messageJSON)
      break
    default:
      throw new Error(`Invalid topic: ${topic}`)
  }
})
