// more config: https://d.umijs.org/config
import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'zn-utils',
  // mode: 'site',
  history: {
    type: 'hash',
  },
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  base: './',
  outputPath: 'docs-dist',
  publicPath: './',
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
});
