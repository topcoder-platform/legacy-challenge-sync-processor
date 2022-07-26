/**
 *  Service
 */
const _ = require('lodash')
const Joi = require('joi')
const logger = require('../common/logger')
const helper = require('../common/helper')

Joi.optionalId = () => Joi.string().uuid()
Joi.id = () => Joi.optionalId().required()

const intOrUUID = () => Joi.alternatives().try(Joi.number().integer().min(1), Joi.string().uuid())

/**
 * Process message.
 * @param {Object} message the challenge updated message
 */
async function process (message) {
  switch (message.payload.type) {
    case 'resources':
    case 'status':
    case 'properties':
    case 'timeline':
    case 'prize':
    case 'winner':
    case 'payments':
    case 'review':
    case 'feedback':
      const v5Challenge = await helper.getChallengeFromV5(message.payload.challengeId)
      if (!v5Challenge) {
        logger.info(`Migrating challenge ${message.payload.challengeId}`)
        const existingMigrations = await helper.getMigrationStatuses(message.payload.challengeId)
        if (_.get(existingMigrations, 'length') > 0) {
          logger.info('Already migrated!')
        } else {
          await helper.triggerMigration(message.payload.challengeId)
        }
        break
      } else {
        logger.info(`Syncing challenge ${message.payload.challengeId}`)
        await helper.triggerSync(message.payload.challengeId)
      }
      try {
        logger.info(`Forcing ES feeder ${message.payload.challengeId}`)
        await helper.forceV4ESFeeder(message.payload.challengeId)
      } catch (e) {
        logger.error(`createChallenge - Error calling forceV4ESFeeder ${e}`)
      }
      break
    default:
      logger.info('Ignoring message as type is not supported')
  }
  logger.info('After processing message')
}

process.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      challengeId: intOrUUID().required(),
      type: Joi.string().required(),
      data: Joi.object().required()
    }).unknown(true).required()
  }).required()
}

module.exports = {
  process
}

// logger.buildService(module.exports)
