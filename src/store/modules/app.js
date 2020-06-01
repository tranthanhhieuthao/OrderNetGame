const state = {
  usernameReload: ''
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
