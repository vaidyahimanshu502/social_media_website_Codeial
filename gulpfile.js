const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
// const del = require('del');
const imagemin = require('gulp-imagemin');
// const fs = require('fs');

// const del = require('del');
gulp.task('css', function(done){
   gulp.src('./assets/sass/**/*.scss')
   .pipe(sass())
   .pipe(cssnano())
   .pipe(gulp.dest('./assets.css'));
   gulp.src('./assets/**/*.css')
   .pipe(rev())
      .pipe(gulp.dest('./public/assets'))
   .pipe(rev.manifest({
       cwd: 'public',
       merge: true
   }))
   .pipe(gulp.dest('./public/assets'));
done(); });

//task for js files
gulp.task('js', function(done){
   console.log('Minifying js files')
    gulp.src('./assets/**/*.js')
   .pipe(uglify())
   .pipe(rev())
   .pipe(gulp.dest('./public/assets'))
   .pipe(rev.manifest({
       cwd: 'public',
       merge: true
   }))
   .pipe(gulp.dest('./public/assets'));
done() });

//tasks for images
gulp.task('images', function(done){
   console.log('compressing images...');
   gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
   .pipe(imagemin())
   .pipe(rev())
   .pipe(gulp.dest('./public/assets'))
   .pipe(rev.manifest({
       cwd: 'public',
       merge: true
   }))
   .pipe(gulp.dest('./public/assets'));
 done();
});


// empty the public/assets directory
gulp.task('clean:assets', function(done){
   // del.deleteSync("./public/assets");

   // fs.unlinkSync("./public/assets", function(err){
   //    if(err) {
   //       console.log(err);
   //       return;
   //    }
   //    console.log('files deleted!')
   // })
   done();
});


// Call the tasks in series
gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'),
function(done){
   console.log('Building assets');
done(); });
