const b = require('./module-b');
console.log(b, 'a');
module.exports = '我是module a'

// 循环引用在commonjs规范中不会发生死循环， 只会加载已经加载的部分

// 做处理我们希望相互引用的时候可以同时拿到对方
// 1). 尽量避免这种错误用法  2） 采用非强制的依赖关系

// 第一次运行a模块的时候 会将a的模块进行缓存，并且此时a模块的状态loaded:false
// b在去加载a 发现a的loaded属性依旧是false,死循环，直接将a现在已经有的module.exports返回