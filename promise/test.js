// const Promise = require('./promise.js')
// const p1 = new Promise((resolve,reject) => {
//   // resolve(new Promise((resolve,reject) => {
//   //   resolve(123)
//   // }).then((val) => {
//   //     console.log('p1 => prommise', 1)
//   //     return new Promise((resolve,reject) => {
//   //       resolve(344)
//   //     })
//   // }))
//   resolve(1)
// })
// const v = p1.then(value => {
//   // console.log('v', value)
//   // return new Promise(() => {
//   //   throw new TypeError(123)
//   // })
//   console.log('v', value)
//   return value
// },reason => {
//   console.log(reason)
// }).then(value => {
//   console.log('value => value',value)
// },reason => {
//   console.log('v => reason',reason)
// })

// new Promise((resolve, reject) => {resolve(1)})
//   .then((value) => {return 1})
//   .then(
//     (value) => {
//       console.log('p1 => then => onfulfilled => ', value)
//     },
//     (reason) => {
//       console.log('p1 => then => onRejected =>', reason)
//     }
//   )
// new Promise((resolve, reject) => {reject(1) })
//   .then(null, (reason) => { return 2 })
//   .then(
//     (value) => {
//       console.log('p1 => then => onfulfilled => ', value)
//     },
//     (reason) => {
//       console.log('p1 => then => onRejected =>', reason)
//     }
//   )

// new Promise((resolve, reject) => {resolve(1)})
//   .then((value) => {throw new TypeError('错误')})
//   .then(
//     (value) => {
//       console.log('p1 => then => onfulfilled => ', value)
//     },
//     (reason) => {
//       console.log('p1 => then => onRejected =>', reason)
//     }
//   )

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
