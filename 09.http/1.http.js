const http = require('http');
const url = require('url')

// 请求方法 restful风格 根据我们的请求方法来决定对资源的操作 
//  get /user 获取  post增加 /user  put 修改 /user  delete 删除 /user
//  /getUser /getOneUser /addUser /deleteUser /deleteOneUser

// 普遍在开发的时候 所有接口都采用post请求，options 试探请求 跨域的时候出现  预检请求
// (跨域出现)简单请求不会发送预检请求（get，post 就是简单请求 如果增加了自定义的header此时就会变成复杂请求）

// (get / post) /delete /put / options

// node中的主线程是单线程了，请求来了后，会进行处理，后面的请求要等待前面的处理完毕后，才能得到处理

// 状态码
// 1:  101 websocket
// 2:  200 成功 204 成功了但是没有响应体 206 分段传输（拿到内容的部分数据）
// 3:  301 永久重定向 302 临时重定向  304 缓存相关 协商缓存 
// 4:  400 参数传递有问题 401没登录 403登录没权限  404找不到  405 方法不允许
// 5:  500服务端错误 502 

// favicon.ico 每个网站都要有一个这样的图标 （我们控制不了这个请求，自动发送的）

// req代表客户端的请求（请求相关的信息）
// res代表的事服务端的响应
console.log( url.parse('http://username:password@host:3000/pathname?query#hash'))
const server = http.createServer((req, res) => {
    // 请求行
    console.log(req.method); // 方法名字都是大小
    // 路径 http://username:password@host:port/pathname?query#hash
    const { pathname, query } = url.parse(req.url, true);
    console.log(pathname, query)
    console.log(req.httpVersion)
    // 请求头：
    console.log(req.headers); // node 中将header的key 全部转成了小写
    if (pathname === '/sum') { // 在node中这种代码可以通过子进程转换成进程间通信进行处理，不应该放在主线程中会阻塞代码
        let sum = 0
        for (let i = 0; i < 100000000000; i++) {
            sum += i;
        }
        res.end(sum + '')
    } else {
        // 解析请求参数  http 模块是基于net模块的，他会增加 header来进行处理

        // http模块是基于net模块的，会将接收到的客户信息，存储到req中

        // 请求体：
        const arr = []
        req.on('data', function (chunk) { // 如果有请求体则会进入到on('data') this.push()
            arr.push(chunk)
        });
        req.on('end', function () { // this.push(null)
            console.log(Buffer.concat(arr).toString(), 'end')
        })
        // 内部创造一个可独流， 将解析的header，行的信息直接放到了req上，请求体放到了流中



        // 相应也分为这几个部分
        // 响应行
        // 状态码由服务端来设置，可以随意设置但是一般 都是按照浏览器规范来设置
        res.statusCode = 200;
        // res.statusMessage = 'my define';

        res.setHeader('Content-Type', 'text/plain;charset=utf-8') 

        res.write('中文');
        // res.write('中文');
        res.end('12');
        // 响应头
        // 相应体
        // 请求行 GET /xxx http/1.1
        // 请求头
        // 请求体
    }



});
let port = process.env.PORT || 4000;
server.listen(port, function () {
    console.log('server start ' + port)
});
server.on('error', function (err) {
    if (err.code === 'EADDRINUSE') { // 端口被占用, 自动端口+1
        server.listen(++port)
    }
})
// 每个系统有对应的设置环境变量的方式  cross-env 来设置启动的端口。 通过环境变量的方式来设置


// 本地开发一般采用nodemon， node的监视器监视文件的变化 
// 上线的时候我们会采用pm2
// 文件保存后可以自动重启