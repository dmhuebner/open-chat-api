const gulp = require('gulp'),
      nodemon = require('gulp-nodemon'),
      gulpMocha = require('gulp-mocha'),
      env = require('gulp-env'),
      supertest = require('supertest');

gulp.task('start', () => {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {
      PORT: 8000
    },
    ignore: '/.node_modules'
  })
  .on('restart', () => {
    console.log('Restarting...');
  });
});

gulp.task('test', () => {
  runTests();
});

gulp.task('tdd', () => {
  runTests();
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {
      PORT: 8000
    },
    ignore: '/.node_modules'
  })
    .on('restart', () => {
      runTests();
    });
});

function runTests() {
  env({vars: {ENV: 'unit-test'}});
  gulp.src('**/*spec.js', {read: false})
    .pipe(gulpMocha({reporter: 'nyan'}));
}