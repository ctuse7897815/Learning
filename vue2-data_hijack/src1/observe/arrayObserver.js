// 先通过原型链继承Array Object.create 创建一个对象将对象得原型链指向 Array的原型,实现继承
export const arrayMethods = Object.create(Array.prototype)
const methods = ['push', 'unshift', 'pop', 'shift', 'splice', 'reverse', 'sort' ]

methods.forEach(method => {
  arrayMethods['method'] = function(...args) {
    
  }
})