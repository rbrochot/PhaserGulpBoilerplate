/**
 * Transforms ES2015 code into ES5 code.
 * Optionally: Creates a sourcemap file 'game.js.map' for debugging.
 */
(function () {
	'use strict';

	var gulp = require('gulp');
	var gutil = require('gulp-util');
	var source = require('vinyl-source-stream');
	var buffer = require('gulp-buffer');
	var uglify = require('gulp-uglify');
	var gulpif = require('gulp-if');
	var exorcist = require('exorcist');
	var babelify = require('babelify');
	var browserify = require('browserify');

	module.exports = function (options) {
		gulp.task('build', ['copyLibs', 'copyStatic'], function () {

			var sourcemapPath = options.dir.SCRIPTS_PATH + '/' + options.dir.OUTPUT_FILE + '.map';

			if (options.isProduction()) {
				gutil.log(gutil.colors.green('Running production build...'));
			} else {
				gutil.log(gutil.colors.yellow('Running development build...'));
			}

			return browserify({
				entries: options.dir.ENTRY_FILE,
				debug: true
			})
				.transform(babelify)
				.bundle().on('error', function(error) {
					gutil.log(gutil.colors.red('[Build Error]', error.message));
					this.emit('end');
				})
				.pipe(gulpif(!options.isProduction(), exorcist(sourcemapPath)))
				.pipe(source(options.dir.OUTPUT_FILE))
				.pipe(buffer())
				.pipe(gulpif(options.isProduction(), uglify()))
				.pipe(gulp.dest(options.dir.SCRIPTS_PATH));

		});
	};

})();
