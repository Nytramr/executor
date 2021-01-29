import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    name: '@nytramr/executor',
    file: 'build/index.js',
    format: 'umd',
    plugins: [terser({ mangle: { properties: { keep_quoted: true, reserved: ['define', 'compile'] } } })],
  },
  plugins: [resolve(), babel({ babelHelpers: 'bundled' })],
};
