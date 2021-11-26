## Object.defineProperty(obj,prop,descriptor)
obj: 要定义的对象
prop: 要定义或修改的属性名称或Symbol
descriptor: 需要定义的属性描述符

## 属性描述符
  + 共享可选键
    + configurable 控制属性是否能够修改
      + true:  属性可以被修改和删除
      + false: 属性不可以被修改和删除
    + enumerable
      + true:  此属性才能出现在枚举属性中(可以被for...in和Object.keys遍历枚举)
      + false: 此属性不能被枚举 (可以用作定义在对象中，但是又不想在业务中没枚举遍历使用)
  + 数据属性描述符
    + value: 该属性的值
    + writable: 该属性值是否允许修改
  + 存取属性描述符
    + get: getter函数, 当访问该对象的属性得时候,会调用该方法,并且将返回值作为属性得值
    + set: setter函数, 当对对象得属性设置值得时候,会调用该方法,设置的值作为参数传入,返回值设置成该属性值

```javascript
  const mData = {a:1,b:2}
  Object.defineProperty(mData,'a', {
    enumerable: true,
    get() {
      return 1
    },
    set(m) {
      return m+1
    }
  })
```
