import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from './views/Home.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('./views/Welcome.vue'),
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('./views/Signin.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('./views/Signup.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {requiresAuth: true},
    children: [{
      path: 'offer',
      component: () => import('./views/Offer.vue'),
    }, {
      path: 'answer',
      component: () => import('./views/Answer.vue'),
    }],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(to => {
  if (to.meta.requiresAuth && !isSignedIn()) {
    return 'welcome'
  }
})

export default router

function isSignedIn() {
  return Boolean(localStorage.getItem('sign'))
}
