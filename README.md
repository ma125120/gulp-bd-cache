## 安装

```
npm i gulp-bd-cache
```

## 使用

```
const createCache = require('gulp-bd-cache');
const cache = createCache()

gulp.src(`app.js`).pipe(cache)
```