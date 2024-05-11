const fs = require('fs');
const path = require('path');

const ws = fs.createWriteStream(path.resolve(__dirname, 'copy.md'), {
    flags: 'w', // fs.open(flags)
    mode: 0o666,
    autoClose: true, // 关闭文件 fs.close
    emitClose: true, // 触发关闭事件 this.emit('close')
    start: 0,
    highWaterMark: 3 // 读取意味着每次读多少，在写的时候意味着就是希望占用多大的内存空间, 超过期望值会认为淹没了可用内存
})
// fs.write()

// highWaterMark 当写入的数据到达highWaterMark的时候 就会返回false，意味着不要在写入了，如果在继续调用write
// 方法 我就只能将写入的数据放到内存中了

// 链表 用链表实现的队列，从而将多次写入变成顺序写入

// 只用一个字节完成写入操作

let idx = 0;
function write() {
    if (idx < 10) {
        let flag = ws.write(idx++ + '')
        console.log(flag)
        if (flag) {
            write()
        }
    }
} // 写入的个数没有达到highWaterMark 最后的一次drain是不会触发的
write();
ws.on('drain', function () { // 当当前的写入操作的个数达到了highWaterMark,当这个数据全部写入完成后
    // 就会触发这个事件
    console.log('抽干')
    write();
})


// let flag = ws.write('abc', 'utf-8', () => {
//     console.log('write1');
// })

// flag = ws.write('bacd', 'utf-8', () => { // 3+ 4
//     console.log('write2');
// })
// console.log(flag)
// ws.write('vvv', 'utf-8', () => {
//     console.log('write3');
// })

// 可写流有两个常用的方法 ws.write()  ws.end()