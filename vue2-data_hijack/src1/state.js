import { Observe } from "./observe/Observer"
import { isFunctions } from "./utils"

export function initState(vm) {
  // 数据格式
  // {
  //   el: '#app',
  //   data() {
  //     return {

  //     }
  //   }
  // }

  // 先获取data
  let data = vm.$options.data || {}
  // 如果data传进来的是function的话,需要将data运行
  data = isFunctions(data) ? data.call(vm) : data
  // 因为这儿是通过方法获取的data,所以和$opertions中的data没有关系,所以需要将data继续挂载在vm上面
  vm._data = data
  // 开始检测data
  Observe(data)
}