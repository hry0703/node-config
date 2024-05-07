
const fs = require('fs/promises');
const path = require('path');

// co + generator  = async + await (就是 co + generator 糖)
async function readResult() {
    let filename = await fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
    let age = await fs.readFile(path.resolve(__dirname, filename), 'utf8');
    return age;
}
readResult().then(data => {
    console.log(data);
});
// function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
//     try {
//         var info = gen[key](arg); // it.next
//         var value = info.value; // let value = it.next()
//     } catch (error) { reject(error); return; }
//     if (info.done) {
//         resolve(value);
//     } else {
//         Promise.resolve(value).then(_next, _throw);
//     }
// }
// function _asyncToGenerator(fn) { // co
//     return function () {
//         var self = this, args = arguments; return new Promise(function (resolve, reject) {
//             var gen = fn.apply(self, args); // let it =  gen()
//             function _next(value) {
//                 asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
//             } function _throw(err) {
//                 asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
//             } _next(undefined);
//         });
//     };
// }
// function readResult() {
//     return _readResult.apply(this, arguments);
// }
// function _readResult() {
//   _readResult = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
//     var filename, age;
//     return _regeneratorRuntime().wrap(function _callee$(_context) {
//       while (1) switch (_context.prev = _context.next) {
//         case 0:
//           _context.next = 2;
//           return fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
//         case 2:
//           filename = _context.sent;
//           _context.next = 5;
//           return fs.readFile(path.resolve(__dirname, filename), 'utf8');
//         case 5:
//           age = _context.sent;
//           return _context.abrupt("return", age);
//         case 7:
//         case "end":
//           return _context.stop();
//       }
//     }, _callee);
//   }));
//   return _readResult.apply(this, arguments);
// }