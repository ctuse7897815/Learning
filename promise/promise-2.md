## 根据Promise协议手写符合规范的Promise
### 根据语义定义个同步的 Promise 框架

- Promise 是一个类,拥有三种状态(pending,fulfilled,rejected)
- Promise 构造函数初始化的时候,需要传入一个默认会执行的函数 executor,需要我们传入两个函数参数 resolve/reject
- Promise 默认状态为 Pending 等待态
- 当客户调用 executor 参数 resolve/reject 时候会修改当前状态，并且记录成功值(value)/拒绝原因(reason)
- 只能修改 pending 状态到 fulfilled/rejected,如果是 fulfilled/rejected 态下无法修改当前状态
- 每一个 Priomise 都必须提供一个 then 方法,默认传入两个回调方法,程序控制,当 fulfilled 态的时候默认调用 onFulfilled,当 rejected 态的时候,调用 onRejected 方法

```javascript
// promise 拥有三种状态 等待态,成功态,拒绝态
const STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
}
class Promise {
  constructor(executor) {
    // promise默认状态是Pending
    this.status = STATUS.PENDING
    this.value = undefined // 存储成功值,方便后面链式调用
    this.reason = undefined // 存储失败的原因,方便后面链式调用
    // 用户在执行函数到正确完成得时候,会调用resolve函数来修改当前实例的状态,resolve函数支持传入一个参数,作为成功的值
    const resolve = (value) => {
      // 只有在等待态下才能修改promise状态
      if (this.status === STATUS.PENDING) {
        // 修改实例的状态,为成功态
        this.status = STATUS.FULFILLED
        // 接受用户传来的成功值
        this.value = value
      }
    }
    // 用户在执行函数得到错误的内容或者抛出异常的时候,会调用reject函数来修改当前实例的状态,reject函数支持传入一个参数,作为失败/拒绝的原因
    const reject = (reason) => {
      // 只有等待态下才能修改promise
      if (this.status === STATUS.PENDING) {
        // 修改实例的状态为失败态
        this.status = STATUS.REJECTED
        // 接受用户传来的失败原因
        this.reason = reason
      }
    }
    try {
      // new Promise() 会传入一个默认执行的函数，并且函数接受两个可执行的方法参数
      executor(resolve, reject)
    } catch (error) {
      // 如果默认执行的函数执行报错,则直接将状态设置为拒绝
      reject(error)
    }
  }

  /**
   * 1. 每一个Priomise都必须提供一个then方法,默认传入两个回调方法,程序控制,当fulfilled态的时候默认调用onFulfilled,当rejected态的时候,调用onRejected方法
   *    @param {*} onFulfilled 成功执行函数
   *    @param {*} onRejected  失败执行函数
   */
  then(onFulfilled, onRejected) {
    if (this.status === STATUS.FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === STATUS.FULFILLED) {
      onRejected(this.reason)
    }
  }
}
module.exports = Promise
```

> 我们实现了一个 Promise 基础架子,但是作为一个主要是处理异步操作的而存在的类,这个时候如果我们加入异步,并不能实现功能。那下面我们将异步功能加入

### 实现异步

如果 executor 方法是异步实现，我们在 then 中判断 STATUS 为 pending 状态的时候，将 onFulfilled 和 onRejected 方法保存起来，等到修改状态的时候，将保存起来的方法调用。

```javascript
  constructor(executor){
    // ...
    // 如果在状态未变情况下,调用then的时候,我们需要将then中成功/失败方法存储,等到状态变化方法主动调用
    this.onFulfilledCallbacks = [] // then的成功方法集
    this.onRejectedCallbacks = [] // then的失败方法集
    const resolve = (val) => {
      if(this.status === STATUS.PENDDING) {
        // ...
        // 状态变化之后,发起then的成功方法集调用,实现异步操作
        this.onFulfilledCallbacks.forEach((fn) => fn())
      }
    }
    const reject = (reason) => {
      if(this.status === STATUS.PENDDING) {
        ...
        // 状态变化之后,发起then的失败方法集调用,实现异步操作
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }
    // ...
  }
  then(onFulfilled,onReject) {
    // ...
    // 当promise的状态为PENDING,这个时候属于异步操作
    // 通过发布订阅模式,将resolve和reject方法发布,等到后续状态变化完成之后,发起调用
    if (this.status === STATUS.PENDING) {
      // 使用装饰器模式/切片编程将成功/失败方法包装,方便我们做其他操作,以及获取状态变化后得 value/reason
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
  // ...
```

