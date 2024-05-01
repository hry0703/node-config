console.log('my promise run ')

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED'


class Promise{
    constructor(executor){
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolveCallbacks = [];
        this.onRejectedCallbacks = [];
        const reslove = (value)=>{
            if (this.status === PENDING){
                this.status = FULFILLED
                this.value = value;    
                this.onResolveCallbacks.forEach(fn=>fn())
            }
        }
        const reject = (error) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = error;
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(reslove, reject)
        } catch (error) {
            reject(error)
        }

    }

    then(onFulfilled, onRejected){
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        }
        if (this.status === REJECTED) {
            onRejected(this.reason);
        }
        if (this.status === PENDING) {
            this.onResolveCallbacks.push(()=>onFulfilled(this.value))
            this.onRejectedCallbacks.push(()=>onRejected(this.reason))
        }
    }
}

module.exports  = Promise 





