import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import sass from 'sass' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    svgr({ 
      svgrOptions: {},
    }),
  ], 
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
})
