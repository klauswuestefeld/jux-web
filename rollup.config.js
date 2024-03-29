import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: './src/scripts/main.ts',
    output: {
      file: './dist/main.esm.js',
      format: 'esm',
    },
    plugins: [typescript()],
    external: ['@azure/msal-browser'],
  },
  {
    input: './src/scripts/main.ts',
    output: {
      file: './dist/main.js',
      format: 'cjs',
    },
    plugins: [typescript()],
    external: ['@azure/msal-browser'],
  },
  {
    input: './src/scripts/main.ts',
    output: {
      file: './dist/jux-web.js',
      format: 'iife',
      name: 'juxWeb',
      exports: 'named',
      globals: {
        '@azure/msal-browser': 'msal',
      },
    },
    plugins: [
      commonjs({ include: 'node_modules/**', }),
      nodeResolve(),
      typescript()
    ],
  },
]
