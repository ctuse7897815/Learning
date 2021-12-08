const r = (resolve) => {resolve()}
const then1 = () => { 
  console.log('then1')
  new Promise(r).then(then2)
  new Promise(r).then(then3)
}
const then2 = () => {
  console.log('then2')
  setTimeout(st2,0)
}
const then3 = () => {
  console.log('then3')
  setTimeout(st3,0)
}
const then4 = () => {
  console.log('then4')
}
const st1 = function() {
  console.log('st1')
  new Promise(r).then(then4)
}
const st2 = function() {
  console.log('st2')
}
const st3 = function() {
  console.log('st3')
}
function m1() {
  new Promise(r).then(then1)
  setTimeout( st1, 0)
}
m1()