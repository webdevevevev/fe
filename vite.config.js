import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({command}) => ({
  plugins: [vue()],
  base: command === 'serve' ? '/' : '/fe/',
  server: {
    proxy: {
      '^/(?:sign|user|offer|province)': {
        target: 'https://mock.apifox.com/m1/3672598-0-default',
        changeOrigin: true,
        secure: false,
        bypass(req) {
          if (!req.headers?.authorization) {
            return '/'
          }
        },
      },
    },
  },
}))
