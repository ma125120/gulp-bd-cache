该插件利用的是文件修改后的mtime属性，并未实际存储文件，所以使用的时候需要注意 **两次编译期间不要清空目标文件夹**

## 安装

```
npm i gulp-bd-cache -D
```

## 使用

```
const cache = require('gulp-bd-cache');

gulp.src(`app.js`).pipe(cache())
```