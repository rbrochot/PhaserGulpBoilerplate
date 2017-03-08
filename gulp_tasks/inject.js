/**
 * Executes the processing tasks first (['scripts', 'styles', 'i18n', 'copy'])
 * Then injects the compiled files (js and css) into index.html
 */
(function () {
	'use strict';

	var gulp = require('gulp');

	// var $ = require('gulp-load-plugins')();
	// var vendor = require('./vendor')();

	module.exports = function (options) {
		gulp.task('inject', ['scripts', 'styles', 'copy'], function () {

			// return gulp.src(options.directory.client + '/*.html')
			// 	//inject compiled vendor css into index.html
			// 	.pipe($.inject(injectStylesVendor, injectOptionsVendor))
			// 	//inject compiled app css into index.html
			// 	.pipe($.inject(injectStyles, injectOptions))
			// 	//inject compiled vendor js into index.html
			// 	.pipe($.inject(injectScriptsVendor, injectOptionsVendor))
			// 	//inject compiled app js into index.html
			// 	.pipe($.inject(injectScripts, injectOptions))
			// 	.pipe($.inject(injectScriptsConfig, injectOptionsConfig))
			// 	.pipe(gulp.dest(options.directory.tmp + '/serve'));

		});
	};

})();
