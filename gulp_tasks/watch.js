/**
* Rebuilds and reloads the project when executed.
*/
(function () {
	'use strict';

	var gulp = require('gulp');
	var browserSync = require('browser-sync');

	module.exports = function(options) {
		gulp.task('watch-js', ['build'], browserSync.reload);
	};
})();
