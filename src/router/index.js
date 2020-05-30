import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import VueCookies from 'vue-cookies'
import layout from '@/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/register',
    component: layout,
    children: [
      {
        path: '/register',
        name: 'register',
        component: () => import('@/components/register'),
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: '/showUser',
    component: layout,
    children: [
      {
        path: '/showUser',
        name: 'showUser',
        component: () => import('@/components/showUser'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/listPc',
    component: layout,
    children: [
      {
        path: '/listPc',
        name: 'listPc',
        component: () => import('@/views/viewPcGame/index'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/createPc',
    component: layout,
    children: [
      {
        path: '/createPc',
        name: 'createPc',
        component: () => import('@/views/viewPcGame/createPc'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: layout,
    children: [
      {
        path: '/login',
        component: () => import('@/components/login'),
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const Token = VueCookies.get('Token')
    if (Token === null) {
      next('login')
    } else next()
  } else next()
})

export default router
