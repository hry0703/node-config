function EventEmitter() {
    this._events = {}; // 实例上的独有属性
    // 共享的属性
}
// 订阅
EventEmitter.prototype.on = function (eventName, callback) {
    if (!this._events) this._events = {};
    if (eventName !== 'newListener') {
        this.emit('newListener', eventName)
    }
    (this._events[eventName] || (this._events[eventName] = [])).push(callback)
}
EventEmitter.prototype.once = function (eventName, callback) {
    const once = (...args) => {
        callback(...args); // before after
        this.off(eventName, callback); // 触发完毕后关闭
    }
    once.l = callback;// 为了移除的时候 能找到这个once来移除
    this.on(eventName, once); // 先绑定
}
// 发布
EventEmitter.prototype.emit = function (eventName, ...args) {
    if (!this._events) this._events = {}
    // console.log(this._events)
    if (this._events[eventName]) {
        this._events[eventName].forEach(fn => fn(...args))
    }
}
// 关闭订阅
EventEmitter.prototype.off = function (eventName, callback) {
    if (!this._events) this._events = {}
    let callbacks = this._events[eventName];
    if (callbacks) {
        this._events[eventName] = callbacks.filter(item => (item != callback) && (item.l !== callback))
    }
}
module.exports = EventEmitter


// on 订阅
// emit 发布
// once 绑定一次
// on('newListener')绑定监听事件



// function A() {
//     this.a = {}
//     this.on = ()=>{ }
// }
// A.prototype.b = {}
// let a1 = new A();
// let a2 = new A();
// console.log(a1.b === a2.b)