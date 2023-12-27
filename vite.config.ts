import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import optimizer from 'vite-plugin-optimizer'
export default ({ mode }) => {
  return defineConfig({
    base: "./",
    plugins: [
      vue(),
      optimizer({
        electron: `const { ipcRenderer } = require('electron'); export { ipcRenderer };`
      })
      // 部署测试
      // styleImport({
      //   resolves: [VantResolve()]
      // })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    build: {
      target: 'es2020',
      assetsDir: 'static',
      minify: 'esbuild', // 开启压缩
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        // 清除console和debugger
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        treeshake: true, // 开启 Tree Shaking，消除未使用的代码，减小最终的包大小
        input: {
          index: path.resolve(__dirname, "index.html")
        },
        output: {
          chunkFileNames: 'static/js/[hash].js',
          entryFileNames: 'static/js/[hash].js',
          assetFileNames: 'static/[ext]/[hash].[ext]',
          manualChunks(id) {
            if(id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: 8888,
      https: false,
      open: false,
      hmr: true,
      proxy: {
        "/api": {
          target:  loadEnv(mode, process.cwd()).VITE_BASE_API,
          ws: false,
          changeOrigin: true,
        }
      },
    },
  })
}
