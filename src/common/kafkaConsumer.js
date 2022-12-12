/**
 * Create a kafka consumer
 */
const logger = require('./logger')
const Kafka = require('no-kafka')
const healthcheck = require('topcoder-healthcheck-dropin')

/**
 * Create a kafka consumer
 * @param {Array<String>} topics the list of topics to be subscribed to
 * @param {Object} options the kafka group consumer options
 * @param {Function} handlerFunction the async function to be used to process each message in a topic
 */
module.exports = (topics, options, handlerFunction) => {
  // create the consumer
  const consumer = new Kafka.GroupConsumer(options)

  // data handler
  const dataHandler = async (messageSet, topic, partition) => Promise.each(messageSet, async (m) => {
    const message = m.message.value.toString('utf8')
    logger.info(`Handle Kafka event message; Topic: ${topic}; Partition: ${partition}; Offset: ${
      m.offset}; Message: ${message}.`)
    let messageJSON
    try {
      messageJSON = JSON.parse(message)
    } catch (e) {
      logger.error('Invalid message JSON.')
      logger.logFullError(e)
      // ignore the message
      return
    }
    if (messageJSON.topic !== topic) {
      logger.error(`The message topic ${messageJSON.topic} doesn't match the Kafka topic ${topic}.`)
      // ignore the message
      return
    }
    try {
      return handlerFunction(topic, messageJSON)
    } catch (err) {
      logger.error(`Error processing message ${JSON.stringify(messageJSON)}`)
      logger.logFullError(err)
    } finally {
      // Commit offset regardless of error
      await consumer.commitOffset({ topic, partition, offset: m.offset })
    }
  })

  // check if there is kafka connection alive
  function check () {
    if (!consumer.client.initialBrokers && !consumer.client.initialBrokers.length) {
      return false
    }
    let connected = true
    consumer.client.initialBrokers.forEach(conn => {
      logger.debug(`url ${conn.server()} - connected=${conn.connected}`)
      connected = conn.connected & connected
    })
    return connected
  }

  logger.info('Starting kafka consumer')
  consumer
    .init([{
      subscriptions: [
        ...topics
      ],
      handler: dataHandler
    }])
    .then(() => {
      healthcheck.init([check])
      logger.info('Kafka consumer initialized successfully')
    })
    .catch(logger.logFullError)
}
