var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY_DEV),
  FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN_DEV),
  FIREBASE_DATABASE_URL: JSON.stringify(process.env.FIREBASE_DATABASE_URL_DEV),
  FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET_DEV),
  FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID_DEV),
})
