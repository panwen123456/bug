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
  cartSelService: 'http://rap2api.taobao.org/app/mock/13801/cart/selService'
}

Object.keys(url).forEach(key => {
  if (/^https?/.test(url[key])) return
  url[key] = host + url[key]
})


export default url