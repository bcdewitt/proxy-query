// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const path = require('path')

module.exports = {
  transform: {
    '\\.js$': path.resolve(__dirname, 'jest/rollupTransform.js')
  }
}
