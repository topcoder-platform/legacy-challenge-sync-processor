/**
 * The default configuration file.
 */

module.exports = {
  DISABLE_LOGGING: process.env.DISABLE_LOGGING ? process.env.DISABLE_LOGGING === 'true' : false, // If true, logging will be disabled
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  // used to get M2M token
  AUTH0_URL: process.env.AUTH0_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://www.topcoder-dev.com',
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME,
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,

  KAFKA_URL: process.env.KAFKA_URL || 'localhost:9092',
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'legacy-challenge-sync-processor',
  // below are used for secure Kafka connection, they are optional
  // for the local Kafka, they are not needed
  KAFKA_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT,
  KAFKA_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY,

  OR_NOTIFICATION_TOPIC: process.env.OR_NOTIFICATION_TOPIC || 'or.notification.create',

  CHALLENGE_SYNC_URL: process.env.CHALLENGE_SYNC_URL || 'https://api.topcoder-dev.com/v5/challenge-migration/sync',
  CHALLENGE_MIGRATION_URL: process.env.CHALLENGE_MIGRATION_URL || 'https://api.topcoder-dev.com/v5/challenge-migration',
  CHALLENGE_API_URL: process.env.CHALLENGE_API_URL || 'https://api.topcoder-dev.com/v5/challenges'
}
