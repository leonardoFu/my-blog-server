var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer')
var rename = require('gulp-rename');
var clean = require('gulp-clean');
// jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');

function errHandler(e){
  gutil.log(e);
}

gulp.task('lib',function(){
    return gulp.src('src/js/lib/*.js')
    .pipe(uglify())
    // .pipe(browserify())
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('public/dist/js'));
});

gulp.task('bundle',function(){
    return gulp.src(['src/js/**/*.js','!src/js/lib/*.js'])
    .pipe(plumber({errorHandler:errHandler}))
    .pipe(uglify())
    // .pipe(babel({
    //   presets: ['es2015']
    // }))
    .pipe(browserify())
    // .pipe(concat('common.js'))
    .pipe(gulp.dest('public/dist/js'));
});

gulp.task('styles',function(){
  var styles = ['src/less/flat-ui/flat-ui.less'
  ,'src/less/bootstrap-markdown.less'
  ,'src/less/blog.less'
  ,'src/less/*.css']
  return gulp.src(styles)
  .pipe(plumber({errorHandler:errHandler}))
  .pipe(less())
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(rename({suffix:'.min'}))
  .pipe(cssmin())
  .pipe(gulp.dest('public/dist/css'))
})

gulp.task('fonts',function(){
  return gulp.src('src/fonts/**/*.+(eot|svg|ttf|woff)')
  .pipe(gulp.dest('public/dist/fonts'))
})

gulp.task('images',function(){
  return gulp.src('src/images/*.*')
  .pipe(gulp.dest('public/dist/images'));
})

gulp.task('clean',function(){
  return gulp.src(['public/dist/js','public/dist/css','public/dist/fonts'],{read:false})
  .pipe(clean());
})

gulp.task('default',['clean'],function(){
   gulp.start('styles','images', 'lib', 'bundle','fonts','watch')
  //  .pipe(notify({message:'gulp服务启动'}));
})

gulp.task('watch',function(){
  gulp.watch(['src/js/**/*.js','!src/js/lib/*.js'],['bundle']);
  gulp.watch('src/js/lib/*.js',['lib']);
  gulp.watch('src/less/**/*.less',['styles']);
})
