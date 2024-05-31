const fs = require('fs');
const path = require('path');
const {
    Writable,
    Stream
} = require('stream');

// 父类 write
// 子类 _write

class MyWriteStream extends Writable {
    _write(data, encoding, callback) {
        console.log(data);
        callback(); // 调用callback 会清空后续的逻辑，不调用则停止
    }
}
const mws = new MyWriteStream();
mws.write('ok') // 第一次是像文件中写入
mws.write('ok') // 放到了缓存里
mws.write('ok') // 放到了缓存里

console.log(mws instanceof Stream); // 判断类型是不是流