const net = require('net');
const server = net.createServer(function (socket) {
    socket.on('data', function (data) { // 客户端和服务端
        socket.write('hi'); // 服务端和客户端说 hi
        console.log(data.toString());

        socket.end('');
    });
    socket.on('end', function () {
        console.log('客户端关闭')
    })
})
server.on('error', function (err) {
    console.log(err);
})
server.listen(8080); // 监听8080端口

// charless
// wireshark 抓包