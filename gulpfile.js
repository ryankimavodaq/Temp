const gulp = require('gulp'); // Task runner
const concat = require('gulp-concat'); // Join files together
const uglify = require("gulp-uglify"); // Minmizes files

const babel = require('gulp-babel'); // Transform latest ES code to ES5
const browserify = require("browserify"); // Allows for require to be used in browser files
const source = require("vinyl-source-stream"); // Convert to vinyl streams for browserify
const buffer = require("vinyl-buffer"); // Convery vinyl streams to buffered object
const sourcemaps = require('gulp-sourcemaps'); // Creates a source map for minimized code that points back to the preminized version
const gutil = require('gulp-util');

gulp.task('scripts-dist', () => {
  return gulp.src('js/**/*.js')
    .pipe(sourcemaps.init()) // Initialize Source Map
      .pipe(babel({
            presets: ['env']
        })) // Transpiler ES6 Code to ES5
        .pipe(concat('all.js')) // Concatinate Javascript
          .pipe(uglify()) // Minify Javascript files
            .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
              .pipe(sourcemaps.write()) // Write to Source Map
                  .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-browserify-dist', () => {
  browserify({
    entries: 'dist/all.js',
    debug: true
  })
    .bundle()
      .on('error', err => {
        gutil.log("Browserify Error", gutil.colors.red(err.message))
      })
        .pipe(source('all.min.js'))
          .pipe(buffer())
            .pipe(uglify())
              .pipe(gulp.dest('./dist/js'));
});


gulp.task('default', ['scripts-dist', 'scripts-browserify-dist'], () => {
  gulp.watch('js/**/*.js', ['scripts-dist']);
});

gulp.task('dist', ['scripts-browserify-dist', 'scripts-browserify-dist']);