> 到了这一步,我们基本实现了简单地一个 Promise 单 then 的方法调用。
> 但是 Promise 的最主要提高满意度的 then 链式调用还不能使用,下面我们来加入链式调用

### then 的链式调用

1. 每一个 Promise 的原型上面都有一个 then 方法,并且 then 方法会提供两个可执行方法参数
2. then 方法必须返回一个 promise,我们通过 new 一个新的 Promise 达到效果
3. then 在链式调用的时候,后续 then 的调用规则
   - 如果在调用当前成功/失败的方法时,如果抛出异常,会走入下一次 then 的失败方法中
   - 获取到成功/失败的返回值 x
   - 如果 x 是基础数据类型,会走入下一次 then 的成功方法中(无论成功还是失败都会调用 then 的成功方法)
   - 如果 x 是对象
     - x 是普通对象,直接走入下一个 then 的成功方法中
     - x 是 Promise,获取到 x 的 then,继续调用 then,知道成功获取到普通对象或者基础数据类型
       - 在 promise2 的 then 的成功和失败方法调用 promise 对应的 resolve/reject 的方法
       - 下一次的 then 的成功还是失败是由 x 的成功还是失败决定
4. then 的后续链式调用,只有在本次抛出异常,或回调方法返回的 Promise 失败的时候才会走入下一次的失败中,否则都是走下次 resolve 方法

```javascript
then(onFulfilled, onRejected) {
    // 创建一个新的promise2,并且在方法最后返回,是then达到链式调用,继续then其实是调用新new出来的promise实例
    const promise2 = new Promise((resolve, reject) => {
      // 当我们调用then方法的时候,通过判断当前Promise状态，调用不同的传参方法
      // 当promise的状态为Fulfilled的时候,调用onFulfilled方法,并且将成功值作为参数传入
      if (this.status === STATUS.FULFILLED) {
        // 此处需要处理下promise2和x的情况,但是promise2是在new之后赋值的,所以需要使用一个异步宏/微来达到能取到promise
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            // 我们使用一个外部方法来统一处理此处
            resolvePromise(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      // 当promise的状态为REJECTED的时候,调用onRejected方法,并且将失败原因作为参数传入
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            // 我们使用一个外部方法来统一处理此处
            resolvePromise(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      // 当promise的状态为PENDING,这个时候属于异步操作
      // 通过发布订阅模式,将resolve和reject方法发布,等到后续状态变化完成之后,发起调用
      if (this.status === STATUS.PENDING) {
        // 使用装饰器模式/切片编程将成功/失败方法包装,方便我们做其他操作,以及获取状态变化后得 value/reason
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              // 我们使用一个外部方法来统一处理此处
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              // 我们使用一个外部方法来统一处理此处
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
}
```

> 在各种状态下对应成功失败回调的方法处理都是一样的,所以提供一个工具方法统一使用

```javascript
// 统一处理then中返回的Promise(promise2)的后续变化状态的操作
function resolvePromise(x, promise2, resolve, reject) {
  // 如果promise2 就是自己传入的
  if (x === promise2) {
    return reject(new TypeError('重复调用'))
  }
  // 判断传入的x是否是对象或者方法
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 为了兼容其他人的Promise, 防止其他promise重复调用加一个防重
    let called
    // 如果抛出异常,就reject(x)
    try {
      // 获取到x的then属性
      const then = x.then
      // 如果then是function,我们就默认x是Promise
      if (typeof then === 'function') {
        // 调用x的then方法,如果x内部成功/失败调用对应的成功和失败
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            // 如果y还是Promise 需要再次解析then,知道不是Promise
            // resolve(y)
            resolvePromise(y, promise2, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        // 如果then不是函数,我们默认这个x是一个非Promise对象,直接resolve(x)
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    // 如果传入的值是一个原始值类型,直接resolve(x)
    resolve(x)
  }
}
```

