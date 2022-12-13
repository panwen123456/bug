<template>
  <div class="insurance-pop">
    <!-- 有阴影同时弹出可见时展示 -->
    <div 
      v-show="value&&overlay" 
      :class="overlayClass" 
      :style="overlayStyle"
      @click="clickOverlay"></div>
    <transition :name="transition">
      <div v-show="value" class="pop">
        <div class="close" @click="close">
          <i class="image-icons iconfont icon-close"></i>
        </div>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    //使用v-model需要传递value值
    value: {
      type: Boolean,
      default: false,
      required: true
    },
    //是否需要阴影,参考有赞的遮罩层样式参数，绑定属性使用
    overlay: {
      type: Boolean,
      default: true
    },
    overlayClass: {
      type: String,
      default: 'ui-mask'
    },
    //遮罩层
    overlayStyle: {
      type: Object
    },
    //选中时是否可以关闭
    closeOnClickOverlay: {
      type: Boolean,
      default: false
    },
    //过渡效果
    transition: {
      type: String,
      default: 'bottom-up'
    }
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    clickOverlay() {
      //点击蒙层值为false不反应
      if(!this.closeOnClickOverlay) return
      //关闭蒙层
      this.close()
    }
  }
}
</script>

<style scoped>
/* 底部弹出的过渡动画 */
.bottom-up-enter-active, .bottom-up-leave-active {
  transition: all .5s;
}
.bottom-up-enter {
  transform: translateY(100%);
}
.bottom-up-enter-to, .bottom-up-leave {
  transform: translateX(0);
}
.bottom-up-leave-to {
  transform: translateY(100%);
}
</style>