import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path'
const srcPath = path.resolve(__dirname, 'src').replace(/\\/g, '/')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '/@': srcPath,
    },
  },
})
