var gulp = require("gulp");
// const { series } = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var del = require("del");
var runSequence = require("run-sequence");

const css = function () {
	return gulp
	  .src("./assets/scss/main.scss")
	  .pipe(sass())
	  .pipe(gulp.dest("../dist/assets/css/"))
	  .pipe(
		browserSync.reload({
		  stream: true,
		})
	  );
  }

gulp.task("sass", css);

gulp.task("clean:dist", function () {
  return del.sync("dist");
});

gulp.task("useref", function () {
  return gulp
    .src("*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("../dist"));
});

function serve() {
  browserSync.init({
    server: {
      baseDir: "../",
    },
  });
}

gulp.task("browserSync", serve);

// gulp.task("watch", gulp.parallel("browserSync", "sass"), function () {
//   gulp.watch(["./assets/scss/**/*.scss"], gulp.series("sass"));
//   // Reloads the browser whenever HTML or JS files change
//   gulp.watch('//*.html', browserSync.reload);
//   gulp.watch('assets/js/**/*.js', browserSync.reload);
// });

const watcher = function () {
	// gulp.series('browserSync', 'sass');
	gulp.watch(["./assets/scss/**/*.scss"], gulp.series("sass"));
	// Reloads the browser whenever HTML or JS files change
	gulp.watch("//*.html", browserSync.reload);
	gulp.watch("assets/js/**/*.js", browserSync.reload);
}

gulp.task("watch", watcher);

watcher();

gulp.task("build", function (callback) {
  runSequence("clean:dist", ["sass", "useref"], callback);
});

// gulp.task("default", function (callback) {
//   runSequence(["sass", "browserSync", "watch"], callback);
// });

exports.default = gulp.parallel( css, serve );
