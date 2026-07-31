import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 匹配 ai-report-panel，标记为原生自定义元素，跳过Vue组件解析
          isCustomElement: tag => tag === 'ai-report-panel'
        }
      }
    }),
    vueDevTools(),
        svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: 'prefixIds',
            params: {
              prefix: 'ckc-ui'
            }
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
