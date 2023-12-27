import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from './views/Home.vue'
import List from './views/List.vue'
import {isAdmin, isSignedIn} from './utils'
import {ElMessage} from 'element-plus'

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
      path: 'answer/:id',
      name: 'answer',
      component: () => import('./views/Answer.vue'),
      props: true,
    }],
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {requiresAuth: true},
    component: () => import('./views/Profile.vue'),
  },
  {
    path: '/admin',
    component: Home,
    meta: {requiresAuth: true},
    children: [{
      path: '',
      component: () => import('./views/Deal.vue'),
    }],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

function handelRouteError(msg: string) {
  ElMessage.error({
    message: msg,
    showClose: true,
  })
  console.error(msg)
}

router.beforeEach(to => {
  if (to.meta.requiresAuth) {
    if (isSignedIn()) {
      if (to.path.startsWith('/admin') && !isAdmin()) {
        handelRouteError('无权访问')
        return 'welcome'
      }
    } else {
      handelRouteError('需登录')
      return 'welcome'
    }
  }
})

export default router
