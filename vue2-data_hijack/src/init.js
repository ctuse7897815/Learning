import { initState } from "./state"

export function initMixin(Vue) { 
  // 表示在vue的基础上做一次混合操作
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = options // 后面会对options扩展
    // 对数据进行初始化 watch computed pros data...
    initState(vm) //vm.$options.data
  }
}