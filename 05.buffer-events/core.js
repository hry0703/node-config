
/* 我们调用的nodeapi 都是交给我们libuv库来去实现的， 通过阻塞i/o来实现 异步
 通知完成的方式就是事件驱动
   ┌───────────────────────────┐
┌─>│         timers            │ 放定时器
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ 上一轮没执行完的在这来执行
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ 内部使用
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │  文件读写回调再这里来执行
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │ 执行setImmiedate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │ socket.close()
   └───────────────────────────┘
*/
// 当主栈执行完后 会按照顺序依次执行 timers(setTimeout) ->  poll(fs.方法的回调) ->  check(setImmediate)


// 当代码执行完毕后 ，会从timer-> poll 检测poll里面是否都执行完毕了。 检测一下有没有setImmeidate
// 如果有则执行setImmdiate 如果没有则在这里阻塞

// node中只是将宏任务进行了划分 划分到了不同的宏任务队列中。
// 微任务也是在每个宏任务执行完毕后 才清空的.

// process.nextTick 并不是微任务 ，每个宏任务执行完后会执行nextTick(比nextTick的优先级更高)

// https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick



// 当我们主栈代码执行完毕后， 会依次按照node的事件环队列进行清空处理

// 检测timers 中是否有已经到达时间的任务 
// 进入到poll阶段，主要就是检测是否有 文件读写的操作的回调，让他依次执行
// 检测一下是否用户编写了setImmediate, 就去执行setImmdiate, 如果没有check相关的内容，则会在poll阶段阻塞
// 每个阶段存放的任务都是宏任务， 每个宏任务执行完毕后会清空微任务队列 （浏览器的事件环一致）
// node10之前执行的方式是每个阶段执行完毕后 会清空微任务
// process.nextTick优先级高于 微任务  （宏任务 -》 nextTick -》 清空微任务 -》 拿出下一个宏任务）


// setTimeout 和 setImmediate在使用的时候 （主模块中不知道谁快谁慢）

const fs = require('fs');
const path = require('path')
fs.readFile(path.resolve(__dirname, 'note.md'), function () { // poll
    setTimeout(() => {
        console.log('timer')
    }, 0);
    setImmediate(() => {
        console.log('setImmediate')
    })
})
// poll -> check -> timer -> poll


Promise.resolve().then(() => {
    console.log('then')
})
// function nextTick() {
//     process.nextTick(() => {
//         nextTick(); // 本质上不是异步就是一个 下一个队列中要执行的回调而已
//     })
// }
// nextTick()


// global.process
// global.Buffer