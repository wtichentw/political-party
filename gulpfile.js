var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var connect = require("gulp-connect");
var imagemin = require("gulp-imagemin");

var paths = {
  indexHTML: "./src/index.html",
  fonts: "./src/fonts/**/*.woff2",
  images: [
    "./src/images/**/*.png",
    "./src/images/**/*.jpg"
  ],
  videos: "./src/videos/**/*.webm",
  stylesheets: [
    "./node_modules/normalize.css/normalize.css",
    "./src/stylesheets/**/*.css"
  ],
  scripts: [
    "./node_modules/phaser/dist/phaser.min.js",
    "./src/scripts/**/*.js"
  ],
  dist: "./dist"
};

gulp.task("fonts", function() {
  gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dist + "/fonts"));
});

gulp.task("images", function() {
  gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + "/images"));
});

gulp.task("videos", function() {
  gulp.src(paths.videos)
    .pipe(gulp.dest(paths.dist + "/videos"));
});

gulp.task("indexHTML", function() {
  gulp.src(paths.indexHTML)
    .pipe(gulp.dest(paths.dist));
});

gulp.task("stylesheets", function() {
  gulp.src(paths.stylesheets)
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest(paths.dist + "/css"))
    .pipe(connect.reload());
});

gulp.task("scripts", function() {
  gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest(paths.dist + "/js"))
    .pipe(connect.reload());
});

gulp.task("connect", function() {
  connect.server({
    root: "./dist",
    livereload: true
  });
});

gulp.task("watch", function() {
  gulp.watch(paths.stylesheets, ["stylesheets"]);
  gulp.watch(paths.scripts, ["scripts"]);
});

gulp.task("default", ["fonts", "images", "videos", "indexHTML", "stylesheets", "scripts", "connect", "watch"]);
