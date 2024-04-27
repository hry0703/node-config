const fs = require('fs');
const path = require('path')
let person = {}
let event = {
    _arr:[],
    on(fn){
        this._arr.push(fn)
    },
    emit(...args){
        this._arr.forEach(fn=>fn(...args))
    }
}


event.on(function(){
    console.log('读取成功一次');
})

event.on(function () {
    if (Object.keys(person).length === 2){
        console.log('读取完毕');
    }
})

// 发布订阅模式
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
    person.name = data
    event.emit(); // 发布
});

fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
    person.age = data
    event.emit(); // 发布
});
