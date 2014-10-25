var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var templateCache = require('gulp-angular-templatecache');

var paths = {
  index: 'index.html',
  templates: 'templates/**/*.html',
  scripts: ['js/**/*.js', '!js/vendor/**/*.js'],
  vendorsSource: [
    'node_modules/angular/lib/angular.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/lodash/dist/lodash.underscore.min.js'
  ],
  vendors: 'js/vendor/**/*.js',
  styles: 'scss/**/*.scss',
  dev: 'dev',
  prod: 'prod'
};

gulp.task('vendorUpdate', function() {
  gulp.src(paths.vendorsSource)
    .pipe(gulp.dest('./js/vendor'));
});

gulp.task('index', function() {
  gulp.src(paths.index)
    .pipe(gulp.dest(paths.dev));
});

gulp.task('vendors', function() {
  gulp.src(paths.vendors)
    .pipe(gulp.dest(paths.dev));
});

gulp.task('sass', function() {
  gulp.src(paths.styles)
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(gulp.dest(paths.dev));
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.dev));
});

gulp.task('templates', function() {
  gulp.src(paths.templates)
    .pipe(templateCache('templates.js', {
      module: 'app'
    }))
    .pipe(gulp.dest('js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.index, ['index']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.vendors, ['vendors']);
  gulp.watch(paths.styles, ['sass']);
});

gulp.task('default', ['watch', 'index', 'templates', 'vendors', 'scripts', 'sass']);
gulp.task('build', ['index', 'templates', 'scripts', 'vendors', 'sass']);
