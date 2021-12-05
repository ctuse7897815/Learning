const Promise = require('./promise-write-1')
const fs = require('fs')

// 延迟调用
// function read(...args) {
//   let dfd = Promise.defer();
//   fs.readFile(...args,function(err, data) {
//     if(err) return dfd.reject(err)
//     dfd.resolve(data)
//   })
//   return dfd.promise
// }

// read('/Users/chentao/学习/WriteAndDraw/Learning/promise/m.txt','utf-8').then(data => {
//   console.log(data)
// })

// Promise.resolve(
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject(1)
//     }, 1000)
//   })
// ).then((data) => {
//   console.log(data)
// },d => {console.log(d)})


Promise.reject(
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(1)
    }, 1000)
  })
).then((data) => {
  console.log(data)
},d => {console.log(d)})


// Promise.reject(1).then(data => {
//   console.log('data', data)
// }, reason => {
//   console.log('reason', reason)
// })

// Promise.all([1,new Promise(resolve => {resolve(3)}),new Promise((resolve,reject) => {reject(4)}), 2]).then(data => {
//   console.log('data', data)
// }, reason => {
//   console.log('reason', reason)
// })

// Promise.race([
//   new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(3)
//     }, 500)
//   }),
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject(4)
//     }, 200)
//   }),
// ]).then(
//   (data) => {
//     console.log('data', data)
//   },
//   (reason) => {
//     console.log('reason', reason)
//   }
// )

// Promise.allSettled([
//   new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(3)
//     }, 500)
//   }),
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject(4)
//     }, 200)
//   }),
// ]).then(
//   (data) => {
//     console.log('data', data)
//   },
//   (reason) => {
//     console.log('reason', reason)
//   }
// )
