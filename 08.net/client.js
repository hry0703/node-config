const net = require('net');
const socket = new net.Socket(); // 套接字 可以创建一个tcp链接通过socket来进行通信.流： tcp的套接字就是双工流
// 连接8080端口
socket.connect(8080, 'localhost');
// 连接成功后给服务端发送消息
socket.on('connect', function (data) {
    socket.write('hello'); // 浏览器和客户端说 hello
    // socket.end()
});
socket.on('data', function (data) {
    console.log(data.toString())
})
socket.on('error', function (error) {
    console.log(error);
});

// 读取客户端数据 可独流
// 给服务端写数据 可写流