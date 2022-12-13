import Address from "@/api/address";

export default {
  //此时的命名空间是address
  namespaced: true,
  state: {
    list: []
  },
  getters: {
    default(state) {
      return state.list.find(item => {
        return item.is_default
      })
    }
  },
  mutations: {
    setList(state, list) {
      state.list = list
    }
  },
  actions: {
    getList({commit}, callback) {
      Address.list().then(res => {
        commit('setList', res.data)
        callback && callback()
      })
    }
  }
}