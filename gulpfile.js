var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

var pkg = require('./package.json');

var IMG_DIR_NAME = 'img';
var CSS_DIR_NAME = 'css';
var JS_DIR_NAME = 'js';
var DIST = pkg.build;

var s_img = ['./src/asset/img/**/*'];
var s_less = ['./src/asset/less/global/global.less'];
var s_page = ['./src/page/**/*'];

function image_task(imgs) {
  return gulp
    .src(imgs)
    .pipe(gulp.dest(path.join(DIST, IMG_DIR_NAME)));
}

function page_task(pages) {
  return gulp
    .src(pages)
    .pipe(gulp.dest(DIST));
}

function less_task(lesses) {
  return gulp
    .src(lesses)
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'ie 9', 'iOS 4', 'Android 4'],
      cascade: false
    }))
    .pipe(gulp.dest(path.join(DIST, CSS_DIR_NAME)));
}

gulp.task('image', function() {
  return image_task(s_img);
});

gulp.task('less', function() {
  return less_task(s_less);
});

gulp.task('page', function() {
  return page_task(s_page);
});

gulp.task('default', ['image', 'less']);
gulp.task('watch', ['default'], function() {
  gulp.watch(s_img, ['image']);
  gulp.watch(s_less, ['less']);
  // gulp.watch(s_page, ['page']);
})
