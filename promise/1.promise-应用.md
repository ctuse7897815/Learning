## Promise 保姆篇-灵魂三问

> 哲学中有灵魂三问的说法:我是谁?我从哪里来?我要到哪里去?这个问题和简单又很复杂，不同的世界观，不同的人生观都会有自己的理解，一千个读者就有一千个哈姆雷特。
> 今天我也带着这三个问题,结合 MDN 和 Promise A+深入了解,巩固知识点

## 我是谁

- MDN 的定义
  - Promise 对象用于一个异步操作的最终完成(或失败)及其结果值。
  - 本质上 Promise 是一个函数返回的对象,我们可以在它上面绑定回调函数,这样我们就不需要在一开始把回调函数作为参数传入这个函数了。
- Promise A+
  - Promise 表示一个异步操作的最终结果,与之交互的主要方式是 then 方法,该方法注册了两个回调函数,用于接受 Promise 的终值或本 Promise 不执行的原因

## 我从哪里来

> 本观点知识本人的一些道听途说,不一定准确,当然个人认为这个也不是重点。

1. 为了更加优雅的处理异步操作,减少使用回调或者事件监听的方式带来的痛苦，社区先提出来和实现了 promise 的方案。
2. ES6 将 Promise 写入标准，提供了原生 Promise 对象.
3. ES7 提出了 async/await
4. 在使用 Promise 神奇的时候，大家神奇的发现了，竟然可以解决回调地狱的问题

## 我要到哪里去/我要做什么

我们想要知道 Promise 能做什么,当然先要知道怎么用。

> #### Promise A+
>
> An open standard for sound, interoperable JavaScript promises—by implementers, for implementers.
>
> A promise represents the eventual result of an asynchronous operation. The primary way of interacting with a promise is through its then method, which registers callbacks to receive either a promise’s eventual value or the reason why the promise cannot be fulfilled.
>
> Promise 表示一个异步操作的最终结果，与之进行交互的方式主要是 then 方法，该方法注册了两个回调函数，用于接收 promise 的终值或本 promise 不能执行的原因。

- Promise 拥有三个状态:pending(初始状态,既没有兑付也没有被拒绝),fulfilled(操作成功),rejected(操作失败)
- Promise 作为一个类,通过 new 初始化的时候，传入一个 executor 默认执行函数，并且当前 Promise 的状态为 pending
  - executor 函数是默认执行，所以这个函数是同步操作
  - executor 函数默认传两个参数, resolve 和 rejected,当我们的操作运行成功的时候，调用 resolve,失败的时候调用 rejected
- 当 executor 执行时,运行到操作成功/失败之后,执行传入的两个函数参数
  - 调用成功/失败对应的函数,可以传入一个参数,参数可以再后续中获取到
  - 当调用成功/失败 函数之后，实例状态会被修改成 fulfilled/rejected,并且状态无法再次修改
  - 如果在执行过程中,抛出异常,按照失败来处理

> #### Promise A+
>
> 2.1 Promise States
> A promise must be in one of three states: pending, fulfilled, or rejected.
>
> - 2.1.1 When pending, a promise:
>   - 2.1.1.1 may transition to either the fulfilled or rejected state.
> - 2.1.2 When fulfilled, a promise:
>   - 2.1.2.1 must not transition to any other state.
>   - 2.1.2.2 must have a value, which must not change.
> - 2.1.3 When rejected, a promise:
>   - 2.1.3.1 must not transition to any other state.
>   - 2.1.3.2 must have a reason, which must not change.
>
> Here, “must not change” means immutable identity (i.e. ===), but does not imply deep immutability.
>
> 2.1 Promise 的状态
> 一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。
>
> - 2.1.1 处于等待态时，promise 需满足以下条件:
>   - 2.1.1.1 可以迁移至执行态或拒绝态
> - 2.1.2 处于执行态时，promise 需满足以下条件:
>   - 2.1.2.1 不能迁移至其他任何状态
>   - 2.1.2.2 必须拥有一个不可变的终值
> - 2.1.3 处于拒绝态时，promise 需满足以下条件:
>   - 2.1.3.1 不能迁移至其他任何状态
>   - 2.1.3.2 必须拥有一个不可变的据因
>
> 这里的不可变指的是恒等（即可用 === 判断相等），而不是意味着更深层次的不可变（指当 value 或 reason 不是基本值时，只要求其引用地址相等，但属性值可被更改）

    ```javaScript
      let p1 = new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve('成功了')
          reject('失败了')
          console.log('after   ', p1)
        }, 0)
      })
      p1.then(resolved => {
        console.log('resolved',resolved)
      }, rejected => {
        console.log('rejected',rejected)
      })
      console.log('before  ', p1)
      // 创建Promise之后, Promise的状态是pending,等待态
      // 调用resolve/reject 会改变Promise的状态,并且一旦改变成成功/失败态,就无法再次改变
      // before   Promise { <pending> }
      // after    Promise { '成功了' }
      // resolved 成功了
    ```

