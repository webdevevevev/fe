import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from './views/Home.vue'
import {isSignedIn} from './utils'

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
  {
    path: '/profile',
    name: 'profile',
    meta: {requiresAuth: true},
    component: () => import('./views/Profile.vue'),
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
