import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from './views/Home.vue'
import List from './views/List.vue'
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
      path: '',
      name: 'list',
      component: List,
    }, {
      path: 'offer/:id',
      name: 'offer',
      component: () => import('./views/Offer.vue'),
      props: true,
    }, {
      path: 'answer',
      name: 'answer',
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(to => {
  if (to.meta.requiresAuth && !isSignedIn()) {
    return 'welcome'
  }
})

export default router
