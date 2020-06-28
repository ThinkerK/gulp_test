var gulp=require("gulp");
var uglify=require("gulp-uglify");//压缩丑化js代码
var sass=require("gulp-sass");//把sass文件转化为css
var minify=require("gulp-minify-css");//压缩css文件
var smushit=require("gulp-smushit");//压缩图片
var htmlmin=require("gulp-htmlmin");//压缩html文件
var plumber=require("gulp-plumber");//检错
var browserSync=require("browser-sync").create();//创建服务器
var reload=browserSync.reload;//定义变量保存browser服务器的重新加载属性
var clean = require("gulp-clean");
var pump = require("pump");
var watch = require("gulp-watch");
var babel = require('gulp-babel');
var obfuscate = require('gulp-obfuscate');

//清空文件夹
gulp.task("clean",done => {
    pump([
        gulp.src('./dist'),
        clean()
    ])
    done()
})

//建立任务初始化服务器
gulp.task("browser-sync", done => {
	browserSync.init({
		server: {
            baseDir: "./dist",
            // index: "home/index.html"
        },
        port:8080,
        
	})


	watch("src/view/**/*.js",gulp.series("viewJs"));
	watch("src/view/**/*.scss",gulp.series("viewCss"));
    watch("src/view/**/*.html",gulp.series("viewsMin"));
    
    done()

})


//压缩js任务
gulp.task("viewJs", done => {
    gulp.src(["src/view/**/*.js"]).
    pipe(babel()).
	pipe(plumber()).//在压缩之前先检错
	pipe(uglify({
        mangle: true,
        compress: true
    })).
    pipe(obfuscate()).
	pipe(gulp.dest("dist")).
	pipe(reload({stream:true}));//每次执行完压缩任务后会自动刷新页面 
    done()
})

//转化压缩scss
gulp.task("viewCss",done => {
    gulp.src(["src/view/css/*.scss"]).
	pipe(sass()).
	pipe(gulp.dest("src/view/**/css")).
	pipe(reload({stream:true}));

	gulp.src(["src/view/**/*.css"]).
	pipe(sass()).
	pipe(minify()).
	pipe(gulp.dest("dist")).
	pipe(reload({stream:true}));
    done()

})

//图片的压缩

gulp.task("smushit",done =>{
	gulp.src(["src/view/**/images/*"]).
	pipe(smushit({
            verbose: true//运行时候显示详细信息
        })).
    pipe(gulp.dest("dist"))
    done()
})


//输出html文件
gulp.task("viewsMin",done => {
	var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };

    gulp.src(["src/view/**/*.html"]).
    // pipe(revCollector({
    //     replaceReved: true,
    // })).
	pipe(htmlmin(options)).
	pipe(gulp.dest("dist")).
    pipe(reload({stream:true}));
    done();
})

//启动默认任务的时候执行哪些任务
gulp.task("default",gulp.series("clean",gulp.parallel(["viewJs","viewCss","viewsMin"])));