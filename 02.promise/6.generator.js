// 生成器，在生成的过程中可以暂停，可以自己控制是否继续

// 数组迭代器 生成器是用来生成迭代器

// 类数组？ 索引，长度，能遍历

// babel/polifill
// 元编程，可以更改我们js的具体的逻辑 Object.prototype.toString.call

// let obj = { get [Symbol.toStringTag]() { return 'abc' } };
// console.log(Symbol,obj.toString())


let likeArray = { 
    0: 1, 1: 2, 2: 3,
     length: 3, 
     [Symbol.iterator]: function* () {
        let i = 0;
        let len = this.length;
        while (len != i) {
            yield this[i++];
        }
    }
    //         () {
    //         let i = 0;
    //         return { // 一个对象有一个next方法，每次调用next 都会产生一个对象具备 {value done}
    //             next:()=> {
    //                 return {value:this[i],done:i++ == this.length}
    //             }
    //         }
    //     }
}

const arr = [...likeArray];

// function* gen() {
//     try {
//         let a = yield 1; // js执行是先走等号右边的，遇到yield就停止了
//         console.log(a)
//         let b = yield 2;// yield的返回值是下一次调用next传递的参数
//         console.log(b)
//         let c = yield 3
//         console.log(c)
//         return undefined
//     } catch (e) {
//         console.log(e)
//     }
// }
// let it = gen(); // iterator 迭代器
// console.log(it.next('asdasdasd')); // 第一次调用next方法传递的参数没有任何意义
// it.throw('错误'); // 调用了第一次next的时候 可以暂停逻辑，如果觉得这个逻辑有异常后续可以通过throw方法抛出异常
// console.log(it.next('abc'));
// console.log(it.next('abcd')); // { value: 1, done: false }
// console.log(it.next()); // { value: 2, done: false }
// console.log(it.next()); // { value: 3, done: false }
// console.log(it.next()); // { value: 4, done: false }

const fs = require('fs/promises');
const path = require('path');
// const co = require('co'); // 别人写的需要安装
function* readResult() { // 依旧是异步的方法，只是看起来像同步的
    let filename = yield fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
    let age = yield fs.readFile(path.resolve(__dirname, filename), 'utf8');
    return age;
}
// let { value, done } = it.next();
// value.then(data => {
//     let { value, done } = it.next(data);
//     value.then(data => {
//         let { value, done } = it.next(data);
//         console.log(value)
//     })
// })
function co(it) {
    return new Promise((resolve, reject) => { // 同步迭代for循环，异步迭代用回调
        function next(data) { // koa express
            let { value, done } = it.next(data);
            if (!done) { // 如果没完成返回的一定是一个promise
                Promise.resolve(value).then((data => {
                    next(data)
                }), reject)
            } else {
                resolve(value); // 完成value就是最后的结果
            }
        }
        next();
    })
}
co(readResult()).then(data => {
    console.log(data)
})



// async + await



// let it = readResult();
// let { value, done } = it.next();
// value.then(data => {
//     let { value, done } = it.next(data);
//     value.then(data => {
//         let { value, done } = it.next(data);
//         console.log(value)
//     })
// })