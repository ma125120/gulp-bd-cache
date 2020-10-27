
const through = require('through2')
const fs = require('fs')
const path = require('path')
const cacheJson = require('./cache.json')

let tid;

 /**
  * 对目标目录作缓存，存在更改时才编译
  * @param {number} delayWrite 等待多少ms，再写入到硬盘
  */
const cacheMethod = (delayWrite = 500) => {
  return through.obj((file, enc, cb) => {
    const { path: _path, relative, } = file
    const { mtimeMs, } = fs.statSync(_path)
    if (cacheJson[relative]) {
      // 文件存在更改
      if (mtimeMs > cacheJson[relative]) {
        writeJson(relative, mtimeMs, delayWrite)
        cb(null, file)
      } else {
        // 文件未更改
        cb(null, null)
      }
    } else {
      // 第一次编译
      writeJson(relative, mtimeMs)
      cb(null, file)
    }
  });
}

function writeJson(relative, mtimeMs, delayWrite) {
  cacheJson[relative] = mtimeMs
  clearTimeout(tid)
  tid = setTimeout(() => {
    fs.createWriteStream(path.resolve(__dirname, `./cache.json`)).write(JSON.stringify(cacheJson || {}))
  }, delayWrite)
}

module.exports = cacheMethod