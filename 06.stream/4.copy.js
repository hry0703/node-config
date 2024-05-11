
const fs = require('fs');
const path = require('path');

const rs = fs.createReadStream(path.resolve(__dirname, 'test.md'), {
    highWaterMark: 4
})
const ws = fs.createWriteStream(path.resolve(__dirname, 'copy.md'), {
    highWaterMark: 2
})
function pipe(rs, ws) {
    rs.on('data', function (data) { // 收支不平衡，不能保证读取完毕就写入完毕  this.read()
        let flag = ws.write(data); // 写入后看是否到达预期
        if (!flag) { // 意味着已经超过预期了，如果继续调用ws.write 会导致淹没可用内存，同时也不要在读取文件了
            rs.pause()
        }
    })
    rs.on('end', function () {
        ws.end(); // 会等待文件写入完毕后关闭文件
    })
    ws.on('drain', function () {
        console.log('等待写入完毕后 ，继续读取')
        rs.resume();
    })
}
// pipe(rs,ws)
rs.pipe(ws); // 此方法是异步的 缺点就是不关注过程。 他是会控制速率的  管道


// fs.readFile 不能操作大文件
// 大文件采用流的方式 （如果是文件可以采用文件流 ）
// 文件的可独流 on('data') on('end')
// 文件的可写流 write()    end()