该插件利用的是文件修改后的mtime属性，并未实际存储文件，所以使用的时候需要注意 **两次编译期间不要清空目标文件夹**

## 安装

```
npm i gulp-bd-cache -D
```

## 使用

```
/**
  * 对目标目录作缓存，存在更改时才编译
  * @param {boolean} open 是否开启缓存，默认true，false的时候只记录时间，不操作文件
  * @param {number} delayWrite 等待多少ms，再写入到硬盘
  */
const cache = require('gulp-bd-cache');

gulp.src(`app.js`).pipe(cache())
```

## 清除缓存

```
const cache = require('gulp-bd-cache');

cache.clear()
```

## Q&A
1. cache方法的第一个参数怎么使用?

答：如果需要缓存，应 **始终** 使用cache函数，如果某一次不想使用缓存，只需要将第一个参数设置为 false 即可，下次编译设置为 true 时，仍可使用缓存。

2. clear方法怎么使用

答：如果手动清除过目标文件夹，就需要使用 clear() 方法，否则仍会延用缓存，导致生成的文件只有变更过的文件