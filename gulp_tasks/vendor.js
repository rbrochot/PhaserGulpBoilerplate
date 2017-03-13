/**
* Return Libs
*/
(function () {
	'use strict';

	module.exports = function(options) {
		return {
			js: {
				src: [
					'phaser/build/phaser.min.js',
					'underscore/underscore-min.js',
				],
				map: [
					'phaser/build/phaser.map',
					'underscore/underscore-min.map',
				]
			}
		};
	};
})();
