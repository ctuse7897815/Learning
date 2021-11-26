import { initMixin } from "./init"

function Vue(options) {
  // 将options放到$options上面 
  this._init(options)
}
initMixin(Vue)
export default Vue