const { Readable, Writable, Duplex, Transform } = require('stream')

// node中可以实现进程间通信，通信就可以通过流来通信 (进程通信就通过这三个方法)

// process.stdin // 标准输入，用户输入的内容会触发此方法
// process.stdout
// process.stderr


// process.stdin.on('data', function (chunk) { // 读取用户的输入
//     process.stderr.write(chunk); // 标准输出 底层和console一个方法
// })

// class MyTransfrom extends Transform{
//     _transform(chunk,encoding,callback) { // 参数是可写流的参数
//         // 将处理后的结果 可以使用push方法传给可读流
//         this.push(chunk.toString().toUpperCase())
//         callback()
//     }
// }
// const transform = new MyTransfrom
// process.stdin.pipe(transform).pipe(process.stderr)

// const zlib = require('zlib');
const fs = require('fs');  // gzip压缩 将重复的内容尽可能的替换，重复率越高压缩效果越好

// fs.readFile
// fs.createReadstram
// const rs = fs.createReadStream('./1.txt')
// const ws = fs.createWriteStream('./1.txt.gz')
// rs.pipe(zlib.createGzip()).pipe(ws)


const crypto = require('crypto');
const rs = fs.createReadStream('./1.txt')
const ws = fs.createWriteStream('./2.txt')
// 加密 和 摘要不一样 （加密表示可逆，摘要是不可逆的）
// 典型的摘要算法 md5 

// 1.md5 相同的内容摘要的结果一定是相同的
// 2.如果内容有差异结果会发生 很大变化，雪崩效应
// 3.无法反推
// 4.就是不同的内容摘要的长度相同
// console.log(crypto.createHash('md5').update('abc').update('d').update('e1').digest('base64'))
const md5 = crypto.createHash('md5');
md5.setEncoding('base64')
rs.pipe(md5).pipe(ws); // 做转化的


// 能读也能写 内部需要实现 _read 和 _write

// class MyDuplex extends Duplex{
//     constructor() {
//         super()
//         this.data = ''
//     }
//     _read() {
//         // 读取走这里
//         console.log('读取');
//         this.push(this.data)
//         this.push(null); // 没有放入数据 所以没有触发dta
//     }
//     _write(chunk) {
//         // 写入走这里
//         this.data = chunk
//     }
// }
// const myDuplex = new MyDuplex
// myDuplex.on('data', function (chunk) {
//     console.log(chunk)
// })
// myDuplex.on('end', function () {
//     console.log('end')
// })
// myDuplex.write('ok');

// 双工 能读能写

