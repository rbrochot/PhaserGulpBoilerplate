/**
* Copies libs
*/
(function () {
	'use strict';

	var gulp = require('gulp');
	var vendors = require('./vendor')();

	module.exports = function(options) {
		gulp.task('copyLibs', [], function() {

			var srcList = vendors.js.src;

			if (!options.isProduction()) {
				srcList = srcList.concat(vendors.js.map);
			}

			srcList = srcList.map(function(file) {
				return options.dir.LIBS_PATH + file;
			});

			return gulp.src(srcList)
				.pipe(gulp.dest(options.dir.SCRIPTS_PATH));

		});
	};
})();
