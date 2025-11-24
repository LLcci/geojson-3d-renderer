import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { templateCompilerOptions } from '@tresjs/core'

export default defineConfig({
  plugins: [
    vue({ ...templateCompilerOptions }),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      name: 'TresGeojson3D',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'three', '@tresjs/core'],
      output: {
        globals: {
          vue: 'Vue',
          three: 'THREE',
          '@tresjs/core': 'TresCore',
        },
      },
    },
  },
})
