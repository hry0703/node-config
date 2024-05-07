const path = require('path');
const fs = require('fs');
const vm = require('vm')
function Module(id) {
    this.id = id;
    this.exports = {}
}
Module._extensions = {
    '.js'(module) {
        const content = fs.readFileSync(module.id, 'utf8');
        const fn = vm.compileFunction(content, ['exports', 'require', 'module', "__filename", "__dirname"]);
        // this -> module.exxports
        const exports = module.exports
        let thisValue = exports
        let require = req;
        let filename = module.id;
        let dirname = path.dirname(filename)
        // 让函数执行  module.exports = 'hello'
        // fn.apply(this)
        // 执行某个函数，this是谁，参数是谁
        console.log(fn.toString())
        Reflect.apply(fn, thisValue, [exports, require, module, filename, dirname])
    },
    '.json'(module) {
        const content = fs.readFileSync(module.id, 'utf8');
        module.exports = JSON.parse(content);
    },
}
Module._resolveFilename = function (id) {
    const filename = path.resolve(__dirname, id);
    if (fs.existsSync(filename)) {
        return filename
    }
    const keys = Object.keys(Module._extensions);
    for (let i = 0; i < keys.length; i++) { // 尝试添加后缀
        const ext = keys[i];
        const filename = path.resolve(__dirname, id + ext)
        if (fs.existsSync(filename)) {
            return filename
        }
    }
    throw new Error('cannot found module')
}
Module.prototype.load = function () {
    let ext = path.extname(this.id)
    Module._extensions[ext](this)
}
Module._cache = {}
function req(id) {
    const filename = Module._resolveFilename(id)
    let existsModule = Module._cache[filename]
    if (existsModule) { // 说明模块加载过
        return existsModule.exports
    }
    const module = new Module(filename); // 这个对象里最重要的就是exports对象
    Module._cache[filename] = module; // 加载过缓存起来
    module.load()
    return module.exports; // 导出这个对象
}
let a = req('./a.js'); // require拿到的是module.exports的结果如果是引用对象里面的内容变化了重新require可以拿到最新的
console.log(a);

// this 和 module.exports 也是同一个值，可以互相调用
// let exports = module.exports = {}
// ✅ =》exports.a = 100;
// ❌ => exports = { a: 1 } 用户不能直接改变exports的引用，因为不会导致module.exports的变化
// return module.exports
// commonjs 中如果有默认导出，那么属性导出是无效的


// 导出的方式 this.xxx  exports.xxx  module.exports.xxx  module.exports 导出


// 直接采用vscode来进行调试


// 1.调用的是require方法
// 2.加载模块 Module._load
// 3.通过Module._resolveFilename 核心就是给我们的路径添加后缀 （会帮我们转成绝对路径）
// 4.如果这个文件被加载过，走缓存，否则再去加载模块
// 5.加载模块的核心就是创建一个模块的实例  new Module() -> {id:文件,exports:模块导出结果是什么}
// 6.将模块缓存起来
// 7.要加载文件要看加载的文件的扩展名是什么.js / .json
// 8.根据扩展名找到对应的加载方案 （策略） 加载js的策略
// 9.js的加载就是读取文件内容
// 10.就是给内容包装一个函数，让这个函数执行 （代码里面肯定会给module.exports 赋值）

// 猜测：6.读取文件并且给这个exports赋值


// require方法 最终返回的是module.exports, 用户只要将结果放到module.exports上就可以获取到了

