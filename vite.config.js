import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:         resolve(__dirname, 'index.html'),
        choice:       resolve(__dirname, 'choice.html'),
        designer:     resolve(__dirname, 'designer/index.html'),
        photographer: resolve(__dirname, 'photographer/index.html'),
        neyrotonin:   resolve(__dirname, 'designer/cases/neyrotonin.html'),
        phrase:       resolve(__dirname, 'designer/cases/phrase.html'),
        ermitazh:     resolve(__dirname, 'designer/cases/ermitazh.html'),
      }
    }
  }
})