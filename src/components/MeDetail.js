import fetch from "@/api/fetch";
import Swiper from "swiper";
import 'swiper/dist/css/swiper.min.css'
import MiComment from '../components/MiComment'
import { productView } from "@/mock/productView";
import MiRecommend from '../components/MiRecommend'
import MiSKU from '../components/MiSKU'
import bus from "@/bus";
import { valid } from "mockjs";

export default {
  components: {
    MiComment,
    MiRecommend,
    MiSKU
  },
  data() {
    return {
      productData: null,
      galleryView: null,
      detailSwiper: null,
      titleView: null,
      canJoinActs: null,
      commentView: null,
      descTabsView: null,
      descTabsViewIndex:0,
      id:'',
      //遮罩层和sku弹框
      showMask: false,
      showSKU: false,
      selectedGood: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    bus.$emit('footerVisible', false)
    if(from.name) {
      fetch('productView', {
        commodity_id: to.params.id
      }).then(res => {
        next(vm => vm.setProductData(res))
      })
    } else {
      next(vm => vm.getProductData())
    }
  },
  beforeRouteLeave(to, from, next) {
    bus.$emit('footerVisible', true)
    next()
  },
  //创建时获取路由id
  created() {
    this.id = this.$route.params.id
  },
  destoryed() {
    //判断Swiper实例是否是数组再销毁
    if(Array.isArray(this.detailSwiper)) {
      this.detailSwiper.forEach(item => {
        item.destroy()
      })
    } else {
      this.detailSwiper.destroy();
    }
    this.$NProgress.remove();
  },
  methods: {
    getProductData() {
      this.$fetch('productView', {
        commodity_id: this.$route.params.id
      }).then(res => {
        this.setProductData(res, this.$route.params.id)
      })
    },
    setProductData(res) {
      this.$NProgress.done()
      this.$store.commit('setViewLoading', false)
      let data = res.data
      let viewContent = data.view_content
      console.log(viewContent)
      //商品描述
      let descTabsView = viewContent.descTabsView.descTabsView
      descTabsView.forEach(item => {
        //上部分描述3张图片,下部分展示更多
        let tabContent = item.tabContent
        if(tabContent.length > 3) {
          item.showTabContent = tabContent.slice(0, 3),
          item.moreTabContent = tabContent.slice(3)
        } else {
          item.showTabContent = tabContent
        }
        item.showMore = false
      })
      //必须先处理完数据再赋值
      this.productData = data
      //轮播
      this.galleryView = viewContent.galleryView.galleryView
      //顶部描述
      this.titleView = viewContent.titleView.titleView
      //促销
      this.canJoinActs = this.titleView.canJoinActs[0]
      console.log(this.canJoinActs)
      //评论
      this.commentView = viewContent.commentView.commentView
      //商品描述
      this.descTabsView = descTabsView

      

      //确认dom渲染完毕后进行Swiper处理
      this.$nextTick(() => {
        this.detailSwiper = new Swiper('.swiper-container', {
          pagination: {
            el: '.swiper-pagination'
          },
          //轮播循环
          loop: true,
          //图片懒加载预加载
          lazy: {
            loadPrevNext: true
          }
        })
      })
    },
    closeSKU() {
      this.showMask = false
      this.showSKU = false
    },
    //子组件触发事件，父组件监听到事件传递过来
    selectSKU(val) {
      this.selectedGood = val
    }
  }
}