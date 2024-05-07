
// module.exports 的特点 就是可以到处对象，可以使用引用类型的特点来解决这个问题 

let moduleB;
module.exports = {
    saveModule(module) {
        moduleB = module
    },
    fn() {
        moduleB.use(); // 在a中使用b
    },
    use() {
        console.log('使用a')
    }
}

