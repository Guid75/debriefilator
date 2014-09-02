/**
 * Get bower packages
 *
 * ---------------------------------------------------------------
 *
 * This grunt task is configured to apply bower to the sails project
 *
 */
module.exports = function(grunt) {
	grunt.config.set('bower', {
		install: {
			options: {
                targetDir: './assets/js/dependencies',
                layout: 'byType',
                install: true,
                verbose: false,
                cleanTargetDir: false,
                cleanBowerDir: true,
                bowerOptions: {}
            }
		}
	});

	grunt.loadNpmTasks('grunt-bower-task');
};
