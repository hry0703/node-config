import os from 'os'  // 系统的信息都在这里
0
export function getNetworkInterfaces() {
    return Object.values(os.networkInterfaces()).flat().filter(item => item.family === 'IPv4').map(item => item.address)
}