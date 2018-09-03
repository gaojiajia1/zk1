var gulp = require('gulp');
var sass = require('gulp-sass');
var minCss = require('gulp-clean-css');
var minJs = require('gulp-uglify');
var server = require('gulp-webserver');
var babel = require('gulp-babel');
var listjson = require('./mock/list.json')
    //编译scss   压缩css
gulp.task('minCss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(minCss())
        .pipe(gulp.dest('./src/css'))
})

//监听scss
gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('minCss'))
})

//压缩js
gulp.task('minJs', function() {
        return gulp.src(['./src/js/**/*.js', '!./src/js/commonjs/*.js'])
            .pipe(babel())
            .pipe(minJs())
            .pipe(gulp.dest('./src/libs'))
    })
    //搭建服务器
gulp.task('devServer', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9090,
            middleware: function(req, res, next) {
                var pathname = require('url').parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    res.end('');
                    return;
                }
                if (pathname === '/api/list') {
                    var val = require('url').parse(req.url, true).query.val;
                    var arr = [];
                    listjson.forEach(function(file) {
                        if (file.cont.match(val)) {
                            arr.push(file);
                        }
                    })
                    res.end(JSON.stringify({ code: 0, data: arr }))
                } else {
                    pathname = pathname === '/' ? '/index.html' : pathname;
                    res.end(require('fs').readFileSync(require('path').join(__dirname, 'src', pathname)))
                }

            }
        }))
})

//整合任务
gulp.task('dev', gulp.series('minCss', 'devServer', 'watch'))