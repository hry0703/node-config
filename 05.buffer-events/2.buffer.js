// 不是二进制 怎么变成了16进制 原因是16进制展现形式比较段 

// Buffer是用来存放内容的 （标识的是内存空间）

// 1) .buffer声明方式需要指定大小

// 长度  指定buffer中存放的特定内容  我们可以直接给字符串

console.log(Buffer.alloc(3)); // node中的最小单位都是字节
console.log(Buffer.from([100, 200])); // 这种方式不常用
console.log(Buffer.from('帅'))

// 内存一但申请了，无法直接在原内存上进行扩展
// 在前端上传文件的时候（分片上传） 创建一个大的内存，来存储多段数据

// 合并数据（tcp分段传输的，我们肯定希望拿到数据后可以进行拼接操作）

// slice 可以截取buffer中某个部分的数据 1个汉字三个字节 （截取了2个字节）
// slice 可以截取buffer中某个部分的数据 1个汉字1个字节 （截取了1个字节）
const a1 = Buffer.from('你好').slice(0, 5);  // 好截取了2个字节
const a2 = Buffer.from('好世界').slice(2); // 好的两个字节之后截取
const a3 = Buffer.alloc(12);
// target 拷贝的目标
// targetStart 从目标的哪个位置进行拷贝
// sourceStart 从哪个字节开始拷贝
// sourceEnd 拷贝到哪个位置

// 所谓的copy就是循环buffer中的每一项放到大buffer中
Buffer.prototype.copy = function (target, targetStart, sourceStart = 0, sourceEnd = this.length) {
    for (let i = 0; i < sourceEnd - sourceStart; i++) {
        target[targetStart + i] = this[sourceStart + i];
    }
}
// a1.copy(a3, 0, 0,5); // api用不到
// a2.copy(a3, 5, 0,7); 
// console.log(a3.toString());

Buffer.concat = function (list, totalLen = list.reduce((memo, current) => memo += current.length, 0)) {
    console.log('concat')
    const bigBuffer = Buffer.alloc(totalLen);
    let pos = 0;
    list.forEach(buf => {
        buf.copy(bigBuffer, pos);
        pos += buf.length
    })
    return bigBuffer
}
console.log(Buffer.concat([a1, a2]).toString())


// const arr = [[0], 100, 200];
// const newArr = arr.slice(0, 1); //slice截取的是内存 [0xfff,100,200]
// newArr[0][0] = 100; // newArr = [0xfff]
// console.log(arr);

const b1 = Buffer.from([1, 2, 3])
const b2 = b1.slice(0, 1)
// b2[0] = 100;
// console.log(b1)

// 表单传输数据 enctype="multipart/form-data"
// 我想对数据的每一行结尾做处理
const fs = require('fs');
const path = require('path');
Buffer.prototype.split = function (sep) {
    sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep); // 将数据全部转换成buffer即可
    let r = [];
    let idx = 0;
    let offset = 0
    while (-1 !== (idx = this.indexOf(sep, offset))) {
        r.push(this.slice(offset, idx));
        offset = idx + sep.length
    }
    r.push(this.slice(offset));
    return r;
}

fs.readFile(path.resolve(__dirname, 'note.md'), function (err, data) {
    console.log(data.split('\n'))
})

// Buffer.alloc() 分配大小
// Buffer.from() 将内容转换成buffer
// Buffer.copy() 
// Buffer.concat() 拼接
// buffer.slice() 截取内存 浅拷贝 截取的是内存空间，修改会影响原buffer
// toString() 转换成字符串
// buffer.length 是字节长度
// Buffer.isBuffer() 在node中处理数据 有字符串和buffer共存的情况，为了保证不出错，我们一般全部转换成buffer来处理
// buffer.split() 基于之前的方法封装


// 发布订阅模块  mitt eventbus  subscribe  $subscribe

























// B：Byte 也就是一个字节

// b： bit， 一个二进制比特位

// 1B = 8b  一个字节等于8位

// k = 1024

// kB ：1024个字节

// kb ：1024个位

// 1MB = 1024kB = 1024 * 1024B = 1024 * 1024 * 8b

// 1kB = 1024 * 8b

// 另外，ISP所说的网络速度 1M ，2M 是指的 1Mbps, 2Mbps  这里的b是指的bit位， 指1秒（s）传递多少个二进制位
// 而我们使用下载软件(迅雷，flashget，IE浏览器下载)显示的速度是kB

// 所以2M（这里下行速率）的ADSL宽带，理论上的下行速率就应该是2 * 1024 / 8 kB / S=256kB / s
// 1M 的adsl宽带 下行速率最大就是 128kB / s 
// ————————————————

// 版权声明：本文为博主原创文章，遵循 CC 4.0 BY - SA 版权协议，转载请附上原文出处链接和本声明。

// 原文链接：https://blog.csdn.net/u012424416/article/details/64502845

console.log('====');
console.log(Buffer.from("hry").length);