import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG'],
  appType: 'spa',
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
})
