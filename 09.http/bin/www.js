#! /usr/bin/env node
import { program } from "commander"
import Server from '../src/index.js'
const commands = {
    'port': {
        option: '-p, --port <port>',
        default: 3000,
        description: '设置启动服务的端口号',
        usage: 'jw-server --port 3000'
    },
    'directory': {
        option: '-d, --directory <dirname>',
        default: process.cwd(),
        description: '设置服务启动的目录',
        usage: 'jw-server --diretory /usr/xxx'
    }
}
const usages = []
Object.entries(commands).forEach(([key, opt]) => {
    program.option(opt.option, opt.description, opt.default)
    usages.push(opt.usage)
})
program.on('--help', function () {
    console.log('\nExamples:')
    usages.map(item => console.log(' ' + item))
})
program.parse(process.argv); // 解析参数，这样才能消费掉用户的参数
new Server(program.opts()).start()
