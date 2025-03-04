/* eslint-disable */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: ['cypress/integration/**/*.spec.js', 'cypress/integration/*.spec.js'],
    baseUrl: 'http://localhost:3000',
  },
  env: {
    BACKEND: 'http://localhost:3003/api'
  }
})
