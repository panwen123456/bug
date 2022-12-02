import MiSearch from '../components/MiSearch'
import fetch from '@/api/fetch'

export default {
  components: {
    MiSearch
  },
  data() {
    return {
      cartList: null
    }
  },
  //路由跳转时先获取数据再路由跳转，当前刷新时也进行获取
  beforeRouteEnter(to, from, next) {
    if(from.name) {
      fetch('cartIndex').then(res => {
        next(vm => vm.setCartList(res))
      })
    } else {
      next(vm => vm.getCartList())
    }
  },
  methods: {
    getCartList() {
      this.$fetch('cartIndex').then(res => {
        this.setCartList(res)
      })
    },
    setCartList(res) {
      //获取数据加载的效果
      this.$NProgress.done()
      this.$store.commit('setViewLoading', false)
      this.cartList = res.data.data.items
    }
  }
}

