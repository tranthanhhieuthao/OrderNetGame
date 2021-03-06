import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import layout from '@/layout'
import firebase from 'firebase'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
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
    path: '/',
    name: 'login',
    component: layout,
    children: [
      {
        path: '/',
        component: () => import('@/components/login'),
        meta: {
          requiresAuth: false,
          role: []
        }
      }
    ]
  },
  {
    path: '/food',
    name: 'Food',
    component: layout,
    children: [
      {
        path: '/food',
        component: () => import('@/views/orderFood/index'),
        meta: {
          requiresAuth: true,
          roles: ['ROLE_USER', 'ROLE_ADMIN']
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
  if (VueCookies.get('username') === null) VueCookies.set('username', 'Noname', '4h')
  if (store.state.app.usernameReload !== 'Noname' || VueCookies.get('username') !== 'Noname') {
    console.log(VueCookies.get('username'))
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
    if (Token === null) {
      next('')
    } else next()
  } else next()
})

export default router
