import MiSearch from '../components/MiSearch'
import fetch from '@/api/fetch'
import { cartIndex } from '@/mock/cart'

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
      //this.cartList = res.data.items
      //以下为mock数据
      this.cartList = cartIndex.data.items
      //将服务列表最里层的数据单独拿出来做一个数组，使得弹窗能够渲染出来
      let items = cartIndex.data.items
      //找出选中商品的选中服务
      let serviceSelect = []
      //存的时候要和商品id相关联
      items.forEach(item => {
        if(item.service_info) {
          item.serviceList = []
          item.service_info.forEach(list => {
            list.service_info.forEach(info => {
              if(!info.sel_status) {
                item.serviceList.push(info)
              } else {
                serviceSelect.push({
                  ...info,
                  parent_goodsId: item.goodsId
                })
              }
            })
          })
        }
      })
      //选中了一个商品的一个服务，从列表取出，放入商品列表中
      serviceSelect.forEach(info => {
        let index = items.findIndex(item => {
          return item.goodsId == info.parent_goodsId
        })
        items.splice(index+1, 0, {
          goodsId: info.service_goods_id,
          image_url: info.service_image_url,
          buy_limit: items[index].num,
          sel_status: 1,
          product_name: info.service_short_name,
          price: info.service_price,
          num: 1,
          //通过表示是否从属于商品来确定是否勾选
          parent_goodsId: info.parent_goodsId,
          isService: true
        })
      })
      //选中商品中的礼品
      let giftSelect = []
      items.forEach(item => {
        if(item.gift && item.sel_status) {
          item.gift.forEach(gift => {
            giftSelect.push({
              ...gift,
              //通过表示是否从属于商品来确定是否勾选
              parent_goodsId: item.goodsId
            })
          })
        }
      })
      //选中的商品加入到商品列表
      giftSelect.forEach(gift => {
        let index = items.findIndex(item => {
          return item.goodsId == gift.parent_goodsId
        })
        items.splice(index+1, 0, {
          goodsId: gift.actId,
          image_url: gift.image_url,
          buy_limit: items[index].num,
          sel_status: 1,
          product_name: gift.product_name,
          num: items[index].num,
          //通过表示是否从属于商品来确定是否勾选
          parent_goodsId: gift.parent_goodsId,
          isGift: true
        })
      })
      this.cartList = items
    },
    cartSelect(item, index) {
      //判断数据是否被选中
      let sel_status = item.sel_status ? 0 : 1
      this.$fetch('cartSelect', {
        goodsId: item.goodsId,
        sel_status
      }).then(res => {
        item.sel_status = sel_status
        //选中状态下是否有赠品或者数组不存在，把赠品转化为商品
        if(item.sel_status) {
          if(item.gift && item.gift.length) {
            item.gift.forEach(gift => {
              this.cartList.splice(index+1, 0, {
                goodsId: gift.actId,
                image_url: gift.image_url,
                buy_limit: item.num,
                sel_status: 1,
                product_name: gift.product_name,
                num: item.num,
                //通过表示是否从属于商品来确定是否勾选
                parent_goodsId: item.goodsId,
                isGift: true
              })
            })
          }
        } else {
          //取消勾选商品时是否有关联的赠品和服务，有则删除
          //先查找赠品服务是否存在，可能存在多个需要去遍历
          let subIndex = this.cartList.findIndex(list => {
            return list.parent_goodsId === item.goodsId
          })
          while(subIndex > -1) {
            this.cartList.splice(subIndex, 1)
            subIndex = this.cartList.findIndex(list => {
              return list.parent_goodsId === item.goodsId
            })
          }
          //把所有的服务选择状态都设置为0,同时添加到可选服务列表(商品下)
          item.service_info.forEach(list => {
            list.service_info.forEach(info => {
              if (info.sel_status) {
                info.sel_status = 0
                item.serviceList.push(info)
              }
            })
          })
        }
      })
    },
    cartEdit(item, num) {
      //达到购买上限和下限进行限制,不能操作
      if(num < 0 && item.num === 1) return
      if(num > 0 && item.num === item.buy_limit) return
      //2增加1减少
      let consumption = num > 0 ? 2 : 1
      this.$fetch('cartEdit', {
        goodsId: item.goodsId,
        consumption
      }).then(res => {
        item.num += num
        //对相关赠品和服务（正常商品）的数量做处理
        this.cartList.forEach(list => {
          if(list.parent_goodsId === item.goodsId) {
            //服务的上限为目前商品的数量
            list.buy_limit = item.num
            if(list.isGift) {
              //赠品的数量随商品购买数量变化，
              list.num = item.num
            }
          }
        })
      })
    }
  }
}

