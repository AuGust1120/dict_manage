import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),vueJsx()],
  server:{
    host:"0.0.0.0"
  },
  // devServer: {
  //   host: '192.168.50.88',
  //   port: 8080, // 可以根据需要更改端口
  //   disableHostCheck: true,
  // },
})
