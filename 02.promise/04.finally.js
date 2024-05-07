// const Promise = require('./promise')

Promise.resolve(199).finally(()=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve('abcasdasda') }, 1000)
    })
}).then((val)=>{
    console.log('成功',val);
}).catch(e=>{
    console.log('失败', e);
})