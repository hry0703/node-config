const fs = require('fs');
const path = require('path');
const WriteStream = require('./WriteStream')
const ws = new WriteStream(path.resolve(__dirname, 'copy.md'), {
    // const ws = fs.createWriteStream(path.resolve(__dirname, 'copy.md'), {
    flags: 'w',
    mode: 0o666,
    autoClose: true,
    emitClose: true,
    start: 0,
    highWaterMark: 3
});
let idx = 0;
function write() {
    if (idx < 10) {
        let flag = ws.write(idx++ + '');
        console.log(flag);
        if (flag) {
            write();
        }
    } else {
        // end - write + close
        ws.end('结束');
    }
}
write();
ws.on('open', function (fd) {
    console.log(fd)
})
ws.on('drain', function () {
    console.log('抽干');
    write();
});

// on('data') on('end')
// write()  end()

// rs.pipe(ws)