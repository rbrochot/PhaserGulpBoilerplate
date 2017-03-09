/**
 * Copies the content of the './static' folder into the '/build' folder.
 * Check out README.md for more info on the '/static' folder.
 */
(function () {
	'use strict';

	var gulp = require('gulp');

	module.exports = function (options) {
		gulp.task('copyStatic', ['cleanBuild'], function() {
			return gulp.src(options.dir.STATIC_PATH + '/**/*')
				.pipe(gulp.dest(options.dir.BUILD_PATH));
		});
	};
})();
