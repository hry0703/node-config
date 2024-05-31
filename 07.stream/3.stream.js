// 之前咱们说的流是基于 fs的 ， 其实 有一个单独的模块叫Stream

// fs 中的流是基于stream进行重写的 

const fs = require('fs');
const path = require('path');

const { Readable } = require('stream');
class MyReadStream extends Readable {
    _read() {
        fs.readFile(path.resolve(__dirname, 'copy.md'), (err, chunk) => {
            this.push(chunk);
            this.push(null); // push null 就表述数据已经读取完毕了会触发end事件
        })
    }
}
const mrs = new MyReadStream();
mrs.on('data', function (chunk) {
    console.log(chunk)
})
mrs.on('end', function () {
    console.log('end')
})
// 父类 Readable.prototype  read -> this._read()


// 父类中拥有一个 read方法，会调用子类的_read ， push （emit('data')事件）
// 子类创建后，用户会监听on('data')事件 , 会调用父类的read，同时调用了子类的_read(fs.read).读取到的内容会调用父类的push方法

// 子 new ReadStream  ReadStream.prototype._read = function(){}
// const rs = fs.createReadStream(path.resolve(__dirname, 'copy.md'), {
//     flags: 'r',
//     mode: 0o666,
//     autoClose: true,
//     emitClose: true,
//     start: 0,
//     highWaterMark: 4
// });

// rs.on('data', function (chunk) {
//     console.log(chunk)
// })


// 实现子类重写父类
// class Parent {
//     read() {
//         console.log('parent read')
//         this._read();
//     }
//     _read() {
//         console.log('parent 自己实现的read')
//     }
// }
// class Child extends Parent{
//     _read() {
//         console.log('child 重写了父类的方法')
//     }
// }
// const c = new Child();
// c.read();