import Vue from 'vue'
import Vuex from 'vuex'
import decode from'jwt-decode';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isAuth: false,
    CG: {},
    navbarItems: [],
    type: 'list',
  },
  getters: {
    getAllCG: (state) => state.CG,
    getNavbarItems: (state) => state.navbarItems,
    getUserId: (state) => state.user._id
  },
  mutations: {
    setCG: (state, Cg) => state.CG.push(Cg),
    setNavbarItems: (state, items) => state.navbarItems = items,
    setType: (state, type) => state.type = type,
    setUser: (state, user) => state.user = user
  },
  actions: {
    autoLogin ({ commit }) {
      if (localStorage.getItem('jwt')){

        let user = decode(localStorage.getItem('jwt'))

        commit('setUser', user)
      }
    }
  },
})
