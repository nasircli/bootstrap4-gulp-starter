const gulp        = require('gulp'),
      sass        = require('gulp-sass'),
      concat      = require('gulp-concat'),
      uglify      = require('gulp-uglify'),
      imagemin    = require('gulp-imagemin'),
      browserSync = require('browser-sync').create();


// Compile Sass, Compress(minify) & Inject Into Browser
gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});


// Copy HTML Files from app to dist & Inject Into Browser
gulp.task('copyHTML', function() {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});


// Concat JS Files into main.js , minify main.js and move into dist/js & Inject Into Browser
gulp.task('concatUglify', function() {
  return gulp.src('app/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});



// Move JS-Dep Files to dist/js & Inject Into Browser
gulp.task('getDevJS', function() {
  return gulp.src(['node_modules/jquery/dist/jquery.slim.min.js', 'node_modules/popper.js/dist/popper.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js'])
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});




// Move bootstrap.min.css & font-awesome.min.css to dist/css & Inject Into Browser
gulp.task('getDepCSS', function() {
  return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css', 'node_modules/font-awesome/css/font-awesome.min.css'])
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// Move Fonts to dist/fonts & Inject Into Browser
gulp.task('fonts', function() {
  return gulp.src(['node_modules/font-awesome/fonts/*', 'app/fonts/*'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
});


// Minify images and move to dist/img & Inject Into Browser
gulp.task('imagemin', () =>
  gulp.src('app/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream())
);


// Watch & Serve
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: 'dist'
  });

  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/**/*.html', ['copyHTML']);
  gulp.watch('app/js/*.js', ['concatUglify']);
  gulp.watch(['node_modules/bootstrap/dist/css/bootstrap.min.css', 'node_modules/font-awesome/css/font-awesome.min.css'], ['getDepCSS']);
  gulp.watch(['node_modules/font-awesome/fonts/*', 'app/fonts/*'], ['fonts']);
  gulp.watch('app/img/*', ['imagemin']);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});


// Create default gulp task
gulp.task('default', ['copyHTML','concatUglify', 'getDevJS', 'getDepCSS', 'fonts', 'imagemin', 'serve']);
