import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from './views/Home.vue'

const routes: RouteRecordRaw[] = [
  {path: '/', component: Home},
  {path: '/signin', component: () => import('./views/Signin.vue')},
  {path: '/signup', component: () => import('./views/Signup.vue')},
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
