import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Welcome from './views/Welcome.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {path: '/', component: Welcome},
  {path: '/signin', component: () => import('./views/Signin.vue')},
  {path: '/signup', component: () => import('./views/Signup.vue')},
  {
    path: '/home',
    component: () => import('./views/Home.vue'),
    meta: {requiresAuth: true},
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(to => {
  if (to.meta.requiresAuth && !isSignedIn()) {
    return '/signin'
  }
})

export default router

function isSignedIn() {
  return Boolean(localStorage.getItem('sign'))
}