### 处理 then 的空参数问题

> 当我们在使用 Promise 的时候,需要注意下使用者可能会写出 new Promise((resolve,reject) => {resolve(1)}).then().then().then(onFulfilled => {})这种代码。
> 我们处理这种情况下。

```javascript
  then(onFulfilled, onRejected) {
    // 如果onFulfilled/onRejected 无法获取到需要将当前的成功/失败值传给下一个then
    // new promise((resolve,reject) =>{resolve(1)}).then().then().then(of=> {console.log(of)}) 需要能够将of值传入
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : e => {throw e}
    // ...
  }
```

### 处理 resolve 方法传入一个 Promise

> 如果使用者在构造函数初始化的时候,传入一个 Promise,我们需要使用这个 Promise 的成功或者失败作为我们本次 Promise 的成功/失败

```javascript
  constructor(executor) {
    //...
    const resolve = (value) => {
      // 判断传入的值是否是Promise, 如果还是Promise,那么直接返回then的调用，将resolve/reject传入then的成功和失败回调,如果Promise成功/失败,通过回调参数，修改了当前Promise的状态
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }
      //。。。
    }
  }
```

### 测试

> 通过 Promise A+ 链接找到 promises-aplus-tests,对本案例做测试，如果成功就代表我们的 Promise 符合协议标准,可以混合使用

```javascript
Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
```

### 最终代码

