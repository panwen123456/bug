//开发时用rap的host，上线打包host
const host = 'http://rap2api.taobao.org/app/mock/307909'
//const host = ''
const url = {
  getCode: '/api/getCode',
  login: '/api/login',
  navList: '/api/navList',
  homePage: '/api/homePage',
  category: 'http://rap2api.taobao.org/app/mock/308136/api/category',
  commodity: 'http://rap2api.taobao.org/app/mock/308196/api/commodityList',
  forRecommend: 'http://rap2api.taobao.org/app/mock/308196/api/forRecommend',
  productView: 'http://rap2api.taobao.org/app/mock/308204/api/productView',
  recommend: 'http://rap2api.taobao.org/app/mock/308204/api/recommend',
  cartIndex: 'http://rap2api.taobao.org/app/mock/13801/cart/index',
  cartSelect: 'http://rap2api.taobao.org/app/mock/13801/cart/selcart',
  cartEdit: 'http://rap2api.taobao.org/app/mock/13801/cart/edit',
  cartAdd: 'http://rap2api.taobao.org/app/mock/13801/cart/add',
  cartDelete: 'http://rap2api.taobao.org/app/mock/13801/cart/del',
  cartSelService: 'http://rap2api.taobao.org/app/mock/13801/cart/selService',
  cartCount: 'http://rap2api.taobao.org/app/mock/308287/cart/count',
  logout: 'http://rap2api.taobao.org/app/mock/307909/api/logout',
  userInfo: 'http://rap2api.taobao.org/app/mock/307909/api/userInfo',
  addressList: 'http://rap2api.taobao.org/app/mock/13801/address/list',
  addressAdd: 'http://rap2api.taobao.org/app/mock/13801/address/add',
  addressSave: 'http://rap2api.taobao.org/app/mock/13801/address/save',
  addressView: 'http://rap2api.taobao.org/app/mock/13801/address/view',
  addressDel: 'http://rap2api.taobao.org/app/mock/13801/address/del',
  addressAll: 'http://rap2api.taobao.org/app/mock/13801/address/all',
  addressRegion: 'http://rap2api.taobao.org/app/mock/13801/address/region',
  estDelivery: 'http://rap2api.taobao.org/app/mock/13801/product/estDelivery',
  orderCheckout: 'http://rap2api.taobao.org/app/mock/13801/order/checkout',
  orderList: 'http://rap2api.taobao.org/app/mock/13801/order/list',
  orderView: 'http://rap2api.taobao.org/app/mock/13801/order/view'
}

Object.keys(url).forEach(key => {
  if (/^https?/.test(url[key])) return
  url[key] = host + url[key]
})


export default url