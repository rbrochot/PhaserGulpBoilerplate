var gulp = require('gulp');
var argv = require('yargs').argv;
var fs = require('fs');
var _ = require('underscore');

var options = {
	dir: {
		LIBS_PATH: './node_modules/',
		BUILD_PATH: './build',
		SOURCE_PATH: './src',
		STATIC_PATH: './static',
		OUTPUT_FILE: 'game.js',
		TASK_DIRECTORY: './gulp_tasks',
		SCRIPTS_PATH: '',
		ENTRY_FILE: '',
	},
	isProduction: function () {
		return argv.production;
	}
};
options.dir.SCRIPTS_PATH = options.dir.BUILD_PATH + '/scripts';
options.dir.ENTRY_FILE = options.dir.SOURCE_PATH + '/index.js';

fs.readdirSync(options.dir.TASK_DIRECTORY).filter(_filterFilename).map(_requireGulpFile);

function _filterFilename(file) {
	return (/\.(js)$/i).test(file);
}

function _requireGulpFile(file) {
	var required = module.require(options.dir.TASK_DIRECTORY + '/' + file);
	if (_.isFunction(required)) {
		required(options);
	}
}

/**
 * The tasks are executed in the following order:
 * 'cleanBuild' -> 'copyStatic' -> 'copyLibs' -> 'build' -> (soon)'inject'-> 'serve'
 */
gulp.task('default', ['serve']);
