import VueCookies from 'vue-cookies'
import firebase from 'firebase'
const state = {
  usernameReload: VueCookies.get('username') !== null ? VueCookies.get('username') : 'Noname',
  dataUserCurrent: {},
  device: 'desktop',
  timeUseService: false,
  stockFood: []
}

const mutations = {
  USERNAME_RELOAD: (state, name) => {
    state.usernameReload = name
  },
  DATA_USER_CURRENT: (state, data) => {
    state.dataUserCurrent = data
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TIME_USE_SERVICE: (state, value) => {
    state.timeUseService = value
  },
  STOCK_FOOD_USER: (state, value) => {
    state.stockFood = value
  }
}

const actions = {
  usernameReload({commit}, name) {
    commit('USERNAME_RELOAD', name)
  },
  dataUserCurrent({commit}, data) {
    commit('DATA_USER_CURRENT', data)
  },
  loginApplication({commit}, data) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(data.username, data.password)
        .then(res => resolve(res))
        .catch(er => reject(er))
    })
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  timeUseServiceCurrent({ commit }, value) {
    commit('TIME_USE_SERVICE', value)
  },
  stockFoodUser({ commit }, value) {
    commit('STOCK_FOOD_USER', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
