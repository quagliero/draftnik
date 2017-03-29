var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY_LOCAL),
})
