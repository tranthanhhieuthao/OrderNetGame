import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import register from '@/components/register'
// import login from '@/components/login'
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
    name: 'Register',
    component: register,
    meta: {
      requiresAuth: false
    }
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
  if(to.matched.some( record => record.meta.requiresAuth)){
  const Token = VueCookies.get('Token')
  if (Token === null) next('login')
  else next()
  } else next()
})

export default router
