import { isObject } from '../utils'

export function Observe(data) {
  // 判断是不是对象 只对对象检测
  if (!isObject(data)) return
  new Observer(data)
}

class Observer {
  constructor(data) {

    if(Array.isArray(data)) {

    }else {
      // 如果是普通对象的话,进行defineProperty
      this.objDefineProperty(data)
    }
  }

  arrayDefineproperty(data) {
    
  }

  objDefineProperty(data) {
    Object.keys(data).map((key) => {
      proxy(data, key, data[key])
    })
  }
}

// 数据劫持
function proxy(data, key, value) {
  Observe(value)
  Object.defineProperty(data, key, {
    get() {
      console.log('获取值了', value)
      return value
    },
    set(mVal) {
      Observe(mVal)
      console.log('设置值了', mVal)
      value = mVal
    },
  })
}
