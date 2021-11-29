### 根据语义定义个同步的Promise
+ Promise拥有三个状态:pending(初始状态,既没有兑付也没有被拒绝),fulfilled(操作成功),rejected(操作失败)
  + Promise作为一个类,通过new初始化的时候，传入一个executor默认执行函数，并且当前Promise的状态为pending
    * executor函数是默认执行，所以这个函数是同步操作
    * executor函数默认传两个参数, resolve和rejected,当我们的操作运行成功的时候，调用resolve,失败的时候调用rejected
  + 当executor执行时,运行到操作成功/失败之后,执行传入的两个函数参数
    * 调用成功/失败对应的函数,可以传入一个参数,参数可以再后续中获取到
    * 当调用成功/失败 函数之后，实例状态会被修改成fulfilled/rejected,并且状态无法再次修改
    * 如果在执行过程中,抛出异常,按照失败来处理
  + 每一个promise实例有一个then方法
> 根据这些定义我们先实现一个简单的例子
```javascript
const STATUS = {
  PENDDING: 'PENDDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}
class Promise{
  constructor(executor){
    this.status = STATUS.PENDDING
    this.value = undefined
    this.reason = undefined
    const resolve = (val) => {
      if(this.status === STATUS.PENDDING) {
        this.status = STATUS.FULFILLED
        this.value = val
      }
    } 
    const reject = (reason) => {
      if(this.status === STATUS.PENDDING) {
        this.status = STATUS.REJECTED
        this.reason = reason
      }
    }
    try {
      executor(resolve,reject)
    } catch (e) {
      // 出错走失败逻辑
      reject(e)
    }
  }

  then(onFulfilled,onRejcted) {
    if(this.status === STATUS.FULFILLED) {
      onFulfilled(this.value)
    }
    if(this.status === STATUS.REJECTED) {
      onRejcted(this.reason)
    }
  }
}
module.exports = Promise
```

### 实现异步
  如果executor方法是异步实现，我们在then中判断STATUS为pending状态的时候，将onFulfilled和onRejected方法保存起来，等到修改状态的时候，将保存起来的方法调用。
  ```javascript
    constructor(executor){
      ...
      // 使用发布订阅模式,
      this.onReolvedCallbacks = [] // 成功态的回调
      this.onRejectedCallbacks = [] // 失败态回调
      const resolve = (val) => {
        if(this.status === STATUS.PENDDING) {
          ...
          // 利用发布订阅的方式,实现我们后续then中的操作
          this.onReolvedCallbacks.forEach(callback => callback())
        }
      } 
      const reject = (reason) => {
        if(this.status === STATUS.PENDDING) {
          ...
          this.onRejectedCallbacks.forEach(callback => callback())
        }
      }
      ...
    }
  ```
  ```javascript
    then(onFulfilled,onRejcted) {
      ...
      if(this.status === STATUS.PENDDING) {
        // 切片编程,如果我们直接将onFulfilled 分布出去,value不知道
        this.onRejectedCallbacks.push(() => {
          onFulfilled(this.value)
        })
        this.onRejectedCallbacks.push(() => {
          onRejcted(this.reason)
        })
      }
    }
  ```