let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(Array.prototype)
// arrayMethods._proto__ = Array.protorype 原型链继承
let methods = ['push', 'pop', 'unshift', 'shift', 'reverse', 'sort', 'splice']

methods.forEach((method) => {
  // 用户调用的如果是以上七个方法 会用我自己重写的,否则用原来的数组方法
  arrayMethods[method] = function (...args) {
    // 在Observer constructor中将this赋值给了__ob__ 在这儿 __ob__就是Observer实例,可以调用到原型得方法
    const _ob = this.__ob__
    // args 是参数列表
    oldArrayPrototype[method].call(this, ...args)
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':

        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    // 如果有新增,继续劫持
    if(inserted) {
      _ob.observeArray(inserted)
    }
  }
})
