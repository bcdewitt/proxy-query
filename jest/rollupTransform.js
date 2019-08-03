// Modified version of https://github.com/ambar/rollup-jest/blob/master/transform.js
const esmRequire = require('esm')(module/*, options */)
const findProjectRoot = require('find-project-root')
const path = require('path')
const rollupConfigPath = path.join(findProjectRoot(process.cwd()), 'rollup.config.js')
const rollupConfig = esmRequire(rollupConfigPath).default
const { rollup } = require('rollup')
const deasync = require('deasync')
const { callbackify } = require('util')
const { builtinModules } = require('module')

// Resolve module in memory without accessing the file system
const memory = ({ file, code }) => ({
  name: 'rollup-plugin-memory',
  resolveId: id => id === file ? id : null,
  load: id => id === file ? code : null
})

// Mark third party or builtin modules as external
const external = () => {
  const builtins = builtinModules.filter(m => !m.startsWith('_'))
  return {
    name: 'rollup-plugin-external',
    resolveId(id) {
      // Filter relative or absolute imported modules
      if (builtins.includes(id) || !id.startsWith('.') || !path.isAbsolute(id)) {
        return false
      }
      return null
    }
  }
}

// Transform ESM to CJS
const transform = async ({ file, code }) => {
  const { generate } = await rollup({
    input: file,

    // Add "memory" and "external" plugins after the ones found in the project's rollup config
    plugins: rollupConfig.plugins.concat([
      memory({ file, code }),
      external()
    ])
  })
  const { output } = await generate({ format: 'cjs' })
  return output[0].code
}

exports.process = (code, file) => {
  const transformSync = deasync(callbackify(transform))
  return transformSync({ file, code })
}
