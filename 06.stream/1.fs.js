const fs = require('fs');

const path = require('path');

// 希望将文件拷贝 拷贝出一份新的来

// 1) 读取的文件不存在会报错
// 2) 写入的时候如果文件不存在会创建，而且如果存在则会清空文件的内容
// fs.readFile(path.resolve(__dirname, 'test.md'), function (err, data) {
//     if (err) return console.log(err)
//     fs.writeFile(path.resolve(__dirname, 'copy.md'), data, function (err) {
//         console.log('write ok')
//     })
// })
// 文件的读写 如果相对于内存来说的话 就是反过来的  读取文件其实是像内存中写入 ， 要是写入内容，将数据读取出来
// 内存的空间是有限的，数据过大，都写入到内存（淹没可用内存）  64k以下的文件可以采用readFile

// 如果大文件 不能采用readFile来读取


// node中提供了手动读取的方式 （api）


// 1)  打开   2）指定读取的位置  3） 关闭文件

// flags 
// r: 我打开文件的目的是读取文件
// w; 我打开文件的目的是写入
// a: 我们打开文件是追加内容的append方法  
// r+: 如果文件不存在会报错， 具备读取和写入的能
// w+: 如果文件不存在会创建， 具备读取和写入的能

// 权限位置 8禁止
// 二进制的组合 ： 权限的组合  1用户的执行操作  2用户的写入操作  4用户的读取操作   位运算
// chmod -R 777
// 001 | 010  按位或可以将权限组合起来  011

// 001 
// 010
// 100
// 111

// 001  
// 010
// 100
// 1000 

// 按照位来做组合 ，可以将权限组合起来

function copy(source, target, cb) {
    const buf = Buffer.alloc(3);
    fs.open(source, 'r', function (err, rfd) {
        if (err) return cb(err)
        // fd就是文件描述符 linux 中的一个标识符  number类型
        // 将这个文件中的数据读取到这个buffer中，从buffer的第0个开始写入，写入三个，读取的文件位置是0
        fs.open(target, 'w', function (err, wfd) {
            if (err) return cb(err)
            let readPosition = 0;
            let writePosition = 0;
            function close() {
                let i = 0;
                function done() {
                    if (++i === 2) {
                        return cb()
                    }
                }
                fs.close(rfd, done);
                fs.close(wfd, done)
            }
            function next() {
                fs.read(rfd, buf, 0, 3, readPosition, function (err, bytesRead) {
                    if (err) return cb(err)
                    if (bytesRead == 0) {
                        return close()
                    } else {
                        // bytesRead 我读取10个字节但是只读取到了1个 这个时候 我们需要获取到真实读取的个数
                        // console.log(buf); // 打开文件之后可以自己决定读取文件的位置
                        readPosition += bytesRead
                        // 将buffer的第个位置开始的3个字节写入到文件的第0个字节的位置
                        fs.write(wfd, buf, 0, bytesRead, writePosition, function (err, written) {
                            if (err) return cb(err)
                            writePosition += written;
                            next()
                        })
                    }
                })
            }
            next()
        })
    })
}
copy(path.resolve(__dirname, 'test.md'), path.resolve(__dirname, 'copy.md'), function () {
    console.log('copy ok')
})


// 缺点回调地狱 （采用发布订阅模式 进行代码的解构）
// 打开操作其实读写没关系 （我们可以开发出两套api，分别针对读和写的）

// 我们可以控制读取的速度 （控制读取的速率，和写入的速率） 读取一点写入一点
// node中的流？ （我们可以控制速度并且决定是否继续读取或者写入）
// gulp -> 转化 css -> 前缀处理 -> 压缩  （控制速率防止淹没内存）

// 流 》 文件流（fs）
// 流 》 自己的流
// 流 》 压缩流