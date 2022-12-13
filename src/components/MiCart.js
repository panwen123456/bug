import fetch from '@/api/fetch'
import { cartIndex, cartSelService } from '@/mock/cart'
import MiPop from '../components/MiPop'
import MiRecommend from '@/components/MiRecommend.vue'
import { mapGetters,mapMutations } from 'vuex'

export default {
  components: {
    MiPop,
    MiRecommend
  },
  data() {
    return {
      cartList: null,
      showServiceInfo: false,
      serviceSelectCashItem: null,
      serviceInfoList: null,
      serviceSelectMessage: '请选择服务类型',
      serviceSelectCashArr: [],
      totalNumber: 0,
      totalPrice: 0
    }
  },
  computed: mapGetters(['isLogin']),
  //计算总价监听列表
  watch: {
    //深度监听(Object对象形式)，同时监听价格和数量
    cartList: {
      deep: true,
      handler(val) {
        //添加购物车总数,num为选中商品数量
        let all = 0
        let num = 0
        let price = 0
        val.forEach(list => {
          if (list.sel_status) {
            num += list.num
            if (list.price) {
              price += list.num * list.price
            }
          }
          all += list.num
        })
        this.totalNumber = num
        this.totalPrice = price
        this.setCartCount(all)
      }
    }
  },
  //路由跳转时先获取数据再路由跳转，当前刷新时也进行获取
  beforeRouteEnter(to, from, next) {
    //   if(from.name) {
    //     fetch('cartIndex').then(res => {
    //       next(vm => vm.setCartList(res))
    //     })
    //   } else {
    next(vm => vm.getCartList())
    //   }
  },
  methods: {
    //添加设置购物车商品数量映射
    ...mapMutations({
      setCartCount: 'cart/setCount'
    }),
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
      //this.cartList = cartIndex.data.items
      //将服务列表最里层的数据单独拿出来做一个数组，使得弹窗能够渲染出来
      //每次mock数据时，进行一次深复制，防止数据缓存错误
      let items = JSON.parse(JSON.stringify(cartIndex.data.items))
      //找出选中商品的选中服务
      let serviceSelect = []
      //存的时候要和商品id相关联
      items.forEach(item => {
        if (item.service_info) {
          item.serviceList = []
          item.service_info.forEach(list => {
            list.service_info.forEach(info => {
              if (!info.sel_status) {
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
        items.splice(index + 1, 0, {
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
        if (item.gift && item.sel_status) {
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
        items.splice(index + 1, 0, {
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
        if (item.sel_status) {
          if (item.gift && item.gift.length) {
            item.gift.forEach(gift => {
              this.cartList.splice(index + 1, 0, {
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
          while (subIndex > -1) {
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
      if (num < 0 && item.num === 1) return
      if (num > 0 && item.num === item.buy_limit) return
      //2增加1减少
      let consumption = num > 0 ? 2 : 1
      this.$fetch('cartEdit', {
        goodsId: item.goodsId,
        consumption
      }).then(res => {
        item.num += num
        //对相关赠品和服务（正常商品）的数量做处理
        this.cartList.forEach(list => {
          if (list.parent_goodsId === item.goodsId) {
            //服务的上限为目前商品的数量
            list.buy_limit = item.num
            if (list.isGift) {
              //赠品的数量随商品购买数量变化，
              list.num = item.num
            }
          }
        })
      })
    },
    toCartSelService(item) {
      //服务弹窗
      this.showServiceInfo = true
      //避免v-if与v-show用于同一元素，做数据筛选处理
      //选出没有被选中的列表
      let arr = []
      item.service_info.forEach((list, index) => {
        //设置当前类目下的服务为空数组,如果没有被选中则加入减去
        //深复制防止出现空对象
        let curList = JSON.parse(JSON.stringify(list))
        curList.service_info = []
        list.service_info.forEach(service => {
          if (!service.sel_status) {
            curList.service_info.push(service)
          }
        })
        arr.push(curList)
      })
      this.serviceInfoList = arr
      this.serviceSelectCashItem = item
    },
    selectService(list, service) {
      //原来选中取消选中，原来未选中全部改为选中
      if (service.sel_status) {
        service.sel_status = 0
      } else {
        list.service_info.forEach(service => {
          if (service.sel_status) {
            service.sel_status = 0
          }
        })
        service.sel_status = 1
      }
      let arr = []
      this.serviceInfoList.forEach(list => {
        list.service_info.forEach(service => {
          //将所有的选中项取出
          if (service.sel_status) {
            arr.push(service)
          }
        })
      })
      this.serviceSelectMessage = arr.length ? `已选择${arr.length}项服务` : `请选择服务类型`
      this.serviceSelectCashArr = arr
    },
    serviceSelectSubmit() {
      //先得到服务选择的项
      let cashItem = this.serviceSelectCashItem
      this.$fetch('cartSelService', {
        parent_goodsId: cashItem.parent_goodsId,
        service_goods_id: cashItem.goodsId,
        sel_status: 1
      }).then(res => {
        //从可选择服务列表中删除选中项
        let arr = this.serviceSelectCashArr

        if (arr.length) {
          arr.forEach(list => {
            //遍历可选择列表
            let serviceListIndex = cashItem.serviceList.findIndex(service => {
              return service.service_goods_id === list.service_goods_id
            })
            cashItem.serviceList.splice(serviceListIndex, 1)
            //对原服务列表遍历，改变选择状态
            cashItem.service_info.forEach(info => {
              info.service_info.forEach(service => {
                if (service.service_goods_id === list.service_goods_id) {
                  service.sel_status = 1
                }
              })
            })

            //把选中服务转化为商品
            //找到商品所在的位置
            let index = this.cartList.findIndex(item => {
              return item.goodsId === cashItem.goodsId
            })
            //在商品的位置插入
            this.cartList.splice(index + 1, 0, {
              goodsId: list.service_goods_id,
              image_url: list.service_image_url,
              buy_limit: cashItem.num,
              sel_status: 1,
              product_name: list.service_short_name,
              price: list.service_price,
              num: list.num,
              //通过表示是否从属于商品来确定是否勾选
              parent_goodsId: cashItem.goodsId,
              isService: true
            })
          })
        }
        //弹窗关闭
        this.showServiceInfo = false
      })
    },
    cartDelete(item, index) {
      this.$fetch('cartDelete', {
        goodsId: item.goodsId
      }).then(res => {
        this.cartList.splice(index, 1)
        //服务: 添加到对应商品的可展示服务列表中去
        if (item.parent_goodsId) {
          let curGood = this.cartList.find(list => {
            return list.goodsId === item.parent_goodsId
          })
          curGood.service_info.forEach(info => {
            info.service_info.forEach(service => {
              if (service.service_goods_id === item.goodsId) {
                service.sel_status = 0
                curGood.serviceList.push(service)
              }
            })
          })
        } else {
          //商品： 删除所有下属的服务和赠品
          let subIndex = this.cartList.findIndex(list => {
            return list.parent_goodsId === item.goodsId
          })
          //商品删除完，相应的服务和赠品也删除掉
          while (subIndex > -1) {
            this.cartList.splice(subIndex, 1)
            subIndex = this.cartList.findIndex(list => {
              return list.parent_goodsId === item.goodsId
            })
          }
        }
      })

    }
  }
}

