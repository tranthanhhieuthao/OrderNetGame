import VueCookies from 'vue-cookies'
const state = {
  usernameReload: VueCookies.get('username') !== 'Noname' ? VueCookies.get('username') : 'Noname'
}

const mutations = {
  USERNAME_RELOAD: (state, name) => {
    state.usernameReload = name
  }
}

const actions = {
  usernameReload({commit}, name) {
    commit('USERNAME_RELOAD', name)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
