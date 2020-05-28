import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
var firebaseConfig = {
  apiKey: "AIzaSyCVbaDGN83HN-ZV3IzYaMVPuSLgE1EYm2I",
  authDomain: "odernetgame.firebaseapp.com",
  databaseURL: "https://odernetgame.firebaseio.com",
  projectId: "odernetgame",
  storageBucket: "odernetgame.appspot.com",
  messagingSenderId: "977829779495",
  appId: "1:977829779495:web:814d1a60f57c8189781602",
  measurementId: "G-V1HKXJ5RP7"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
