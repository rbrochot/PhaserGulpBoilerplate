/**
 * Deletes all content inside the './build' folder.
 */
(function () {
	'use strict';

	var gulp = require('gulp');
	var del = require('del');

	module.exports = function (options) {

		gulp.task('cleanBuild', function() {
			del(['build/**']);
		});
	};
})();
