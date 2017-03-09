/**
* Rebuilds and reloads the project when executed.
*/
(function () {
	'use strict';

	var gulp = require('gulp');
	var browserSync = require('browser-sync');
	
	function isOnlyChange(event) {
		return event.type === 'changed';
	}
	function _reload() {
		return browserSync.reload();
	}

	module.exports = function(options) {

		gulp.task('watch-js', ['build'], _reload);

		// gulp.task('watch', ['inject'], function () {
		// 
		// 
		// //for each type of file, define a new task that handles the changes and reloads the browser
		// gulp.task('html-watch', ['copy:html'], _reload);
		// gulp.task('assets-watch', ['copy:assets'], _reload);
		// gulp.task('i18n-watch', ['i18n'], _reload);
		// gulp.task('styles-watch', ['styles'], _reload);
		// gulp.task('scripts-watch', ['scripts'], _reload);
		// gulp.task('inject-watch', ['inject'], _reload);
		// 
		// //set up watch tasks
		// gulp.watch(options.dir.client + '/app/assets/**/*.*', ['assets-watch']);
		// gulp.watch(options.dir.client + '/app/**/*.html', ['html-watch']);
		// gulp.watch(options.dir.client + '/components/**/*.html', ['html-watch']);
		// gulp.watch(options.dir.client + '/**/i18n/**/*.json', ['i18n-watch']);
		// 
		// gulp.watch([
		// 	options.directory.client + '/**/*.css',
		// 	options.directory.client + '/**/*.less'
		// ], function (event) {
		// 	if (isOnlyChange(event)) {
		// 		gulp.start('styles-watch');
		// 	} else {
		// 		gulp.start('inject-watch');
		// 	}
		// });
		// 
		// gulp.watch(options.directory.client + '/**/*.js', function (event) {
		// 	if (isOnlyChange(event)) {
		// 		gulp.start('scripts-watch');
		// 	} else {
		// 		gulp.start('inject-watch');
		// 	}
		// });
	};
})();
