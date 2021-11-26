import { initState } from "./state"

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = options
    // 第一步新进行data,computed,watch初始化
    initState(vm)
  }
}