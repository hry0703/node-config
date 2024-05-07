// ECMAScript 为了更方便还提供了更好的方法 
// Promise.all 等待所有的promise都成功才成功，有一个失败就失败了
const Promise = require('./promise')
const path = require('path');
const fs = require('fs')
function readFile(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', function (err, data) {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

Promise.all([
    readFile(path.resolve(__dirname, '../01.promise/name.txt')),
    readFile(path.resolve(__dirname, '../01.promise/age.txt')),
    100
]).then(data => {
    console.log(data)
}).catch(err => {
    console.log(err)
})


// 哪个结果快就用谁的, 用它来终端成功的结果
// Promise.race([
//     readFile(path.resolve(__dirname, '../01.promise/name.txt')),
//     readFile(path.resolve(__dirname, '../01.promise/age.txt')),
// ]).then(data => {
//     console.log(data,'success')
// }).catch(err => {
//     console.log(err,'error')
// })

// 可以自己构建一个promise，和用户写的放在一起，如果我想让用户的失败，我就让内置的promise失败就可以了
// let abort

// function withAbort(userPromise) {
//     let abort;
//     const internalPromise = new Promise((resolve, reject) => {
//         abort = reject
//     })
//     let p = Promise.race([userPromise,internalPromise])
//     p.abort = abort
//     return p
// }
// let p = new Promise((resolve, reject) => {
//     // abort = reject;
//     setTimeout(() => {
//         resolve(100)
//     }, 3000)
// })
// p = withAbort(p)
// setTimeout(() => {
//     p.abort('超时了')
// },2000)
// p.then(data => {
//     console.log(data)
// }).catch(err => { // 如何让这个promise 走向失败？
//     console.log(err,'error')
// })
// 超时处理可以采用race方法

// all和race （还有一个 allSettled 无论成功和失败都要结果）



// Promise.allSettled([
//     readFile(path.resolve(__dirname, 'name1.txt')),
//     readFile(path.resolve(__dirname, 'age.txt')),
// ]).then(data => {
//     console.log(data, 'success')
// }).catch(err => {
//     console.log(err, 'error')
// })