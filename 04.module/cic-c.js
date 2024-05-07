const a = require('./cic-a');
const b = require('./cic-b');

a.saveModule(b);
b.saveModule(a);

// 在a中使用b的方法

a.fn(); //a使用了b
b.fn(); //b使用了a

// 模块有自己的加载方式  原生模块 第三方模块  路径没有./ 或者../的就是原生模块或者第三方
// loadNativeModule  paths

// 1) 如果引入的模块是一个内置模块，直接返回即可, 从自己的目录递归向上查找是否存在模块
// 2) 找到了node_module 则会找到文件夹下同名的文件夹，看这个文件夹里的package.json , main.js
// 3) 文件模块，通过./ ../引入，或者绝对路径引入的资源。 如果文件不存在会尝试添加.js .json .node
// 4) 如果仍然未找到就报错了 

console.log(require('./a')); // 相对路径会先找文件，再去找文件夹 _resolveFilename

// 尽量避免模块的文件名和文件夹重名  



// 我们第三方模块一般都是安装到node_modules下的，不是自己建的
// npm 当我们安装node的时候 自动赠送给你的

// yarn cnpm pnpm (不能混用)

// npm init  帮我们自动初始化一个package.json 记录安装的依赖和我们当前包的信息 （包：多个模块组成的叫包 + package.json）


// 初始化package.json之后, 就可以安装模块
// 模块安装有两种方式  全局安装（全局安装是只能在命令行中使用，不是在项目中使用），本地安装(在项目中使用的)

// sudo npm install mime -g  （不能再代码中使用）
// npm config list 查看安装后的目录  /usr/local/bin 放的所有的安装脚本
// windows 想让命令可以再全局下执行 需要配置全局环境变量

// mime -> 找PATH对应的路径，如果在里面则执行对应的命令


// 自己编写一个全局模块. 需要先起一个包名(唯一的)
// 写一个bin作为入口指定执行的文件  (开发的时候我们想测试 可以采用npm link命令将包创建一个软链，连接到全局下)  
// 需要给入口添加一个执行名 #! /usr/bin/env node  link 可以连接到全局下，也可以将某个包拉到本地下面
// 全局包编写需要指定bin的入口，和增添文件的执行方式即可. 


// 本地包 可以在代码中使用
// --save 就是开发+上线都需要的 dependencies
// --save-dev 开发时需要，上线不需要  devDependencies
// npm install gulp --save-dev


// 项目依赖 dependencies
// 开发依赖 devDependencies
// 同等依赖 peearDependencies 要求你安装但是不安装也不报错
// 爱装不装 optionDepencies 
// 打包依赖 捆绑打包 
// 也可以不区分依赖 全部安装成项目依赖（不建议这样）

// 版本管理 
// major.minor.patch 主版本 小版本 补丁版本  semver 一个版本规范，用来描述版本的

// 预发版本 做测试的 
// 1.0.0-alpha.4  内部测试的
// 1.0.0-beta.1 公开测试
// 1.0.0-rc.2  马上可以正式发布了 目前版本是rc

// 版本号标识符 ^2.2.0 意味着只能是2 不能是1，3    ~1.1.0 限制了 只能是 1.1开头的
// >=2.2.0 <=2.2.0  1.0.0-2.0.0

// scripts 设置执行脚本 ，设置后可以通过 npm run 来执行脚本
// 全局包可以安装到本地（安装到本地好处就是可以防止每个人安装的版本一致）
// 全局包安装到本地 会在node_modules下生成.bin文件夹有对应的命令
// 通过npm run 命令在执行命令前会将当前的node_modules/.bin目录放置到环境变量中，执行后再移除

// npx 命令是npm 5.2之后提供的 （命令不存在会安装使用再销毁) (缺点就是不能保存执行命令)

// 3n npm \ nvm \ nrm(.npmrc)

// 将源切换到官方进行发包  nrm use npm
// 注册账号
// npm publish 发布当前包 
// 保证名字不冲突 403 没权限说明已经有人发布过这个包了.