- Promise.prototype.then() 链式调用

  - 每一个 promise 实例都有一个 then 方法,方法接受两个参数,onFulfilled 和 onRejected
    >
  - then 方法必须返回一个 promise 对象
  - onfulfilled 或者 onRejected 在调用的时候，如果返回的是非 Promise,值会被传入下一次 then 的成功结果,就是在返回的 Promise 执行方法 resolve()

  ```javascript
  new Promise((resolve, reject) => {
    resolve(1)
  })
    .then((value) => {
      return 1
    })
    .then(
      (value) => {
        console.log('p1 => then => onfulfilled => ', value)
      },
      (reason) => {
        console.log('p1 => then => onRejected =>', reason)
      }
    )
  //
  // p1 => then => onfulfilled =>  1
  new Promise((resolve, reject) => {
    reject(1)
  })
    .then(null, (reason) => {
      return 2
    })
    .then(
      (value) => {
        console.log('p2 => then => onfulfilled => ', value)
      },
      (reason) => {
        console.log('p2 => then => onRejected =>', reason)
      }
    )
  // p2 => then => onfulfilled =>  2
  ```

  - 如果执行 then 方法出错抛出异常,走到下一个 then 的失败中

  ```javascript
  new Promise((resolve, reject) => {
    resolve(1)
  })
    .then((value) => {
      throw new TypeError('错误')
    })
    .then(
      (value) => {
        console.log('p1 => then => onfulfilled => ', value)
      },
      (reason) => {
        console.log('p1 => then => onRejected =>', reason)
      }
    )
  // p1 => then => onRejected => TypeError: 错误
  //  at Promise.then (test.js:51:27)
  //  ...
  ```

  - 如果返回的是一个 promise,会用这个 promise 的结果作为下一个 then 的成功或者失败
    - 如果返回的 promise 成功,链式调用 then,会将正确值传入下一个 then 的 onFufilled 中
    - 如果返回的 promise 失败,链式调用 then,会将拒绝原因传入下一个 then 的 onRejected 中

  ```javascript
  new Promise((resolve, reject) => {
    resolve(1)
  })
    .then((value) => {
      return new Promise((resolve1, reject1) => {
        resolve1(3)
      })
    })
    .then(
      (value) => {
        console.log('p1 => then => onfulfilled => ', value)
      },
      (reason) => {
        console.log('p1 => then => onRejected =>', reason)
      }
    )
  // p1 => then => onfulfilled =>  3

  new Promise((resolve, reject) => {
    resolve(1)
  })
    .then((value) => {
      return new Promise((resolve1, reject1) => {
        reject1(3)
      })
    })
    .then(
      (value) => {
        console.log('p2 => then => onfulfilled => ', value)
      },
      (reason) => {
        console.log('p2 => then => onRejected =>', reason)
      }
    )
  // p2 => then => onRejected => 3
  ```

参考资料:
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
[Promise A+:](https://promisesaplus.com/#terminology)
