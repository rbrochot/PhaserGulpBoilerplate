/**
* Starts the Browsersync server.
* Watches for file changes in the 'src' folder.
*/
(function () {
	'use strict';

	var gulp = require('gulp');
	var browserSync = require('browser-sync');

	module.exports = function(options) {
		gulp.task('serve', ['build'], function() {
			var BUILD_PATH = './build';
			var SOURCE_PATH = './src';
			browserSync({
				server: {
					baseDir: BUILD_PATH
				},
				open: false
			});

			gulp.watch(SOURCE_PATH + '/**/*.js', ['watch-js']);
		});
	};
})();
