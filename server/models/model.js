// // 自动扫描model，引用的时候可以不用每个model都再写一遍
// const fs = require('fs');
// const db = require('../database/database.ts');

// // __dirname是当前模块的目录名字
// let files = fs.readdirSync(__dirname);

// let ts_files = files.filter((f) => {
//     return f.endsWith('.ts');
// }, files);

// module.exports = {};

// for (let f of ts_files) {
//     console.log(`import model from file ${f}...`);
//     let name = f.substring(0, f.length - 3);
//     module.exports[name] = require(__dirname + '/' + f);
// }

// module.exports.sync = () => {
//     db.sync();
// };