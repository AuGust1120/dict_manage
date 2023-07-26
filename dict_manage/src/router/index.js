import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    component: Home,
    children:[
        {
            path:'dict',
            name:'dict',
            component:()=>import("../views/dict.vue")
        },
        {
          path:'dict/data/:dictType',
          name:'SystemDictData',
          component:()=>import("../components/dict/index.vue")
      },
        {
            path:'position',
            name:'position',
            component:()=>import("../views/position.vue")
        },
        {
            path:'notification',
            name:'notification',
            component:()=>import("../views/notification.vue")
        },
        {
            path:'/basic',
            name:'basic',
            component:()=>import("../views/basic.vue")
          },
          {
            path:'/pay',
            name:'pay',
            component:()=>import("../views/pay.vue")
          }
        
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router 