const fs = require('fs');
const path = require('path')

// 异步（我们不能立刻拿到返回值，而是我可以继续做别的事情）和同步的区别 
// 我 （非阻塞）  ->  小姑娘（你可以撤了，等我消息，决定了这个方法是异步的）
// 我 (阻塞) -> 小姑娘 （别挂电话，稍等我会告诉你，同步的）
// 同步阻塞， 异步非阻塞
// node中的api 第一个参数都是err ，意味着error-first 优先错误处理


// let res = fs.readFileSync(path.resolve(__dirname,'README.md'),{encoding:'utf-8'})
// console.log(res,);

// fs.readFile(path.resolve(__dirname, 'README.md'), { encoding: 'utf-8' },(err,data)=>{

//     console.log(err, data);
// })

// const readAll = (a,b)=>{
//     console.log("zhix",a, b);
// }


// function curry(fn){
//     var curried = (...args)=>{
//         console.log(args,args.length);
//         if (args.length>= fn.length){
//             return fn(...args)
//         }else {
//             return (...others) => {
//                 console.log('args',args);
//                 return curried(...args, ...others)
//             }
//         }
//     }
//     return curried
// }

// let newRead = curry(readAll);


// fs.readFile(path.resolve(__dirname, 'name.txt'), { encoding: 'utf-8' }, (err, data) => {
//     console.log(err, data);
//     if (!err) newRead = newRead(data);
// })
    
// fs.readFile(path.resolve(__dirname, 'age.txt'), { encoding: 'utf-8' }, (err, data) => {
//     console.log(err, data);
//     if (!err) newRead = newRead(data);
// })



let person = {}
// let i = 0;
// function out() {
//     if (++i == 2) {
//         console.log(person)
//     }
// }
function after(times, callback) { // 高阶函数来处理异步问题
    return function () { // out
        if (--times == 0) {
            callback()
        }
    }
}
let out = after(2, function () { // 只能等待两次都完成后才执行，过程丢失了....
    console.log(person)
})
// 发布订阅模式
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
    person.name = data
    out(); // 发布
});

fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
    person.age = data
    out(); // 发布
});
