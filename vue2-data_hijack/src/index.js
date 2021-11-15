import { initMixin } from "./init"

function Vue(options) {
  // options 为用户传入得选项
  this._init(options)
}
// 方法下划线  业界规范: 不希望外界调用
// 扩展原型
initMixin(Vue)
export default Vue