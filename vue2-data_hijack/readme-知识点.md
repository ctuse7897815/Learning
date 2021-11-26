* rollup
* 
* 数据检测
* Object.defineProperty
  * 递归性能差 数据扁平化



## Object.defineProperty
会直接在一个对象上面定一个新属性,或者修改一个对象得现有属性，并返回此对象
Object.defineProperty(obj,prop,descriptor)
obj: 要定义属性的方法
prop: 要定义或者修改属性的名称或Symbol
descriptor: 要定义或修改属性描述符
返回obj

