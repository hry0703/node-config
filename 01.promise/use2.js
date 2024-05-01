const fs = require('fs');
const path = require('path')
const Promise = require('./06.promise')
function readFile(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', function (err, data) {
            if (err) return reject(err);
            resolve(data)
        })
    })
}
// promise的链式调用的  
// 1）返回的是一个普通值（非promise的值）这个值会被传到外层then的下一个then的成功中去
// 2) 没有返回值（抛错了），会执行外层的then的下一个then的失败
// 3) 返回的是promise ，会去解析返回的promise将解析后的值，传递到成功或者失败中（看这个promise是什么状态）
// 什么时候会失败 （抛错走下一次的失败，返回的是失败的promise会走失败，其它都是成功的）
// 链式调用一般情况需要返回的是this  $().css().html()
// promise为了能扭转状态 而且还要保证promise状态变化后不可以更改。 返回一个全新的promise
let promise2 = readFile(path.resolve(__dirname, 'name.txt')).then(data => {
    // return 100  // -> x 决定promise2是成功还是失败
    return 100
})
promise2.then(data => {
    console.log(data, 'outer')
}, err => {
    console.log(err, 'error')
});
// fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
//     if (err) return console.log(err);
//     fs.readFile(path.resolve(__dirname, data), 'utf8', function (err, data) {
//         if (err) return console.log(err);
//         console.log(data)
//     })
// })