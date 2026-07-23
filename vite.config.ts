import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import svgLoader from 'vite-svg-loader';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.app.json',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      rollupTypes: true,
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ckcUI',
      fileName: 'ckc-ui',
      cssFileName: 'style', // 确保CSS文件名为style.css
    },
    rollupOptions: {
      external: ['vue', 'markstream-vue', 'mitt'],
      output: {
        globals: {
          vue: 'Vue',
          'markstream-vue': 'MarkdownRender',
          mitt: 'mitt',
        },
      },
    },
    cssCodeSplit: false, // 合并所有CSS到一个文件
  }
})
