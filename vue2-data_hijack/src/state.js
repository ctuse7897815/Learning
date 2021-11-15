import { observe } from './observer'
import { isFuntions } from './utils'

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function proxy(vm,source,key) {
  Object.defineProperty(vm,key,{
    get() {
      return vm[source][key]
    },
    set(newValue){
      vm[source][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data || {} // vm.$el vue内部会对属性检测如果是以$开头 不会代理
  // data 可能是函数或者对象
  // _data 为什么要挂载
  data = vm._data = isFuntions(data) ? data.call(vm) : data

  // 为了方便获取 不用从_data中获取 做一次代理 vm.xxx => vm._data.xxx
  for(let key in data) {
    proxy(vm, '_data', key)
  }

  observe(data)
}
