import Vue from 'vue'
import Vuex from 'vuex'
import fetch from '../api/fetch'
import address from './modules/address'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    viewLoading: false,
    transitionName: 'page-left',
    userInfo: null
  },
  getters: {
    isLogin: state => {
      return !!state.userInfo
      // return false
    }
  },
  mutations: {
    setViewLoading(state, value) {
      state.viewLoading = value
    },
    setTransitionName(state, value) {
      state.transitionName = value
    },
    setUserInfo(state, value) {
      state.userInfo = value
    }
  },
  actions: {
    //异步获取用户信息,解构赋值形式
    getUserInfo({commit}) {
      fetch('userInfo').then(res => {
        commit('setUserInfo', res.data.user)
      })
    }

  },
  modules: {
    address,
    cart
  }
})
