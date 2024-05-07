

let moduleA;
module.exports = {
    saveModule(module) {
        moduleA = module
    },
    use() {
        console.log('使用b')
    },
    fn() {
        moduleA.use()
    }
}