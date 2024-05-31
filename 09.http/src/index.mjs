// 希望根据路径的不同 返回对应的资源
// const http = require('http');
// const fsPromises = require('fs/promises');
// const { createReadStream } = require('fs');
// const path = require('path');
// const zlib = require('zlib');
// const url = require('url');
// const chalk = require('chalk'); // 高版本  require和 import语法不兼容了....
import http from 'http'
import path from 'path'
import url from 'url'
import querystring from 'querystring'
import zlib from 'zlib'
import { createReadStream, readFileSync, stat } from 'fs'
import fsPromises from 'fs/promises'; // 内置的fs/promise
import { getNetworkInterfaces } from './utils.cjs'
// 上面是内置的模块
import chalk from 'chalk';
import mime from 'mime';
import ejs from 'ejs';
import moment from 'moment'
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename)
class Server {
    constructor(options = {}) {
        this.port = options.port;
        this.directory = options.directory
        this.template = readFileSync(path.resolve(__dirname, 'tmpl.html'), 'utf8')
    }
    cache(statObj, req, res) { // 可以根据需要设置对应的后缀来实现不同的缓存
        // 强缓存+对比缓存
        // 客户端访问我第一次来的时候 我希望30s内不要在访问我了，并且给你一个缓存的etag
        // 30s 访问都用的本地
        // 超过30s后 会像服务端发情请求 携带if-none-match，服务端和现在的etag做对比看看是否要返回新文件
        // 30s 访问都用的本地
        // ....
        // (max-age=0 每次都发请求到服务端   no-cache 每次访问服务器 )   no-store 不缓存
        res.setHeader('Cache-Control', 'max-age=30');
        const etag = statObj.ctime.getTime() + '-' + statObj.size; // 相对的靠谱
        res.setHeader('Etag', etag)
        if (req.headers['if-none-match'] === etag) { // 第二次来我要比较一下时间是否一致
            return true;
        }
        return false
        // 默认情况下对访问过的资源浏览器都会对这些资源进行缓存操作， 我可能可以基于缓存来实现缓存（对比缓存，强制缓存）

        // 协商， 默认首页是没有缓存的， 会在发送请求的时候 增加 Cache-Control: max-age=0。 max-age=0意味着一定要向服务器发请求 （取消强制缓存）
        // console.log(req.url)

        // 20s不要在向服务端发送请求了,强制缓存一般对变化不大的文件进行缓存
        // res.setHeader('Expires', new Date((Date.now() + 10 * 1000)).toGMTString());

        // 强制缓存，不会像服务端发起请求，所以用的是本地的，如果服务端文件变化了，不会生效. hash值来保证使用最新的内容

        // 协商缓存，特点就是询问服务器要不要使用缓存

        // 第一次你来我给你一个文件的最后修改时间 3:00 ,下次你来请求我带上这个时间，我来比较一下时间是否有变化


        // 最后修改时间的方案 问题？ (秒为单位) （时间是绝对时间） 如果1s内改了多次 会有可能文件变化了但是用的还是以前的
        // const ctime = statObj.ctime.toGMTString();
        // res.setHeader('Last-Modified', ctime)
        // if (req.headers['if-modified-since'] === ctime) { // 第二次来我要比较一下时间是否一致
        //     res.statusCode = 304; // 找本地缓存，文件没有改变
        //     return res.end();
        // }

        // 目的就是尽可能的缓存，但是不能出bug。直接比较前后的内容
        // const md5 = crypto.createHash('md5');
        // const etag = md5.update(readFileSync(assetsUrl, 'utf8')).digest('base64')


        // res.setHeader('Etag', etag); // 最靠谱的但是问题在于得读取

        // const etag = statObj.ctime.getTime() + '-' + statObj.size; // 相对的靠谱
        // res.setHeader('Etag', etag)
        // if (req.headers['if-none-match'] === etag) { // 第二次来我要比较一下时间是否一致
        //     res.statusCode = 304; // 找本地缓存，文件没有改变
        //     return res.end();
        // }

        // expires 本地时间和服务端的时间可能不一致，导致缓存出问题
        // console.log( new Date((Date.now() + 10 * 1000)).toGMTString())

    }
    compress(req, res) {
        const encoding = req.headers['accept-encoding']
        if (encoding) {
            if (encoding.includes('gzip')) {
                res.setHeader('Content-Encoding', 'gzip')
                return zlib.createGzip()
            } else if (encoding.includes('deflate')) {
                res.setHeader('Content-Encoding', 'defalte')
                return zlib.createDeflate()
            } else if (encoding.includes('br')) {
                res.setHeader('Content-Encoding', 'br')
                return zlib.createBrotliCompress();
            }
        }
    }
    sendFile(assetsUrl, req, res, statObj) {
        if (this.cache(statObj, req, res)) {
            res.statusCode = 304;
            return res.end();
        }
        const fileType = mime.getType(assetsUrl) || 'text/plain';
        res.setHeader('Content-Type', fileType + ';charset=utf-8')

        let stream;
        if (stream = this.compress(req, res)) {
            createReadStream(assetsUrl).pipe(stream).pipe(res); // 处理大文件，可以制定读取文件内容
        } else {
            createReadStream(assetsUrl).pipe(res); // 处理大文件，可以制定读取文件内容
        }

    }
    sendError(assetsUrl, req, res) {
        console.log(`cannot found ${assetsUrl}`);
        res.statusCode = 404;
        res.end('Not found')
    }
    async processDir(accessUrl, pathname, req, res, statObj) {
        try {
            const assetsUrl = path.join(accessUrl, 'index.html')
            await fsPromises.stat(assetsUrl);
            this.sendFile(assetsUrl, req, res, statObj);
        } catch {
            const dirs = await fsPromises.readdir(accessUrl); // 将访问的路径的子目录列举出来
            const tmplStr = ejs.render(this.template, {
                dirs: await Promise.all(dirs.map(async dir => {
                    const statInfo = await fsPromises.stat(path.join(accessUrl, dir))
                    return {
                        url: path.join(pathname, dir),
                        dir,
                        size: statInfo.size,
                        ctime: moment(statInfo.ctime).format('YYYY-MM-DD hh:mm:ss')
                    }
                }))
            })
            res.setHeader('Content-Type', 'text/html;charset=utf-8')
            res.end(tmplStr);
        }
    }
    async processData(pathname, req, res) {
        const mockFilePath = path.join(this.directory, 'mock/index.js');
        try {
            let { default: plugin } = await import(mockFilePath)
            return plugin(pathname, req, res);
        } catch (e) {
            return false; // 没有匹配到静态服务
        }
    }
    cors(req, res) { // 协商
        if (req.headers.origin) { // 此时跨域了
            // cookie 跨域需要提供确切的origin , 不能用*, 谁访问我我就允许谁来访问
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type,token,authorization');
            res.setHeader('Access-Control-Max-Age', 20); // 20s内不在发送options请求
            res.setHeader('Access-Control-Allow-Methods', 'DELETE,PUT')
            if (req.method === 'OPTIONS') {
                res.end(); // 可以访问， 就结束了，就会发送真正的请求了 
                return true
            }
        }
    }
    handleRequest = async (req, res) => {
        const { pathname, query } = url.parse(req.url, true); // /xxx
        // 获取文件的状态信息
        const accessUrl = path.join(this.directory, decodeURIComponent(pathname))

        // 自己定义跨域头 
        const isOption = this.cors(req, res)
        if (isOption) return;

        req.query = query; // 将解析后的查询参数绑定到req上
        req.body = await new Promise((resolve, reject) => {
            const arr = []
            req.on('data', function (chunk) {
                arr.push(chunk)
            })
            req.on('end', function () {
                const payload = Buffer.concat(arr).toString(); // 当前用户传递的请求体数据 
                // payload的类型？ 字符串，对象，查询字符串
                if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                    // 按照表单格式来处理数据  a=1&b=2&c=3  /([^=&]+)=([^=&]+)/g   qs
                    // 将解析后的对象赋予给req.body属性
                    resolve(querystring.parse(payload))
                } else if (req.headers['content-type'] === 'application/json') {
                    resolve(JSON.parse(payload))
                } else if (req.headers['content-type'] === 'text/plain') {
                    resolve(payload)
                }
                resolve({});
            })
        })
        // 我们这里是先判断是不是动态的接口，在看能否匹配到静态服务
        let flag = await this.processData(pathname, req, res);
        if (flag) { return }
        try {
            const statObj = await fsPromises.stat(accessUrl);
            // 获取文件是否存在
            if (statObj.isFile()) {
                this.sendFile(accessUrl, req, res, statObj)
            } else {
                // 这里是文件夹 需要看文件夹下是否有index.html ， 如果有返回没有则展示当前目录下所有的文件列表
                this.processDir(accessUrl, pathname, req, res, statObj)
            }
        }
        catch (e) {
            console.log(e)
            this.sendError(accessUrl, req, res);
        }
    }
    start() {
        const server = http.createServer(this.handleRequest);
        server.listen(this.port, () => {
            console.log(`${chalk.yellow('Starting up http-server, serving')} ${chalk.green(path.relative(__dirname, this.directory))}`)
            console.log(`Available on:`)
            getNetworkInterfaces().map(address => console.log(' ' + chalk.green(`http://${address}:${this.port}`)))
        })
    }
}
// 静态服务为了哪个目录提供的 
// new Server({
//     port: 3000,
//     directory: process.cwd(), // 在哪里启动服务就以这个目录为准
// }).start()

export default Server