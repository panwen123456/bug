<template>
  <div class="app-shell">
    <div class="app-view-wrapper">
      <div class="app-view">
        <div class="container fluid" v-if="productData">
          <header>
            <div class="fill-height layout align-center">
              <a class="header-btn" @click="goback">
                <i class="iconfont icon-back"></i>
              </a>
              <div class="placeholder"></div>
              <a class="header-btn share-btn">
                <i class="iconfont icon-share"></i>
              </a>
            </div>
          </header>
          <div class="swiper-container gallery-view">
            <div class="swiper-wrapper">
              <div
                v-for="(imgUrl, index) in galleryView"
                :key="index"
                class="swiper-slide"
              >
                <!-- 图片预加载data- -->
                <img class="img swiper-lazy" :data-src="imgUrl" />
                <div class="swiper-lazy-preloader"></div>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
          <div v-if="titleView" class="overview">
            <div class="goods-name ui-flex align-center justify-start">
              {{ titleView.name }}
            </div>
            <div class="goods-brief" v-html="titleView.product_desc"></div>
            <div class="goods-price layout align-end justify-start">
              <div class="price cur-price">{{ selectedGood.price }}</div>
              <div
                class="price origin-price"
                v-show="selectedGood.market_price > selectedGood.price"
              >
                {{ selectedGood.market_price }}
              </div>
            </div>
          </div>
          <div class="product-section more">
            <div
              class="border-top-1px ui-flex align-start justify-start J_linksign-customize"
            >
              <div class="title">促销</div>
              <div class="flex pt1-2x">
                <div
                  class="ui-flex align-center justify-start act-icon mb2x"
                  v-if="canJoinActs"
                >
                  <div class="icon-desc border-1px">
                    {{ canJoinActs.type_desc }}
                  </div>
                  <div class="icon-title">{{ canJoinActs.title }}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="product-section more mt2x padding-16-32"
            @click="(showMask = true), (showSKU = true)"
          >
            <div class="ui-flex align-start justify-start J_linksign-customize">
              <div class="title">已选</div>
              <div class="flex">
                <div class="info">
                  {{ selectedGood.name }} x{{ selectedGood.buyNumber }}
                </div>
              </div>
            </div>
          </div>
          <div class="product-section more padding-16-32" @click="showAddressPop=true">
            <div
              class="border-top-1px ui-flex align-start justify-start J_linksign-customize"
            >
              <div class="title">送至</div>
              <div class="flex">
                <div class="info" v-if="deliveryData">
                  <span class="mr1x">{{deliveryData.address_info.address}}</span>
                  <span class="on">{{deliveryData.datas.length?'有现货':'无现货'}}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="product-section padding-16-32"
            v-if="selectedGood && selectedGood.service_refound_policy_list"
          >
            <div
              class="border-top-1px ui-flex align-center justify-start J_linksign-customize service-policy-list"
            >
              <div
                v-for="(list, index) in selectedGood.service_refound_policy_list
                  .list"
                :key="index"
                class="flex service-policy-item"
              >
                <img :src="list.img_url" class="mr1x img-icon" />
                <span class="fsc1">{{ list.item_name }}</span>
              </div>
            </div>
          </div>
          <div class="comment-view space-top" v-if="commentView">
            <a
              href="/comment/list/2181500027"
              class="comment-info border-bottom-1px box-flex align-center justify-space-between entry-more"
            >
              <div class="comment-count">
                用户评价({{ commentView.detail.comments_total }})
              </div>
              <div class="comment-degree">
                {{ commentView.detail.satisfy_per }}%
                <span>满意</span>
              </div>
            </a>
            <MiComment v-if="commentView" :comment="commentView.list[0]" />
          </div>
          <!-- 顶部tab切换 -->
          <div class="description-view space-top">
            <div class="tab-header">
              <div
                class="tab-header-inner border-bottom-1px box-flex align-center"
              >
                <a
                  v-for="(desc, index) in descTabsView"
                  :key="index"
                  :class="descTabsViewIndex == index ? 'on' : ''"
                  class="flex"
                  @click="descTabsViewIndex = index"
                  >{{ desc.name }}</a
                >
              </div>
            </div>
            <div class="tab-view">
              <div
                v-show="descTabsViewIndex == index"
                v-for="(desc, index) in descTabsView"
                :key="'desc' + index"
                class="tab-item"
              >
                <!-- 概述展示3张图片 -->
                <section
                  v-for="(showDesc, index) in desc.showTabContent"
                  :key="'showDesc' + index"
                >
                  <div class="desc-img-box">
                    <img :src="showDesc.plainView.img" />
                  </div>
                </section>
                <!-- 参数展示3张以上图片 -->
                <section
                  v-show="desc.showMore"
                  v-for="(moreDesc, index) in desc.moreTabContent"
                  :key="'moreDesc' + index"
                >
                  <div class="desc-img-box">
                    <img :src="moreDesc.plainView.img" />
                  </div>
                </section>
                <a
                  v-show="!desc.showMore"
                  @click.stop="desc.showMore = true"
                  class="show-all-desc"
                  >查看全部图文详情 &gt;</a
                >
              </div>
            </div>
          </div>
          <MiRecommend :id="id" />
        </div>
        <div class="ui-mask" v-show="showMask"></div>
        <!-- 父组件监听close事件执行SKU -->
        <MiSKU
          :showSKU="showSKU"
          :productData="productData"
          @close="closeSKU"
          @selectSKU="selectSKU"
        />
        <footer>
          <div class="fill-height layout align-center">
            <router-link :to="{ name: 'home' }" class="footer-btn">
              <i class="iconfont icon-home"></i>
              <span>首页</span>
            </router-link>
            <router-link :to="{ name: 'cart' }" class="footer-btn">
              <i class="iconfont icon-cart"></i>
              <span>购物车</span>
              <em v-if="count" class="bubble">{{count}}</em>
            </router-link>
            <div
              class="action-box flex"
              @click="(showMask = true), (showSKU = true)"
            >
              <a class="btn buy-btn">加入购物车</a>
            </div>
          </div>
        </footer>
        <div class="ui-mask" v-show="showMask"></div>
        <MiSKU
          :showSKU="showSKU"
          :productData="productData"
          @close="closeSKU"
          @selectSKU="selectSKU"
        />
        <MiPop v-model="showAddressPop">
          <div class="h1">
            <p>收货地址</p>
          </div>
          <div class="max5">
            <div 
              v-for="item in addressList"
              :key="item.address_id"
              @click="selectAddress(item)"
              class="border-bottom-1px address-item">
              <div class="address-item-line1 layout align-center justify-start">
                <i class="iconfont icon-locationfill"></i>
                <div class="address-item-name">{{item.consignee}}</div>
                <div class="address-item-province">{{item.city}}</div>
              </div>
              <div class="address-item-line2">{{item.address}}</div>
            </div>
          </div>
          <div class="btn-bottom">
            <div class="action-box flex">
              <a
                @click="showAddressPop=false,showRegions=true"
                class="btn buy-btn"
                >选择新地址</a
              >
            </div>
          </div>
        </MiPop>
        <MiAddressAll v-model="showRegions" @click="changeRegion" />
      </div>
    </div>
  </div>
</template>

<script src="./MeDetail.js"></script>

<style scoped src="./MeDetail.css"></style>

<style>
/* 轮播图下方焦点的白色样式 */
.swiper-container-horizontal
  > .swiper-pagination-bullets
  .swiper-pagination-bullet {
  margin: 0 5px;
}
.swiper-pagination-bullet-active {
  background: #fff;
}
</style>
