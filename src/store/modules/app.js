import VueCookies from 'vue-cookies'
const state = {
  usernameReload: VueCookies.get('username') !== null ? VueCookies.get('username') : 'Noname',
  dataUserCurrent: {}
}

const mutations = {
  USERNAME_RELOAD: (state, name) => {
    state.usernameReload = name
  },
  DATA_USER_CURRENT: (state, data) => {
    state.dataUserCurrent = data
  }
}

const actions = {
  usernameReload({commit}, name) {
    commit('USERNAME_RELOAD', name)
  },
  dataUserCurrent({commit}, data) {
    commit('DATA_USER_CURRENT', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
