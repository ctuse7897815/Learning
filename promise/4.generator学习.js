// function* test() {
//   yield 1
//   yield 2
//   yield 3
//   return 100
// }
// let t = test()
// console.log(t.next())
// console.log(t.next())
// console.log(t.next())
// console.log(t.next())
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: false }
// { value: undefined, done: true }

// function* tests() {
//   yield 1
//   yield 2
// }

// function* test() {
//   yield* tests()
//   yield 3
// }
// const t = test()
// console.log(t.next())
// console.log(t.next())
// console.log(t.next())
// console.log(t.next())

// function gen() {
//   const content = {
//     prev: 0,
//     next: 0,
//     done: false,
//     stop: () => {
//       this.done = true
//     },
//   }
//   return {
//     next() {
//       return {
//         value: _gen(content),
//         done: content.done,
//       }
//     },
//   }
// }
// function _gen(content) {
//   switch (content.prev = content.next) {
//     case 0:
//       content.next = 1
//       return 1
//     case 1:
//       content.next = 2
//       return 2
//     case 2:
//       content.stop()
//       return undefined
//   }
// }
// let g = gen()
// console.log(g.next())
// console.log(g.next())
// console.log(g.next())
// console.log(g.next())
// console.log(g.next())
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: false }
// { value: undefined, done: false }
// { value: undefined, done: false }
const fs = require('fs').promises
// function* getData() {
//   let path1 = yield fs.readFile('./path.txt', 'utf-8')
//   let name = yield fs.readFile(path1, 'utf-8')
//   return name
// }
// function co(it) {
//   // 我们最终返回一个Promise
//   return new Promise((resolve,reject) => {
//     // 循环回调,一直到generator最后done为false的时候,不能再迭代的时候
//     function step(data) {
//       // 迭代一次,获取当前步骤内容
//       let {value,done} = it.next(data)
//       if(!done) {
//         // 当前不知道具体步骤返回的值是多少,通过Promise.resolve,得到then的链式调用内容，
//         Promise.resolve(value).then(data => {
//           step(data)
//         },reject)
//       } else {
//         // 当所有迭代走完,统一返回出去
//         resolve(value)
//       }
//     }
//     step()
//   })
// }
// co(getData()).then(data => {
//   console.log(data)
// })
// const _fs = getData()
// _fs.next().value
//   .then((rs) => {
//     console.log(rs)
//     _fs.next(rs).value
//       .then((rs) => {
//         console.log(rs)
//       })
//       .catch((error) => {
//         console.log(error)
//       })
//   })
//   .catch((error) => {
//     console.log(error)
//   })

async function getData() {
  let path1 = await fs.readFile('./path.txt', 'utf-8')
  let name = await fs.readFile(path1, 'utf-8')
  return name
}
getData().then(data => {console.log(data)})
