// 掌握fs中常用的api

// 我们的需求就是删除某个文件夹，来掌握常用的api

const { constants } = require('buffer');
const fs = require('fs');
const path = require('path');
// fs.stat 获取文件的状态信息， isFile()   isDirectory()
// fs.unlink 删除文件
// fs.mkdir 
// fs.rmdir
// fs.readdir() 读取儿子级别的目录
// fs.stat(path.resolve(__dirname, 'a'), function (err, statObj) {
//     if (statObj.isFile()) {
//         fs.unlink(path.resolve(__dirname, 'a/c'), () => { })
//     } else {
//         // fs.rmdir(path.resolve(__dirname, 'a'), {recursive:true},function (err,dir) {
//         //     console.log("err", err, dir);
//         // })
//         fs.readdir(path.resolve(__dirname, 'a'), { recursive: true }, function (err, dir) {
//             console.log("err", err, dir);
//         })
//     }
// })

// function rmdirSync(directory) {
//     const statObj = fs.statSync(path.resolve(__dirname, directory))
//     if (statObj.isFile()) { // 文件是直接移除，目录需要读取儿子
//         fs.unlinkSync(directory)
//     } else {
//         let dirs = fs.readdirSync(directory)
//         // 递归删除, 如果是文件夹则递归删除，文件直接删除
//         dirs = dirs.map(item => rmdirSync(path.join(directory, item)));
//         fs.rmdirSync(directory)
//     }
// }
// rmdirSync('a'); // 同步删除




// 如果是异步的话如何删除， 树， 树的遍历方式有2种 （层序遍历，深度遍历（先序、后，中））

// webpack 异步串行， 异步并行
// function rmdir(directory,callback) {
//     fs.stat(directory, (err,statObj) => {
//         if (statObj.isFile()) {
//             fs.unlink(directory,callback)
//         } else {
//             fs.readdir(directory, (err,dirs) => {
//                 dirs = dirs.map(item => path.join(directory, item));
//                 let index = 0;
//                 function next() {
//                     if (dirs.length === index) { // 儿子删除完毕后删除自己
//                         return fs.rmdir(directory,callback)
//                     }
//                     let dir = dirs[index++];
//                     // 先删除第一个 ，将下一个删除操作传入进去
//                     rmdir(dir, next);
//                 }
//                 next();
//             })
//         }
//     })
// }

function rmdir(directory, callback) {
    fs.stat(directory, (err, statObj) => {
        if (statObj.isFile()) {
            fs.unlink(directory, callback)
        } else {
            fs.readdir(directory, (err, dirs) => {
                if (dirs.length === 0) return fs.rmdir(directory, callback)
                dirs = dirs.map(item => path.join(directory, item));
                let index = 0;
                function done() {
                    if (++index === dirs.length) {
                        fs.rmdir(directory, callback)
                    }
                }
                dirs.forEach(dir => rmdir(dir, done))
            })
        }
    })
}

// function rmdir(directory) {
//     return new Promise((resolve, reject) => {
//         fs.stat(directory, (err, statObj) => {
//             if (statObj.isFile()) {
//                 fs.unlink(directory, resolve)
//             } else {
//                 fs.readdir(directory, (err, dirs) => {
//                     dirs = dirs.map(item => rmdir(path.join(directory, item)));
//                     Promise.all(dirs).then(() => {
//                         fs.rmdir(directory, resolve)
//                     })
//                 })
//             }
//         })
//     })
// }

// const fsPromises = require('fs/promises')
// async function rmdir(directory) {
//     const statObj = await fsPromises.stat(directory)
//     if (statObj.isFile()) {
//         return fsPromises.unlink(directory)
//     } else {
//         let dirs = await fsPromises.readdir(directory)
//         dirs = dirs.map(item => rmdir(path.join(directory, item)));
//         await Promise.all(dirs)
//         return fsPromises.rmdir(directory)
//     }
// }

// 层序遍历的方式来删除目录，自己写后台管理系统前端格式化会经常采用这种方案


// rmdir('a').then(function () {
//     console.log('删除成功')
// })


// 层序遍历

function rmdirSync(directory) {
    let index = 0;
    let stack = [directory];
    let current;
    while (current = stack[index++]) {
        let statObj = fs.statSync(directory);
        if (statObj.isFile()) {
            fs.unlinkSync(current); // 文件直接删除
        } else {
            stack = [...stack, ...fs.readdirSync(current).map(item => path.join(current, item))]
        }
    }
    let i = stack.length;
    while (i--) {
        fs.rmdirSync(stack[i])
    }
}
rmdirSync("a");

// 异步实现我们近可能采用 async + await + promise来实现
// fs.stat fs.unlink fs.readdir ....