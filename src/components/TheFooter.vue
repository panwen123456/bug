<template>
  <footer class="app-bottom-navigator-wrapper app-shell-footer" v-if="footerVisible">
    <div class="fill-height box-flex align-center">
      <!-- 使列表页能够返回到分类页 -->
      <router-link v-for="nav in navigation" :key="nav.icon" class="flex" active-class="on"
        :to="{name: nav.link}
        ">
        <!-- 索引与当前页面相等则获取到聚集状态，否则则是普通状态 -->
        <i class="iconfont" :class="nav.link == $route.name ? nav.iconon : nav.icon"></i>
        <span>{{ nav.name }}</span>
        <!-- 购物车为0时不显示 -->
        <em v-if="nav.link=='cart'&&count" class="bubble">{{count}}</em>
      </router-link>
    </div>
  </footer>
</template>

<script>
import {mapState} from 'vuex'
import bus from '../bus'
//将页面结构抽象成一个静态数据
const navigation = [
  {
    name: '首页',
    icon: 'icon-home',
    iconon: 'icon-homefill',
    link: 'home'
  },
  {
    name: '分类',
    icon: 'icon-goods',
    iconon: 'icon-goodsfill',
    link: 'category'
  },
  {
    name: '购物车',
    icon: 'icon-cart',
    iconon: 'icon-cartfill',
    link: 'cart'
  },
  {
    name: '我的',
    icon: 'icon-people',
    iconon: 'icon-peoplefill',
    link: 'user'
  }
]

export default {
  data() {
    return {
      navigation,
      curIndex: 0,
      footerVisible: true
    }
  },
  computed: mapState({
    count: state => state.cart.count
  }),
  created() {
    bus.$on('footerVisible', (val) => {
      this.footerVisible = val
    })
  }
}
</script>

<style scoped lang="stylus">
.app-shell-footer {
  position: fixed;
  z-index: 9999;
  bottom: 0;
  left: 0;
  right: 0;
}

.app-bottom-navigator-wrapper {
  height: 52px;
  background: #fff;
  box-shadow: 0 3px 14px 2px rgba(0, 0, 0, .12);
}

.fill-height {
  height: 100%;
}

.align-center {
  align-items: center;
}

.box-flex {
  display: flex;
}

.flex {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #999;
}

.iconfont {
  font-size: 24px;
}

.flex span {
  font-size: 12px;
}

.on {
  color: #ff6700;
}

.bubble {
  position: absolute;
  min-width: 14px;
  line-height: 14px;
  height: 14px;
  box-sizing: border-box;
  padding: 0 3px;
  font-size: 10px;
  overflow: hidden;
  text-align: center;
  border-radius: 10px;
  background: #ed4d41;
  color: #fff;
  top: 0;
  /* left: 50%; */
  transform: translate3d(40px,2px,0);
  font-style: normal;
}
</style>

