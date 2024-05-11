const fs = require('fs');
const path = require('path')
// const rs = fs.createReadStream(path.resolve(__dirname, 'test.md'), {
const ReadStream = require('./ReadStream')
const rs = new ReadStream(path.resolve(__dirname, 'test.md'), {
    // fs.open(this.emit('open'))  fs.read(this.emit('data'))  fs.close
    flags: 'r', // fs.open(flags)
    encoding: null, // 标识读取的编码就是buffer格式
    mode: 0o666,
    autoClose: true, // 关闭文件 fs.close
    emitClose: true, // 触发关闭事件 this.emit('close')
    start: 0,
    end: 4, // 我要读取索引从0开始到索引为5的位置
    highWaterMark: 2 // 控制读取的速率，字节单位  默认64k
});
rs.on('open', function (fd) {
    console.log(fd)
})
const arr = [];
rs.on('data', function (chunk) { // 可以监听data事件会让非流动模式变为流动模式
    arr.push(chunk);
    console.log(chunk)
    rs.pause(); // 暂停读取操作，这个时候可能我要消费读取到的数据
})
rs.on('end', function () { // 可以监听data事件会让非流动模式变为流动模式
    console.log(Buffer.concat(arr).toString())
})
rs.on('close', function () {
    console.log('close')
})
rs.on('error', function (err) {
    console.log('error')
})

setInterval(() => {
    rs.resume()
}, 1000);

// open 和 close 是针对文件来说的，这两个方法不输于可独流
// 可独流都拥有 on('data')  on('end') 就是一个可独流  pause()  resume()