const fs = require('fs');
const path = require('path');
const WriteStream = require('./WriteStream')
const ReadStream = require('./ReadStream');
const ws = new WriteStream(path.resolve(__dirname, 'copy1.md'), {
    flags: 'w',
    mode: 0o666,
    autoClose: true,
    emitClose: true,
    start: 0,
    highWaterMark: 1
});
const rs = new ReadStream(path.resolve(__dirname, 'copy.md'), {
    flags: 'r',
    mode: 0o666,
    autoClose: true,
    emitClose: true,
    start: 0,
    highWaterMark: 4
});
rs.pipe(ws);