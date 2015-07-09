/* Gulpfile Starter pack V1.0 */

/* gulp */
var gulp = require('gulp');

/* livereload*/
var livereload = require('gulp-livereload');

/* css process */
var compass = require('gulp-compass');

/* image process */
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

/* code check */
var htmlhint = require("gulp-htmlhint");
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var scsslint = require('gulp-scss-lint');

/* compress */
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');

/* ultils */
var folders = require('gulp-folders');
var notify = require("gulp-notify");
var concat = require('gulp-concat');
var del = require('del');

/* prevent stopping gulp watch when errors */
var noop = function () {};

var spritesmith = require('gulp.spritesmith');

/* delete  */

gulp.task('cleanpng', function () {
  del([
    'dist/img/**/*.png'
  ]);
});

gulp.task('cleanjpg', function () {
  del([
    'dist/img/**/*.jpg'
  ]);
});

gulp.task('cleansprites', function () {
  del([
    'dist/sprites/*.png'
  ]);
});

/**
 * Generate sprite and css file from PNGs
 */
gulp.task('sprites', folders('src/sprites/folders', function(folder) {
  var spriteData = gulp.src('src/sprites/folders/'+folder+'/*.png').pipe(spritesmith({
    imgName: 'sprite-'+folder+'.png',
    cssName: 'sprite-'+folder+'.css',
    cssFormat: 'css',
    padding: 10,
    algorithm:'top-down',
    imgPath :'../sprites/sprite-'+folder+'.png'
  }));
  spriteData.img
    .pipe(gulp.dest('src/sprites/'))
    .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7,
            use : [pngquant()]
        }))
    .pipe(gulp.dest('dist/sprites'));

  spriteData.css
    .pipe(gulp.dest('src/css'));

  
}));

/* concat css sprites */
gulp.task('concat', function() {
  return gulp.src('src/css/sprite-*.css')
    .pipe(concat('sprites.css'))
    .pipe(gulp.dest('src/css/'))
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify("concat"));
});

/* javascript process*/
gulp.task('js', function() {
  return gulp.src('src/js/**/*.js',{ base: 'src/js' })
    .pipe(jscs())      // enforce style guide
    .on('error', noop) // don't stop on error
    .pipe(stylish())  // log style errors
    .pipe(uglify())
  	.pipe(gulp.dest('dist/js'))
    .pipe(livereload());
});

/* styles process */
gulp.task('css', function() {
  return gulp.src('src/scss/**/*.scss')
    /*.pipe(scsslint({
      'config': 'lint.yml'
      }))*/
    .pipe(compass({
      css: './src/css',
      sass: './src/scss'
    }))
    .pipe(gulp.dest('src/css'))
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

/* image PNG process */
gulp.task('png', function() {
  return gulp.src('src/img/**/*.png',{ base: 'src/img' })
    .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7,
            use : [pngquant()]
        }))
    .pipe(gulp.dest('dist/img'))
    .pipe(livereload());
});

/* image JPG process*/
gulp.task('jpg', function() {
  return gulp.src('src/img/**/*.jpg',{ base: 'src/img' })
    .pipe(imageminJpegRecompress({loops: 3})())
    .pipe(gulp.dest('dist/img'))
    .pipe(livereload());
});

/* HTML code process */
gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlhint({
      "htmlhintrc" : '.htmlhintrc'
    }))
    .pipe(htmlhint.reporter())
    .pipe(minifyHTML({empty: true}))
    .pipe(gulp.dest('dist/'))
    .pipe(livereload());

});

/* default process */
gulp.task('default', ['js','css','png', 'jpg','html'],function() {

});

/* watch process */
gulp.task('watch',function() {
  livereload.listen();
  gulp.watch('src/scss/**/*.scss',['css']);
  gulp.watch('src/js/**/*.js',['js']);
  gulp.watch('src/img/**/*.png',['cleanpng','png']);
  gulp.watch('src/sprites/folders/**/*.png',['cleansprites','sprites','concat']);
  gulp.watch('src/img/**/*.jpg',['cleanjpg','jpg']);
  gulp.watch('src/**/*.html',['html']);
});
