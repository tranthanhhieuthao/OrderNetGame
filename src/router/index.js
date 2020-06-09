import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import layout from '@/layout'
import firebase from 'firebase'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: layout,
    children: [
      {
        path: '/register',
        name: 'register',
        component: () => import('@/components/register'),
        meta: {
          requiresAuth: false,
          roles: []
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
          requiresAuth: true,
          roles: ['ROLE_ADMIN']
        }
      }
    ]
  },
  {
    path: '/detail',
    component: layout,
    children: [
      {
        path: '/detail/:id',
        name: 'detailUser',
        component: () => import('@/views/detailUser'),
        meta: {
          requiresAuth: true,
          roles: ['ROLE_USER', 'ROLE_ADMIN']
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
          requiresAuth: true,
          roles: ['ROLE_USER', 'ROLE_ADMIN']
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
          requiresAuth: true,
          roles: ['ROLE_ADMIN']
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
          requiresAuth: false,
          role: []
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
  var db = firebase.firestore()
  var count = 0
  if (store.state.app.usernameReload !== 'Noname') {
    db.collection('User').doc(VueCookies.get('username')).get().then(res => {
      if (to.meta.roles !== undefined) {
        to.meta.roles.forEach(e => {
          if (e === res.data().role) count++
        })
        if (count > 0) next()
        else {
          router.replace('/detail/' + VueCookies.get('username'))
        }
      } else {
        router.replace('/detail/' + VueCookies.get('username'))
      }
    })
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const Token = VueCookies.get('Token')
    // to.meta.roles.forEach(e => {
    //   if (e === 'ROLE_ADMIN') store.dispatch('app/showBtnAdmin', true)
    // })
    if (Token === null) {
      next('login')
    } else next()
  } else next()
})

export default router
