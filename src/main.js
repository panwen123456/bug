import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import "nprogress/nprogress.css";
import './assets/css/reset.css'
import './assets/css/layout.css'
import './assets/fonts/iconfont.css'
import fetch from './api/fetch'
import VueLazyload from 'vue-lazyload'
import NProgress from "nprogress";
import mixins from './mixin'

//全局注入
Vue.mixin(mixins)
//取消加载的状态
NProgress.configure({ showSpinner: false });

Vue.use(VueLazyload)

//添加NProgress实例
Vue.prototype.$NProgress = NProgress
Vue.prototype.$fetch = fetch
Vue.config.productionTip = false

//全局路由守卫，所有页面的进度条

router.beforeEach((to, from, next) => {
  //进入每个路由页面都执行加载
  store.commit('setViewLoading', true)
  //无论路由切换还是刷新都启动
  NProgress.start()
  next()
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
