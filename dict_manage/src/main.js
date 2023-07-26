import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'//引用路由
// import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconList from '@element-plus/icons-vue'
import { createPinia } from 'pinia'//引入这个方法
const app = createApp(App)
for (const name in ElIconList) {
    app.component(name, ElIconList[name])
   }
app.use(router).use(ElementPlus).use(createPinia()).mount('#app') 


