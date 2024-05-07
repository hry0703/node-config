// Promise.resolve 是ECMAScript自己实现的(为了能快速创建promise并且具备等待效果) 
// 我们参考的是promise A+ 规范实现的。 
const Promise = require('./promise')
// Promise.resolve 有一个特点就是会产生一个新的promise， 如果你传入的值是一个promise?
// Promise.resolve 可以解析传入的promise 具备等待效果
Promise.resolve(new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('abc')
            }, 1000)
        }))
    }, 1000)
})).then(data => {
    console.log(data)
})
Promise.reject(new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('abc')
            }, 1000)
        }))
    }, 1000)
})).catch(err => {
    console.log(err, 'error')
}).then(val => {
    console.log(val, 'success')
})

// resolve等待  reject不具备等待，错误可以通过catch来捕获 == then
Promise.resolve(new Promise((resolve, reject) => {
    resolve('111')
})).then(data => {
    console.log('then', data);
    throw new Error('222')
}).catch(err => {
    console.log(err, 'error')
})