const fs = require('fs');
const file = fs.createWriteStream('./big.txt');
// 循环500万次
for (let i = 0; i <= 500000; i++) {
    file.write('我是hry，我来测试一个大文件, 你看看我会有多大?');
}

file.end();