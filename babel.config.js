module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }] // let rollup handle modules
  ],
  plugins: [
    ['@babel/plugin-proposal-optional-chaining', { loose: true }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }]
  ]
}