```javascript
// promise 拥有三种状态 等待态,成功态,拒绝态
const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}
class Promise {
  constructor(executor) {
    // promise默认状态是Pending
    this.status = STATUS.PENDING
    this.value = undefined // 存储成功值,方便后面链式调用
    this.reason = undefined // 存储失败的原因,方便后面链式调用

    // 如果在状态未变情况下,调用then的时候,我们需要将then中成功/失败方法存储,等到状态变化方法主动调用
    this.onFulfilledCallbacks = [] // then的成功方法集
    this.onRejectedCallbacks = [] // then的失败方法集

    // 用户在执行函数到正确完成得时候,会调用resolve函数来修改当前实例的状态,resolve函数支持传入一个参数,作为成功的值
    const resolve = (value) => {
      // 判断传入的值是否是Promise, 如果还是Promise,那么直接返回then的调用，将resolve/reject传入then的成功和失败回调,如果Promise成功/失败,通过回调参数，修改了当前Promise的状态
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }

      // 只有在等待态下才能修改promise状态
      if (this.status === STATUS.PENDING) {
        // 修改实例的状态,为成功态
        this.status = STATUS.FULFILLED
        // 接受用户传来的成功值
        this.value = value
        // 状态变化之后,发起then的成功方法集调用,实现异步操作
        this.onFulfilledCallbacks.forEach((fn) => fn())
      }
    }

    // 用户在执行函数得到错误的内容或者抛出异常的时候,会调用reject函数来修改当前实例的状态,reject函数支持传入一个参数,作为失败/拒绝的原因
    const reject = (reason) => {
      // 只有等待态下才能修改promise
      if (this.status === STATUS.PENDING) {
        // 修改实例的状态为失败态
        this.status = STATUS.REJECTED
        // 接受用户传来的失败原因
        this.reason = reason
        // 状态变化之后,发起then的成功方法集调用,实现异步操作
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }
    try {
      // new Promise() 会传入一个默认执行的函数，并且函数接受两个可执行的方法参数
      executor(resolve, reject)
    } catch (error) {
      // 如果默认执行的函数执行报错,则直接将状态设置为拒绝
      reject(error)
    }
  }

  /**
   * 1. 每一个Promise的原型上面都有一个then方法,并且then方法会提供两个可执行方法参数
   *    @param {*} onFulfilled 成功执行函数
   *    @param {*} onRejected  失败执行函数
   * 2. then方法必须返回一个promise,我们通过new一个新的Promise达到效果
   *    @returns new Promise()
   * 3. then在链式调用的时候,后续then的调用规则
   *    + 如果在调用当前成功/失败的方法时,如果抛出异常,会走入下一次then的失败方法中
   *    + 获取到成功/失败的返回值x
   *    + 如果x是对象
   *        + x是普通对象,直接走入下一个then的成功方法中
   *        + x是Promise,获取到x的then,继续调用then,知道成功获取到普通对象或者基础数据类型
   *          + 在promise2的then的成功和失败方法调用promise对应的 resolve/reject的方法
   *          + 下一次的then的成功还是失败是由x的成功还是失败决定
   *    + 如果x是基础数据类型,会走入下一次then的成功方法中(无论成功还是失败都会调用then的成功方法)
   * 4.then的后续链式调用,只有在本次抛出异常,或回调方法返回的Promise失败的时候才会走入下一次的失败中,否则都是走下次resolve方法
   *
   */
  then(onFulfilled, onRejected) {
    // 如果onFulfilled/onRejected 无法获取到需要将当前的成功/失败值传给下一个then
    // new promise((resolve,reject) =>{resolve(1)}).then().then().then(of=> {console.log(of)}) 需要能够将of值传入
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (data) => data
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e
          }

    // 创建一个新的promise2,并且在方法最后返回,是then达到链式调用,继续then其实是调用新new出来的promise实例
    const promise2 = new Promise((resolve, reject) => {
      // 当我们调用then方法的时候,通过判断当前Promise状态，调用不同的传参方法
      // 当promise的状态为Fulfilled的时候,调用onFulfilled方法,并且将成功值作为参数传入
      if (this.status === STATUS.FULFILLED) {
        // 此处需要处理下promise2和x的情况,但是promise2是在new之后赋值的,所以需要使用一个异步宏/微来达到能取到promise
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            // 我们使用一个外部方法来统一处理此处
            resolvePromise(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      // 当promise的状态为REJECTED的时候,调用onRejected方法,并且将失败原因作为参数传入
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            // 我们使用一个外部方法来统一处理此处
            resolvePromise(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      // 当promise的状态为PENDING,这个时候属于异步操作
      // 通过发布订阅模式,将resolve和reject方法发布,等到后续状态变化完成之后,发起调用
      if (this.status === STATUS.PENDING) {
        // 使用装饰器模式/切片编程将成功/失败方法包装,方便我们做其他操作,以及获取状态变化后得 value/reason
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              // 我们使用一个外部方法来统一处理此处
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              // 我们使用一个外部方法来统一处理此处
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
}

// 统一处理then中返回的Promise(promise2)的后续变化状态的操作
function resolvePromise(x, promise2, resolve, reject) {
  // 如果promise2 就是自己传入的
  if (x === promise2) {
    return reject(new TypeError('重复调用'))
  }
  // 判断传入的x是否是对象或者方法
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 为了兼容其他人的Promise, 防止其他promise重复调用加一个防重
    let called
    // 如果抛出异常,就reject(x)
    try {
      // 获取到x的then属性
      const then = x.then
      // 如果then是function,我们就默认x是Promise
      if (typeof then === 'function') {
        // 调用x的then方法,如果x内部成功/失败调用对应的成功和失败
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            // 如果y还是Promise 需要再次解析then,知道不是Promise
            // resolve(y)
            resolvePromise(y, promise2, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        // 如果then不是函数,我们默认这个x是一个非Promise对象,直接resolve(x)
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    // 如果传入的值是一个原始值类型,直接resolve(x)
    resolve(x)
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise
```
