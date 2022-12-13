import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
const MiLogin = () => import('../components/MiLogin')
const MiHome = () => import('../components/MiHome')
const MiCategory = () => import('../components/MiCategory')
const MiCart = () => import('../components/MiCart.vue')
const MiUser = () => import('../components/MiUser')
const MiList = () => import('../components/MiList')
const MiDetail = () => import('../components/MiDetail')
const MiSetting = () => import('../components/MiSetting')
const MiAddressList = () => import('../components/MiAddressList')
const MiAddressEdit = () => import('../components/MiAddressEdit')
const OrderCheckout = () => import(/* webpackChunkName: "orderCheckout" */ '../components/OrderCheckout.vue')
const OrderList = () => import(/* webpackChunkName: "orderList" */ '../components/OrderList.vue')
const OrderView = () => import(/* webpackChunkName: "orderView" */ '../components/OrderView.vue')

//路由懒加载,异步加载形式
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    //自动跳转到home
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'home',
    component: MiHome,
    //添加路由源,可以通过路由对象调用路由源$route
    meta: {
      index: 0
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: MiLogin
  },
  {
    path: '/category',
    name: 'category',
    component: MiCategory,
    meta: {
      index: 1
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: MiCart,
    meta: {
      index: 2,
      // requiresAuth: true
    }
  },
  {
    path: '/user',
    name: 'user',
    component: MiUser,
    meta: {
      index: 3
    }
  },
  {
    path: '/commodity/list/:id',
    name: 'list',
    component: MiList
  },
  {
    path: '/commodity/detail/:id',
    name: 'detail',
    component: MiDetail
  },
  {
    path: '/user/set',
    name: 'set',
    component: MiSetting,
    meta: {
      //设置登录路由权限
      // requiresAuth: true
    }
  },
  {
    path: '/address/list',
    name: 'addressList',
    component: MiAddressList,
    meta: {
      //设置登录路由权限
      // requiresAuth: true
    }
  },
  {
    path: '/address/edit',
    name: 'addressEdit',
    component: MiAddressEdit,
    meta: {
      //设置登录路由权限
      // requiresAuth: true
    }
  },
  {
    path: '/order/checkout',
    name: 'orderCheckout',
    component: OrderCheckout,
    meta: {
      // requiresAuth: true
    }
  },
  {
    path: '/order/list',
    name: 'orderList',
    component: OrderList,
    meta: {
      // requiresAuth: true
    }
  },
  {
    path: '/order/view/:id',
    name: 'orderView',
    component: OrderView
  },
]

const router = new VueRouter({
  routes,
  //解决路由回退跳转时前面加的哈希#
  mode: 'history'
})

export default router
