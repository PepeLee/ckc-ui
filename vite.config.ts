import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
      external: ['vue', 'markstream-vue'],
      output: {
        globals: {
          vue: 'Vue',
          'markstream-vue': 'MarkdownRender',
        },
      },
    },
    cssCodeSplit: false, // 合并所有CSS到一个文件
  }
})
