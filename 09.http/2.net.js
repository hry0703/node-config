const net = require('node:net');
const server = net.createServer((socket) => {
    // 'connection' listener. 


    // http是纯文本 (纯文本描述有缺陷 Host  host? 0,1)
    // const arr = []
    // socket.on('data', function (chunk) {
    //     arr.push(chunk);
    // })
    // socket.on('end', function () {
    //     console.log(Buffer.concat(arr).toString())
    // })
    socket.write(`HTTP/1.1 200 ok
Content-Length: 3
Content-Type: text/plain

jw13
`)
    socket.end();

});
server.on('error', (err) => {
    throw err;
});
server.listen(8124, () => {
    console.log('server bound');
});