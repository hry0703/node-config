// 可以将一些异步方法转换成proimise方法

const fs = require('fs/promises')
const path = require('path')
// const util = require('util'); // 因为很多api以前都是回调的
// function readFile(url) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(url, 'utf-8', function (err, data) {
//             if (err) return dfd.reject(err)
//             dfd.resolve(data)
//         })
//     })
// }
// toRef  toRefs
function promisify(fn) { // 高阶函数
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args, function (err, data) {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }
}
function promisifyAll(obj) { // 转化对象中所有的api
    for (let key in obj) {
        const val = obj[key]
        if (typeof val === 'function') {
            obj[key] = promisify(val)
        }
    }
}
// 只针对node 因为node中函数蚕食第一个永远是错误, 基于传递的参数构建promise
// let readFile = promisifyAll(fs)
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8').then(data => {
    console.log(data)
})

// 将方法转换成promise来使用
