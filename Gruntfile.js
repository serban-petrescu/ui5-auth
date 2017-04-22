module.exports = function(grunt) {
	var oPackage = grunt.file.readJSON('package.json');
	grunt.file.write("conf.json", JSON.stringify({
	  "tags": {
		"allowUnknownTags": true
	  },
	  "plugins": ["plugins/markdown"],
	  "templates": {
		"logoFile": "",
		"cleverLinks": false,
		"monospaceLinks": false,
		"dateFormat": "dd.MM.yyyy",
		"outputSourceFiles": true,
		"outputSourcePath": true,
		"systemName": "UI5 Authorization",
		"footer": "",
		"copyright": "Copyright � 2017 Serban Petrescu",
		"navType": "vertical",
		"theme": "lumen",
		"linenums": true,
		"collapseSymbols": false,
		"inverseNav": true,
		"protocol": "html://",
		"methodHeadingReturns": false
	  },
	  "markdown": {
		"parser": "gfm",
		"hardwrap": true
	  }
	}));	
	grunt.initConfig({
		pkg: oPackage,
		openui5_preload: {
			json: {
				options: {
					resources: 'src',
					dest: 'dist',
					compatVersion: '1.38'
				},
				libraries: 'spet/auth'
			},
			js: {
				options: {
					resources: 'src',
					dest: 'dist'
				},
				libraries: 'spet/auth'
			}
		},
		uglify: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/spet/auth',
					src: '**/*.js',
					dest: 'dist/spet/auth'
				}]
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'src/spet/auth',
					src: '**/*.js',
					dest: 'dist/spet/auth/',
					rename: function(dest, src) {
						return dest + src.replace('.js','-dbg.js');
					}
				}, {
					src: "src/spet/auth/.library",
					dest: "dist/spet/auth/.library"
				}]
			},
			pages: {
				files: [{
					expand: true,
					cwd: 'dist/spet/auth',
					src: '**/*',
					dest: 'pages/src/spet/auth/',
				},{
					expand: true,
					cwd: 'test/spet/auth',
					src: '**/*',
					dest: 'pages/test/spet/auth/',
				},{
					expand: true,
					cwd: 'sample',
					src: '**/*',
					dest: 'pages/sample/',
				},{
					src: 'LICENSE',
					dest: 'pages/LICENSE',
				}]
			}
		},
		jsdoc : {
			dist : {
				src: ['src/**/*.js', 'README.md'],
				options: {
					destination : 'pages/doc/',
					template : "node_modules/ink-docstrap/template",
					configure : "conf.json"
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 8000
				}
			}
		},
		qunit: {
			all: {
				options: {
					urls: ['http://localhost:8000/test/spet/auth/index.qunit.html']
				}
			}
		},
		compress: {
			dist: {
				options: {
					archive: 'pages/latest.zip'
				},
				files: [{
					expand: true,
					dot: true,
					cwd: 'dist/',
					src: '**/*',
					dest: '.'
				},{
					src: 'LICENSE',
					dest: 'LICENSE',
				}]
			}
		},
		replace: {
			dist: {
				options: {
					patterns: [{
						match: 'version',
						replacement: oPackage.version
					}]
				},
				files: [{
					expand: true,
					dot: true,
					src: "dist/**",
					dest: "./"
				},{
					expand: true,
					dot: true,
					src: "pages/doc/**",
					dest: "./"
				}]
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-replace');
	grunt.registerTask('default', ['openui5_preload', 'uglify', 'copy:dist', 'jsdoc', 'connect', 'qunit', 
		'copy:pages', 'replace', 'compress']);
};