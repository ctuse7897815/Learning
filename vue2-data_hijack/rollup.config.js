import nodeResolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
export default {
  input: './src/index.js',
  output: {
    format: 'umd', // 支持amd和commonjs规范 window.Vue
    name: 'Vue',
    file: 'dist/vue.js',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: 'node_modules/**',
    })
  ]
}