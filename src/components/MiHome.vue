<template>
  <div class="app-shell">
    <div class="app-view-wrapper">
      <div class="app-view app-view-with-footer">
        <header class="header">
          <div class="app-header-wrapper">
            <div class="app-header-left">
              <div class="app-header-item logo">
                <img src="../assets/imgs/searchlogo.png" alt="" />
              </div>
            </div>
            <div class="app-header-middle">
              <div class="app-header-title">
                <i class="iconfont icon-search"></i>&nbsp;&nbsp; 搜索商品名称
              </div>
            </div>
            <div class="app-header-right">
              <div class="app-header-item">
                <i class="iconfont icon-people" @click="toUser"></i>
              </div>
            </div>
          </div>
          <div class="nav swiper-container">
            <div v-if="navList && navList.length" class="swiper-wrapper">
              <div
                v-for="(nav, index) in navList"
                :key="nav.page_id"
                class="nav-item swiper-slide"
                :class="{ nav_active: curIndex == index }"
                @click="changeIndex(index)"
              >
                <span>{{ nav.name }}</span>
              </div>
            </div>
          </div>
        </header>
        <transition-group class="page-wrap" tag="div" :name="transitionName">
          <div
            v-for="(nav, index) in navList"
            :key="nav.page_id"
            v-show="index == curIndex"
            class="bodys"
          >
            {{ nav.name }}
          </div>
        </transition-group>
      </div>
    </div>
    <TheFooter />
  </div>
</template>
<script>
import Swiper from "swiper";
import fetch from '../api/fetch'

export default {
  data() {
    return {
      navList: null,
      slidesPerView: 6,
      curIndex: 0,
      homeSwiper: null,
      transitionName: "",
    };
  },
  //深度监听navList的数据是否发生变化
  watch: {
    navList: {
      deep: true,
      handler(val, oldval) {
        // console.log(val)
      },
    },
  },
  //异步数据获取并赋值给data
  created() {
    // console.log(document.querySelectorAll('.nav-item'))
    this.getNavList();
  },
  destroyed() {
    //判断Swiper实例是否是数组再销毁
    if(Array.isArray(this.homeSwiper)) {
      this.homeSwiper.forEach(item => {
        item.destroy()
      })
    } else {
      this.homeSwiper.destroy();
    }
    this.$NProgress.remove();
  },
  methods: {
    //顶部导航栏
    getNavList() {
      this.$fetch("navList").then((res) => {
        this.setNavList(res)
      });
    },
    setNavList(res) {
      //设置初始值初始化
      let list = res.data.list;
      list.forEach((item) => {
        item.hasData = false;
      });
      this.navList = list;
      //获取进度条
      this.getHomePage('init');
      //动态数据赋值后，dom可操作
      this.$nextTick(() => {
        this.homeSwiper = new Swiper(".swiper-container", {
          slidesPerView: this.slidesPerView,
          freeMode: true,
        });
      });
    },
    changeIndex(index) {
      document.querySelector(".page-wrap").scrollTo(0, 0);
      this.transitionName = index > this.curIndex ? "page-left" : "page-right";
      this.curIndex = index;
      let toIndex = 0;
      if (index > this.slidesPerView / 2) {
        toIndex = index - this.slidesPerView / 2;
      }
      this.homeSwiper.slideTo(toIndex, 1000, false);
      //切换导航栏时，显示进度条,获取数据为true时调用
      !this.navList[this.curIndex].hasData && this.getHomePage();
    },
    //进度条
    getHomePage(flag) {
      this.$NProgress.start();
      this.$fetch("homePage", {
        page_id: this.navList[this.curIndex].page_id,
      }).then((res) => {
        //设置点击获取数据的标识
        this.navList[this.curIndex].hasData = true;
        //数据获取完毕停止进度条
        this.$NProgress.done();
        //数据获取完毕停止加载
        this.$store.commit('setViewLoading', false)
      });
    },
    //添加首页填转到用户界面的路由
    toUser() {
      console.log(111);
      this.$router.push("user");
    },
  },
};
</script>
<style scoped>
.app-view {
  position: absolute;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* height: 100%; */
  overflow-x: hidden;
  overflow-y: auto;
  will-change: transform;
  background: #fff;
  color: #3c3c3c;
  padding-bottom: 52px;
}
.header {
  position: fixed;
  top: -1px;
  left: 0;
  right: 0;
  z-index: 99;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  background: #f2f2f2;
}
.app-header-wrapper > div,
.app-header-wrapper {
  display: flex;
  align-items: center;
}
.app-header-wrapper {
  justify-content: space-between;
  height: 50px;
  background: #f2f2f2;
  color: #666;
  padding: 0;
}
.app-header-item {
  display: block;
  width: 32px;
  margin: 0 10px;
}
.app-header-item img {
  width: 80%;
}
.app-header-middle {
  flex: 1;
}
.app-header-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #e5e5e5;
  text-align: left;
  width: 100%;
  color: rgba(0, 0, 0, 0.3);
  background-color: #fff;
  border-radius: 4px;
  height: 32px;
  padding-left: 12px;
}
.icon-people {
  font-size: 24px;
}
.nav {
  /* overflow-x: auto; */
  background: #f2f2f2;
  font-size: 14px;
  white-space: nowrap;
  z-index: 2;
}
/* .swiper-wrapper {
 width: 600px;
} */
.nav .nav-item {
  display: inline-block;
  padding: 0 14px;
  width: auto !important;
}
.nav .nav-item span {
  display: inline-block;
  line-height: 32px;
  border-bottom: 2px solid rgba(237, 91, 0, 0);
  color: rgb(116, 116, 116);
  border-color: rgb(242, 242, 242);
}
.nav-item.nav_active span {
  color: rgb(237, 91, 0);
  border-color: rgb(237, 91, 0);
}
.page-wrap {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.bodys {
  position: absolute;
  top: 82px;
  left: 0;
  right: 0;
  background: rgba(237, 91, 0, 0.1);
  height: 800px;
  line-height: 800px;
  font-size: 72px;
}
</style>

