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
                // 为了满足ECMAScript的功能自己额外的添加
                if (value instanceof Promise) {
                    return value.then(resolve, reject)
                }

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

    catch(fn) { // 针对失败做处理，成功无视
        this.then(null,fn)
    }
}


// Promise.resolve 是ECMAScript自己实现的(为了能快速创建promise并且具备等待效果) 
// 我们参考的是promise A+ 规范实现的。 
// Promise.resolve 有一个特点就是会产生一个新的promise， 如果你传入的值是一个promise?
// Promise.resolve 可以解析传入的promise 具备等待效果
Promise.resolve = function(value){
    return new Promise((resolve, reject) => {
        resolve(value)
    })
}

Promise.reject = function (reason) { 
    return new Promise((resolve, reject) => {
        reject(reason)
    })
}

Promise.all = function (values) {
    return new Promise((resolve, reject) => {
        let idx = 0 
        let results = []
        values.forEach((item,i) => {
            Promise.resolve(item).then(val=>{
                results[i] = val;
                if(results.length === ++idx){
                    resolve(results)
                }
            }) 
        }, reject);
    })
}

Promise.race = function (values) {
    return new Promise((resolve, reject) => {
        values.forEach((item, i) => {
            Promise.resolve(item).then(val => {
                resolve(val)
            })
        }, reject);
    })
}

// 无论成功和失败都要执行的逻辑 
Promise.prototype.finally = function (fn) {
    return this.then((val) => {
        // Promise.resolve 具备一个功能，就是可以解析传入的promise
        return Promise.resolve(fn()).then(() => val)
    }, (r) => {
        return Promise.resolve(fn()).then(() => { throw r })
    })
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





