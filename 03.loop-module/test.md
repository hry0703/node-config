## 除了微任务的都是宏任务
- queueMicrotask  , Promise.then(), MutationObserver 其它的都是宏任务
- 执行流程 浏览器会提供一个单独的宏任务队列，默认情况下，所有的主线程执行的任务就是一个宏任务
- script标签，执行这个脚本之后会产生宏任务和微任务。 等待脚本执行完毕会清空所有的微任务，在拿出一个宏任务继续执行
- 每次执行一个宏任务 ->（清空本次产生的所有的微任务） -> 可能要渲染？16.6 -> 取出一个宏任务继续执行----|
   |--------------------------------------------------------------------------------------

document.body.style.background = 'red';
console.log(1)
Promise.resolve().then(()=>{
  console.log(2)
  document.body.style.background = 'yellow';
})
console.log(3);

----------------
button.addEventListener('click',()=>{
  console.log('listener1');
  Promise.resolve().then(()=>console.log('micro task1'))
})
button.addEventListener('click',()=>{
  console.log('listener2');
  Promise.resolve().then(()=>console.log('micro task2'))
})
button.click(); // click1() click2()



----------------
Promise.resolve().then(() => {
  console.log('Promise1')
  setTimeout(() => {
    console.log('setTimeout2')
  }, 0);
})
setTimeout(() => {
  console.log('setTimeout1');
  Promise.resolve().then(() => {
    console.log('Promise2')
  })
}, 0);


----------------
console.log(1);
async function async () {
    console.log(2);
    await console.log(3);
    console.log(4)
}
setTimeout(() => {
	console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
	console.log(res)
})
async (); 
console.log(8);


----------------
Promise.resolve().then(() => {
    console.log(0);
    return new Promise((resolve)=>{
        resolve('a');
    })
}).then(res => {
    console.log(res)
})
Promise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(4);
}).then(() => {
    console.log(5);
})