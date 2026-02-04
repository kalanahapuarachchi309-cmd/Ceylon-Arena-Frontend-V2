import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages repo name so built assets load from /FrontEnd-Gamming-event/
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-nojekyll',
      apply: 'build',
      enforce: 'post',
      async generateBundle() {
        fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '')
      }
    }
  ],
})
