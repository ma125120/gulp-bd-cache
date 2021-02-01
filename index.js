const through = require("through2");
const fs = require("fs");
const path = require("path");
let cacheJson = {};
try {
  cacheJson = require("./cache.json");
} catch (err) {}

let tid;

/**
 * 对目标目录作缓存，存在更改时才编译
 * @param {boolean} open 是否开启缓存，默认true，false的时候只记录时间，不操作文件
 * @param {number} delayWrite 等待多少ms，再写入到硬盘
 */
const cacheMethod = (open = true, delayWrite = 500) => {
  return through.obj((file, enc, cb) => {
    const { path: _path, relative } = file;
    const { mtimeMs } = fs.statSync(_path);
    if (open && cacheJson[relative]) {
      // 文件存在更改
      if (mtimeMs !== cacheJson[relative]) {
        writeJson(relative, mtimeMs, delayWrite);
        cb(null, file);
      } else {
        // 文件未更改
        cb(null, null);
      }
    } else {
      // 第一次编译
      writeJson(relative, mtimeMs);
      cb(null, file);
    }
  });
};

function writeJson(relative, mtimeMs, delayWrite) {
  cacheJson[relative] = mtimeMs;
  clearTimeout(tid);
  tid = setTimeout(() => {
    fs.createWriteStream(path.resolve(__dirname, `./cache.json`)).write(
      JSON.stringify(cacheJson || {})
    );
  }, delayWrite);
}

/** 清除缓存，将json文件写入空对象 */
cacheMethod.clear = () => {
  fs.createWriteStream(path.resolve(__dirname, `./cache.json`)).write(
    JSON.stringify({})
  );
};

module.exports = cacheMethod;
