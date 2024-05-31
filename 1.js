// let fs = require('fs')
// let path = require('path')

// let rs = fs.createReadStream(path.resolve(__dirname, "big.txt"), { encoding: 'utf-8', })
// const arr = [];

// rs.on('open', function (fd) {
//     console.log(fd)
// })
// rs.on('data',(data)=>{
//     console.log("==读取的内容==", data);
//     arr.push(data)
// })

// rs.on('end',()=>{
//     console.log('arr', arr.length);
// })


process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        process.stdout.write(`data: ${chunk}`);
    }
});

process.stdin.on('end', () => {
    process.stdout.write('end');
});