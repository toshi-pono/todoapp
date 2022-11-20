import solid from 'solid-start/vite'
import { defineConfig } from 'vite'

import path from 'path'

const srcPath = path.resolve(__dirname, 'src').replace(/\\/g, '/')

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '/@': srcPath,
    },
  },
})
