<template>
  <div class="app-shell">
    <MiTitle title="分类"/>
    <div class="app-view-wrapper">
      <div class="container app-view app-view-with-header app-view-with-footer">
        <div class="list-navbar">
          <ul>
            <li
              v-for="(list, index) in categoryList"
              :key="index"
              @click="changeIndex(index)"
              :class="index == curIndex ? 'active' : ''"
            >
              <a>
                <span>{{ list.category_name }}</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="list-wrap" @touchstart="wrapScroll">
          <!-- 添加页面跳转锚点 -->
          <div
            v-for="(list, index) in categoryList"
            :key="list.category_id"
            :class="'category' + index"
            :ref="'category' + index"
            class="list-item"
          >
            <div class="component-list-main">
              <div class="cells_auto_fill">
                <a class="exposure items">
                  <img v-lazy="list.category_img" />
                </a>
              </div>
              <template v-for="(item, index) in list.category_list">
                <div :key="'title' + index" class="category_title">
                  <span>{{ item.category_title }}</span>
                </div>
                <CategoryGroup
                  :key="'group' + index"
                  :products="item.category_group"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<script>
import fetch from "@/api/fetch.js";
import CategoryGroup from './CategoryGroup.vue'
export default {
  components: {
    CategoryGroup,
  },
  data() {
    return {
      categoryList: null,
      curIndex: 0,
      offsetTop: [],
      scrollTimer: null,
    };
  },
  //导航完成后获取数据
  beforeRouteEnter(to, from, next) {
    //判断是路由切换(含name)还是刷新
    if (from.name) {
      //路由切换之前先获取数据
      fetch("category").then((res) => {
        next((vm) => vm.setLists(res))
      });
    } else {
      next((vm) => vm.getLists());
    }
  },
  // created() {
  //   this.getLists()
  // },
  destroyed () {
    this.$NProgress.remove()
  },
  methods: {
    getLists() {
      this.$fetch("category").then((res) => {
        this.setLists(res)
      });
    },
    setLists(res) {
      this.$NProgress.done()
      //数据获取完毕后，停止加载
      this.$store.commit('setViewLoading', false)
      this.categoryList = res.data.lists;
      //接收每一块标题到顶部的距离,获取到dom结构渲染完毕
      this.$nextTick(() => {
        this.categoryList.forEach((item, index) => {
          console.log(this.$refs["category" + index]);
          this.offsetTop.push(this.$refs["category" + index][0].offsetTop);
        });
        this.wrapScroll();
      });
    },
    changeIndex(index) {
      this.curIndex = index;
      //滚动之前，左侧滚动时清除右侧滚动的监听
      document
        .querySelector(".list-wrap")
        .removeEventListener("scroll", this.scrollHandler);
      //根据不同的值滚动到对应的位置
      document.querySelector(".list-wrap").scrollTo(0, this.offsetTop[index]);
    },
    //监听页面滚动事件,清除滚动到多余距离，同时滚动时，左侧标题栏滚动
    wrapScroll(e) {
      document.querySelector(".list-wrap").addEventListener("scroll", this.scrollHandler);
    },
    scrollHandler() {
      console.log("scroll");
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
      this.scrollTimer = setTimeout(() => {
        let scrollTop = document.querySelector(".list-wrap").scrollTop;
        let len = this.offsetTop.length;
        for (let index = 0; index < len; index++) {
          if (
            scrollTop >= this.offsetTop[index] &&
            scrollTop < this.offsetTop[index + 1]
          ) {
            this.curIndex = index;
            break;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.container {
  margin-right: auto;
  margin-left: auto;
  flex-basis: 100%;
}
.container .list-navbar {
  position: fixed;
  top: 49px;
  bottom: 140px;
  left: 0;
  width: 80px;
  border-right: 1px solid #efefef;
  overflow: hidden;
}
.container .list-navbar ul {
  z-index: 90;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  /* 隐藏滚动条 */
  right: -6px;
  padding: 8px 6px 8px 0;
  background: #fefefe;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.container .list-navbar ul li.active {
  color: #fb7d34;
  transform: scale(1);
}
.container .list-navbar ul li {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  text-align: center;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transition: transform 0.1s linear;
  transform-origin: center center;
  transform: scale(0.76);
}
.container .list-navbar ul li span {
  display: inline-block;
}
.container .list-wrap {
  position: absolute;
  left: 80px;
  right: 0;
  top: 49px;
  bottom: 160px;
  padding: 2px 16px;
  overflow: auto;
}
.component-list-main .cells_auto_fill .items {
  height: auto !important;
  display: block;
}
.cells_auto_fill .items img {
  width: 260px;
  height: 104px;
}
.component-list-main .category_title {
  background: #fff;
  font-size: 16px;
  text-align: center;
  font-weight: 400;
  margin-top: 10px;
  height: 66px;
  line-height: 66px;
  overflow: hidden;
}
.component-list-main .category_title span {
  position: relative;
}
.component-list-main .category_title span:after,
.component-list-main .category_title span:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 30px;
  border-top: 1px solid #e0e0e0;
  transform: translate3d(-150%, -50%, 0);
}
.component-list-main .category_title span:after {
  left: auto;
  right: 0;
  transform: translate3d(150%, -50%, 0);
}
.component-list-main .category_group .box {
  width: 100%;
  overflow: hidden;
}
.box-flex > *,
.box-inline-flex > * {
  flex: 1 1 auto;
}

.component-list-main .img {
  display: block;
  position: relative;
  overflow: hidden;
}
.loading_img {
  width: 100%;
}
</style>
