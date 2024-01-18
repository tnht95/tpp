import { resolve } from 'node:path';

import { defineConfig, splitVendorChunkPlugin } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('./src/')
    }
  },
  plugins: [
    /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    splitVendorChunkPlugin()
  ],
  server: {
    port: 3000
  },
  build: {
    target: 'esnext'
  }
});
