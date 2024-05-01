const fs = require('fs');
const path = require('path');
const Promise = require('./06.promise');

let promise = new Promise((resolve, reject) => {
    resolve()
})
// 1)如果返回的是promise2 那么会涉及到promise2等待promise2成功，自己等待自己完成
// let promise2 = promise.then(() => {
//     return new NativePromise
// })
// promise2.then(data => {
//   console.log(data, 'outer');
// }, err => {
//   console.log(err, 'error');
// });

// 2) 取值时报错
// let obj = {}
// Object.defineProperty(obj, 'then', {
//     get() {
//         throw new Error('getter');
//     }
// })
// obj.then


let promise2 = promise.then(() => {
    return {
        then() {

        }
    }
})
promise2.then(data => {
    console.log(data, 'outer');
}, err => {
    console.log(err, 'error');
});