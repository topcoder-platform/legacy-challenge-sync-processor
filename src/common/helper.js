/**
 * Contains generic helper methods
 */

const config = require('config')
const _ = require('lodash')
const m2mAuth = require('tc-core-library-js').auth.m2m
const m2m = m2mAuth(_.pick(config, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME', 'AUTH0_PROXY_SERVER_URL']))
const axios = require('axios')

// ES Client mapping

/**
 * Get M2M token.
 * @return {String} the M2M token
 */
async function getM2MToken () {
  return m2m.getMachineToken(config.AUTH0_CLIENT_ID, config.AUTH0_CLIENT_SECRET)
}

/**
 * Trigger sync tool
 * @param {Number} legacyId legacy challenge ID
 */
async function triggerSync (legacyId) {
  const token = await getM2MToken()
  const res = await axios.post(config.CHALLENGE_SYNC_URL, null, {
    params: {
      force: true,
      legacyId
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return _.get(res, 'data')
}

/**
 * Trigger migration tool
 * @param {Number} legacyId legacy challenge ID
 */
async function triggerMigration (legacyId) {
  const token = await getM2MToken()
  const res = await axios.post(config.CHALLENGE_MIGRATION_URL, null, {
    params: {
      legacyId
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return _.get(res, 'data')
}

/**
 * Get migration statuses
 * @param {Number} legacyId legacy challenge ID
 */
async function getMigrationStatuses (legacyId) {
  const token = await getM2MToken()
  const res = await axios.get(config.CHALLENGE_MIGRATION_URL, null, {
    params: {
      legacyId
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return _.get(res, 'data')
}

/**
 * Get challenge by legacy Id
 * @param {Number} legacyId legacy challenge ID
 * @returns the challenge
 */
async function getChallengeFromV5 (legacyId) {
  const token = await getM2MToken()
  const res = await axios.get(config.CHALLENGE_API_URL, {
    params: {
      legacyId
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return _.get(res, 'data[0]')
}

/**
 * Force ES feeder
 * @param {Number} legacyId legacy challenge ID
 */
async function forceV4ESFeeder (legacyId) {
  const token = await getM2MToken()
  const body = {
    param: {
      challengeIds: [legacyId]
    }
  }
  await request.put(`${config.V4_ES_FEEDER_API_URL}`).send(body).set({ Authorization: `Bearer ${token}` })
}

module.exports = {
  triggerSync,
  getChallengeFromV5,
  triggerMigration,
  getMigrationStatuses,
  forceV4ESFeeder
}
