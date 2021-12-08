## 进程与线程

进程: cpu资源分配的最小单位，也是独立运行的最小单位（一个进程就是一个程序的运行实例）

线程: cpu调度的最小单位（线程是不能单独存在的，它是由进程来启动和管理的，一个进程中可以有多个线程，进程内的线程共享进程全部资源）

## 浏览器进程(Chrome)
+ **浏览器主进程(负责协调、主控)**:
  + 负责页面显示、用户交互、网址栏等功能
  + 管理各个页面,创建和销毁进程
  + 文件存储等功能
  + ...
+ **GPU进程**: 用于3D绘制等。
+ **插件进程**: 每个使用得插件开启一个进程。
+ **网络进程**: 负责网络资源加载。
+ **渲染进程**:
  + 页面渲染
  + JS引擎
  + 事件处理
  + ...

![](https://chentcc.oss-cn-hangzhou.aliyuncs.com/js/EventLoop/process_list.png)

## 宏任务和微任务
+ **宏任务(MacroTask):** script全部代码、setTimeout、setInterval、setImmediate（浏览器暂时不支持，只有IE10支持，具体可见MDN）、I/O...
+ **微任务(MicroTask):** Promise.then,MutationObserver...

## 调动顺序
1. **先执行宏任务 （script脚本）**
2. **清空所有的微任务 (全部执行完毕) ,微任务执行后开始页面渲染（不是每次都渲染）**
3. **取出一个宏任务执行，执行过程中可能再次产生宏任务、微任务。。。**
4. **不停的循环**  


## 代码推理
> 下面我们通过下面这段代码来看
```javascript
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
```
> 代码开始执行
![](https://chentcc.oss-cn-hangzhou.aliyuncs.com/js/EventLoop/start.png)

> 宏任务脚本执行完成,开始清空微任务
![](https://chentcc.oss-cn-hangzhou.aliyuncs.com/js/EventLoop/microtask-1.png)

> 第一次清空微任务
![](https://chentcc.oss-cn-hangzhou.aliyuncs.com/js/EventLoop/microtask-2.png)

> 微任务队列已经全部清空,将会从宏任务队列中取一个宏任务
![](https://chentcc.oss-cn-hangzhou.aliyuncs.com/js/EventLoop/macrotask-1.png)

> 宏任务执行完成,进入下一次循环
![](https://chentcc.oss-cn-hangzhou.aliyuncs.com/js/EventLoop/microtask-3.png)

> 继续执行
![](https://chentcc.oss-cn-hangzhou.aliyuncs.com/js/EventLoop/macrotask-2.png)
![](https://chentcc.oss-cn-hangzhou.aliyuncs.com/js/EventLoop/macrotask-3.png)
