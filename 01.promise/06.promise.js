console.log('my promise run ')

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED'
// 此函数主要的目的是判断x 是不是promise
// 规范中说明 我们的promise可以和别人的promise互通
const resolvePromise = (x, promise2, resolve, reject) => {
    // 用x 的值来决定promise2 是成功还是失败 (resolve,reject)
    if (x === promise2) {
        return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>] error'))
    }
    // promise实例要么是对象要么是函数
    if ((typeof x === 'object' && x !== null) || (typeof x === 'function')) {
        let called = false
        try {
            let then = x.then;// 看是否有then方法
            if (typeof then === 'function') {
                // 不用每次都取值了,直接用上次取到的结果
                then.call(x, (y) => {  // 别人家的promise
                    if (called) return
                    called = true
                    resolvePromise(y, promise2, resolve, reject)
                }, (r) => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else {
                resolve(x); // {then:{}}  | {} | function
            }
        } catch (e) { // 别人家的promise
            if (called) return
            called = true
            reject(e); // 取值出错
        }
    } else { // 说明x是一个普通值
        resolve(x); // 普通值直接向下传递即可
    }
}


class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolveCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value;
                this.status = FULFILLED
                this.onResolveCallbacks.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }

    }
    // promise的链式调用的
    // 1）返回的是一个普通值（非promise的值）这个值会被传到外层then的下一个then的成功中去
    // 2) 没有返回值（抛错了），会执行外层的then的下一个then的失败
    // 3) 返回的是promise ，会去解析返回的promise将解析后的值，传递到成功或者失败中（看这个promise是什么状态）
    // 什么时候会失败 （抛错走下一次的失败，返回的是失败的promise会走失败，其它都是成功的）
    // 链式调用一般情况需要返回的是this  $().css().html()
    // promise为了能扭转状态 而且还要保证promise状态变化后不可以更改。 返回一个全新的promise
    then(onFulfilled, onRejected) {
        // then方法中如果没有传递参数 那么可以透传到下一个then中
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : (reason) => {
            throw reason
        }
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                process.nextTick(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
            if (this.status === REJECTED) {
                process.nextTick(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
            if (this.status === PENDING) {
                this.onResolveCallbacks.push(() => {
                    process.nextTick(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
                this.onRejectedCallbacks.push(() => {
                    process.nextTick(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })

                })
            }
        })
        return promise2
    }
}
Promise.deferred = function () {
    const dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd;
}
// npm install promises-aplus-tests -g

module.exports = Promise





