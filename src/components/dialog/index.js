import Vue from 'vue'
import MiDialog from './MiDialog'

//作为函数调用: 1.创建实例 2.挂载 3.v-model 4.props参数 5.事件监听: promise+callback
let instance

//创建实例
const initInstance = () => {
  instance = new (Vue.extend(MiDialog))({
    el: document.createElement('div')
  })
  //v-model
  instance.$on('input', value => {
    instance.value = value
  })

  //挂载
  document.body.appendChild(instance.$el)
}

//事件监听创建promise
const Dialog = options => {
  return new Promise((resolve, reject) => {
    //若实例不存在初始化
    if(!instance) {
      initInstance()
    }
    //将Promise返回的结果合并传递给instance
    Object.assign(instance, {
      resolve,
      reject,
      ...options
    })
  })
}

//设置props参数
Dialog.defaultOptions = {
  value: false,
  title: '',
  message: '',
  showConfirmButton: true,
  showCancelButton: false,
  //事件监听执行callback
  callback: action => {
    instance[action === 'confirm' ? 'resolve' : 'reject'](action)
  }
}
//确定取消弹窗
Dialog.confirm = options => Dialog({
  ...Dialog.defaultOptions,
  showCancelButton: true,
  value: true,
  ...options
})
//显示弹窗
Dialog.alert = options => Dialog({
  ...Dialog.defaultOptions,
  value: true,
  ...options
})

//作为组件插件使用
// const Dialog = {}

Dialog.install = () => {
  Vue.component('MiDialog', MiDialog)
}

export default Dialog