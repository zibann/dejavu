
'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
// var del = require('del');
// var path = require('path');

// this watches all the django app dirs, given that an app lives in `src/<project>/<appname>/`
gulp.task('copy_browser', gulp.parallel(function() {
		watch(['node_modules/@appbaseio/dejavu-browser/**/{_,?}*.{js,jsx,md,map,less,css,html,xml,json}'], {verbose: true})
		.pipe(gulp.dest('packages/dejavu-main/node_modules/@appbaseio/dejavu-browser'));
  
}));


// watch task
gulp.task('default', gulp.parallel(['copy_browser']));

