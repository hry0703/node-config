// node中和浏览器的差异 
const path = require('path')
// node中的全局对象 global, global中的属性可以直接在任何模块下访问
// 有些人会把mysql的实例放到global上. 不建议这样使用，会污染全局变量
// 有一些属性不在global上也可以直接被访问 exports module.exports require __dirname __filename


// process
// Buffer
// setImmediate
// setTimeout
// console.log(Object.keys(process, { showHidden: true }))

// platform  windows 下 还是mac下   
// cwd
// env
// argv
// nextTick


// 我们编写前端工具 需要做一些系统配置文件，可以通过平台来区分，系统文件存到哪里
// console.log(process.platform); // darwin mac , 若果是window win32

// cwd叫当前的工作目录，会随着命令的执行位置而变化
// console.log(process.cwd(), path.resolve()); // 等价方法 resolve方法就是根据cwd来解析的

// 不同的平台设置方式不一样 mac export来设置，windows 下用set来进行设置
// console.log(process.env.a); // 区分环境变量
// 链接数据库，在本地了路径要是 localhost 生产环境 是192.xxx.xxx.xxx


// console.log(require('dotenv').config()); // 如果你想自己实现这个功能 

const fs = require('fs');
const env = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf8')

const obj = {}
env.replace(/(.+)=(.+)/g, function () {
    obj[arguments[1]] = arguments[2]
})
Object.assign(process.env, obj); // 可以用来解析.env 将结果赋予给process.env上
// console.log(process.env, 42)



// .env.production  npm run build  （export env=production && node corejs） 真正的对应关系是看你自己如何设定
// .env.development npm run dev



// console.log(process.argv); // 运行参数  两个参数 node的可执行文件。 第二个参数是要执行的这个文件是谁

// 简写 -p  --port 
// 简写 -c  --config

// const opts = {};
// process.argv.slice(2).reduce((memo, current, currentIndex, array) => {
//     if (current.startsWith('--')) {
//         memo[current.slice(2)] = array[currentIndex + 1]
//     }
//     return memo
// }, opts); // 手动解析参数，需要根据自己的规范来解析比较麻烦

// console.log(opts)


// vue-cli webpack  vite .....
// yargs  minimist   commander


// 自己编写脚手架 基于这个模块来实现
const { program } = require('commander')
const pkg = require('./package.json') // vue create xxx  --a 1
program.name(pkg.name)
program.usage('<command> [options]'); // <> 是必传  [] 选填写

program
    .command('create')
    .option('-d, --directory <directory>', 'create project')
    .action((args) => {
        console.log(args, 'create')

    }).on('--help', () => console.log(pkg.name + ' create directory '))
program
    .command('serve')
    .option('-p, --port [port]', 'set port', 3000)
    .action((args) => {
        console.log(args, 'create')

    }).on('--help', () => console.log(pkg.name + ' create serve port '))
program.parse();

// node中实现的微任务 , node中10以上的版本执行和浏览器是一样的

// 一个宏任务执行完毕后会清空所有微任务.

/* 我们调用的nodeapi 都是交给我们libuv库来去实现的， 通过阻塞i/o来实现 异步
 通知完成的方式就是事件驱动
   ┌───────────────────────────┐
┌─>│           timers          │ 放定时器
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ 上一轮没执行完的在这来执行
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ 内部使用
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │  文件读写回调再这里来执行
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │ 执行setImmiedate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │ socket.close()
   └───────────────────────────┘
*/
// 当主栈执行完后 会按照顺序依次执行 timers(setTimeout) ->  poll(fs.方法的回调) ->  check(setImmediate)

// 当代码执行完毕后 ，会从timer-> poll 检测poll里面是否都执行完毕了。 检测一下有没有setImmeidate
// 如果有则执行setImmdiate 如果没有则在这里阻塞

// node中只是将宏任务进行了划分 划分到了不同的宏任务队列中。
// 微任务也是在每个宏任务执行完毕后 才清空的.

// process.nextTick 并不是微任务 ，每个宏任务执行完后会执行nextTick(比nextTick的优先级更高) 

// https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick