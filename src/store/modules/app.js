import VueCookies from 'vue-cookies'
import firebase from 'firebase'
const state = {
  usernameReload: VueCookies.get('username') !== null ? VueCookies.get('username') : 'Noname',
  dataUserCurrent: {},
  device: 'desktop'
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
