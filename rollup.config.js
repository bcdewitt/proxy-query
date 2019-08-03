import { eslint } from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import documentation from './rollup/rollup-plugin-documentation'

const input = 'src/index.js'
export default {
  input,
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    }
  ],
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: true
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    documentation({
      input,
      output: 'docs/API.md',
      format: 'md'
    })
  ]
}
