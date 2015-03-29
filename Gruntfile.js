module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					'scripts/common/*.js',
					'scripts/game-objects/board.js',
					'scripts/game-objects/pellet.js',
					'scripts/game-objects/snake-part.js',
					'scripts/game-objects/snake-head.js',
					'scripts/game-objects/snake.js',
					'scripts/*.js'
				],
				dest: 'deploy/all.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['concat']);
	grunt.registerTask('client', ['concat']);
};
