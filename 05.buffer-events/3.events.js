const EventEmitter = require('./events');
const util = require('util'); // util.promisify
function Girl() { }
// 实现原型继承有几种方案  obj.prototype.__proto__ = parent.prototype
//                     obj.prototype =  Object.create(parent.prototype)
//                     Object.setPrototypeOf( obj.prototype,parent.prototype)
util.inherits(Girl, EventEmitter)
const girl = new Girl();
// 发布订阅 on {'女生失恋':[fn1]}  emit('女生失恋')
let waiting = false
// girl.on('newListener', function (eventName) {
//     if (!waiting) {
//         process.nextTick(() => {
//             girl.emit(eventName)
//             waiting = false
//         })
//         waiting = true
//     }
// })
girl.once('女生失恋', function (val) { // 当绑定事件的时候on中的回调还没有存到列表中
    console.log('哭', val)
})
girl.once('女生失恋', function (val) {
    console.log('吃')
})
// girl.off('女生失恋',fn)
girl.emit('女生失恋', '男朋友跑了...')
girl.emit('女生失恋', '男朋友跑了...')
// 我想监控用户绑定了女生失恋，我就自动触发这个事件

