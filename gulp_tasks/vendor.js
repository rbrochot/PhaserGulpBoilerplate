/**
* Copies libs
*/
(function () {
	'use strict';

	var gulp = require('gulp');

	module.exports = function(options) {
		gulp.task('copyLibs', [], function() {

			var srcList = [
				options.dir.PHASER_PATH + 'phaser.min.js',
				'underscore/underscore-min.js'
			];

			if (!options.isProduction()) {
				srcList.push(
					'underscore/underscore-min.map',
					'underscore/underscore.js',
					options.dir.PHASER_PATH + 'phaser.map',
					options.dir.PHASER_PATH + 'phaser.js'
				);
			}

			srcList = srcList.map(function(file) {
				return options.dir.LIBS_PATH + file;
			});

			return gulp.src(srcList)
				.pipe(gulp.dest(options.dir.SCRIPTS_PATH));

		});
	};
})();
