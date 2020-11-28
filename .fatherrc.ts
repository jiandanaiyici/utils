import { IBundleOptions } from "father";
import pkg from './package.json';
console.log(pkg, 'pkg')

export default {
  entry: 'src/index.ts',
  esm: {
    type: 'rollup',
  },
  cjs: {
    type: 'rollup'
  },
  doc: {
    themeConfig: { mode: 'light' },
  } as any,
  target: 'browser',
  preCommit: {
    eslint: true,
    prettier: true,
  }
} as IBundleOptions;
