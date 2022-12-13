<template>
  <div id="app">
    <!-- <nav>
           <router-link to="/">Home</router-link> |
           <router-link to="/about">About</router-link>
        </nav> -->
    <!-- 添加过渡钩子 -->
    <!-- 加载状态时获取全局加载状态，加载完成时停止 -->
    <MiSkeleton v-show="viewLoading" />
    <transition v-show="!viewLoading" 
      :name="transitionName" 
      @after-leave="afterLeave">
      <router-view />
    </transition>
  </div>
</template>
<script>
import MiSkeleton from './components/MiSkeleton.vue'
import {mapState, mapMutations, mapActions} from 'vuex'
//公共组件需要放置在App.vue中
export default {
  components: {
    MiSkeleton
  },
  //映射属性
  computed: 
    mapState([
      'viewLoading',
      'transitionName'
    ])
  ,
  //监听路由源，实现路由对象的跳转(未实现滑动效果 )
  watch: {
    //从一个路由到另一个路由需要过渡，页面刷新不需要过渡
    '$route'(to, from) {
      //页面刷新不需要过渡,from不存在时不过渡
      if(!from.name) {
        this.setTransitionName('')
        return
      }
      //两边路由都有跳转的时候作切换
      if(to.meta.index && from.meta.index) {
        let transitionName = to.meta.index < from.meta.index ? 'page-right' : 'page-left'
        this.setTransitionName(transitionName)
      }
    }
  },
  created() {
    this.getUserInfo()
    this.getCount()
  },
  methods: {
    //映射方法
    ...mapMutations(['setTransitionName']),
    ...mapActions({
      getUserInfo: 'getUserInfo',
      getCount: 'cart/getCount'
    }),
    //添加过渡钩子,向左切换
    afterLeave() {
      this.setTransitionName('page-left')
    }
  }
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  //  color: #2c3e50;
}

/* 通用样式 */
.app-shell {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.app-view-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  max-width: 375px;
  margin: 0 auto;
}

.app-view {
  position: absolute;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
  color: #3c3c3c;
}

.app-view-with-footer {
  padding-bottom: 52px;
}

.app-view-with-header {
  padding-top: 50px;
}

.align-center {
  align-items: center;
}
.ui-flex {
  display: flex;
}
.exposure {
  display: block;
}
.flex {
  flex: 1 1 auto;
}
.box-flex {
  display: flex;
}
.layout {
  display: flex;
}
.layout.wrap {
  flex-wrap: wrap;
}
.layout.row {
  flex-direction: row;
}
.justify-space-between {
  justify-content: space-between;
}
.align-content-start {
  align-content: flex-start;
}
/* 头部通用样式 */
.app-header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background: #f2f2f2;
  color: #666;
  padding: 0;
}
.app-header-wrapper>div {
  display: flex;
  align-items: center;
}
.app-header-item {
  display: block;
  width: 32px;
  margin: 0 10px;
}
.app-header-middle {
  flex: 1;
}

.page-left-enter-active,
.page-left-leave-active {
  transition: all .5s;
}

.page-left-enter {
  transform: translateX(100%);
}

.page-left-enter-to,
.page-left-leave {
  transform: translateX(0);
}

.page-left-leave-to {
  transform: translateX(-100%);
}

.page-right-enter-active,
.page-right-leave-active {
  transition: all .5s;
}

.page-right-enter {
  transform: translateX(-100%);
}

.page-right-enter-to,
.page-right-leave {
  transform: translateX(0);
}

.page-right-leave-to {
  transform: translateX(100%);
}
</style>