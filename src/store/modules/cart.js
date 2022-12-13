import Cart from "@/api/cart";

export default {
  namespaced: true,
  state: {
    count: 0
  },
  mutations: {
    setCount(state, count) {
      state.count = count
    },
    addCount(state, number) {
      state.count += number
    }
  },
  actions: {
    getCount({commit}) {
      Cart.count().then(res => {
        commit('setCount', res.data)
      })
    }
  }
}