module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		dirs: {
			emmet : "lib/emmet/javascript"
		},
		concat: {
			options: {
				separator: ";",
				stripBanners: true
			},
			dist: {
				src: ['<%= dirs.emmet %>/underscore.js', '<%= dirs.emmet %>/core.js', '<%= dirs.emmet %>/utils.js', '<%= dirs.emmet %>/elements.js', '<%= dirs.emmet %>/stringStream.js', '<%= dirs.emmet %>/parsers/abbreviationParser.js', 'src/Zen.js'],
				dest: 'dist/Zen.js'
			}
		},
		uglify : {
			options: {
				banner: '/* <%= pkg.name %> -- v<%= pkg.version %> -- build: <%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			dist: {
				files: {
					'dist/Zen.min.js' : ['<%= concat.dist.dest %>']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat', 'uglify']);

}