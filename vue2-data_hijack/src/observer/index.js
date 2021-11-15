import { isObject } from '../utils'
import { arrayMethods } from './array'

// 不需要原型处理
class Observer {
  constructor(data) {
    console.log('data', data)
    // 将实例放到了所有的劫持得数据上,所有的劫持的数据上面都有__ob__
    Object.defineProperty(data,'__ob__', {
      value: this,
      enumerable: false //不可枚举
    })
    if(Array.isArray(data)){
      // 数组劫持逻辑
      // 对数组原来的方法进行改写,切片编程,高阶函数
      data.__proto__ = arrayMethods
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  observeArray(data) {
    // 对数组得数组和数组中的对象再次劫持 递归
    data.forEach(item => {
      observe(item)
    })
  }
  // 对数据一个一个循环
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}

// vue2会对对象进行遍历 将每一个属性  用defineProperty重新定义  性能差
function defineReactive(data, key, value) {
  observe(value) // 本身用户默认是对象套对象,需要递归处理(性能差)
  Object.defineProperty(data, key, {
    set(newV) {
      observe(newV) //数据有变化了 继续观测
      value = newV
    },
    get() {
      return value
    },
  })
}

export function observe(data) {
  // 判断是否是对象
  if (!isObject(data)) return
  // 在Observer的constructor中设置了this, 如果已经有了值就不需要继续观测
  if(data.__ob__) return
  return new Observer(data)
}
