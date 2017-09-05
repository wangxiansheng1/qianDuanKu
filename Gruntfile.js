// AdminLTE Gruntfile
module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		pdata: grunt.file.readJSON('data.json'),
		// Task configuration.
		watch: {
			// If any .less file changes in directory "build/less/" run the "less"-task.
			files: ["build/less/*.less", "build/less/skins/*.less", "dist/js/app.js"],
			tasks: ["less", "uglify"]
		},
		// 合并文件
		concat: {
			js: {
				options: {
					stripBanners: true //去掉代码中的块注释
				},
				files: [{
						src: [
							'src/js/jkj/jkj.js',
							'src/js/jkj/core.js',
							'src/js/jkj/util.js',
							'src/js/jkj/init.js',
							'src/js/jkj/components/*.js'
						],
						dest: 'src/js/<%= pkg.name %>-<%= pdata.version.js %>.js'
					},
					{
						src: ['src/js/jkj/widgets/*.js'],
						dest: 'src/js/<%= pkg.name %>-widgets-<%= pdata.version.widgets %>.js'
					}
				]
			}
		},
		//复制文件到指定目录
		copy: {
			build: {
				files: [{
					expand: true,
					cwd: 'src/utility/css/',
					src: '**',
					dest: 'src/css/'
				}, {
					expand: true,
					cwd: 'src/utility/js/',
					src: '**',
					dest: 'src/js/'
				}]
			},
			release: {
				files: [{
					//css
					expand: true,
					cwd: 'src/css/',
					src: '**',
					dest: 'dist/css/'
				}, {
					//data
					expand: true,
					cwd: 'src/data/',
					src: '**',
					dest: 'dist/data/'
				}, {
					//font
					expand: true,
					cwd: 'src/fonts/',
					src: '**',
					dest: 'dist/fonts/'
				}, {
					//js
					expand: true,
					cwd: 'src/js/',
					src: '*.js',
					dest: 'dist/js/'
				}, {
					//html
					expand: true,
					cwd: 'src/pages/',
					src: '**',
					dest: 'dist/html/'
				}]
			}
		},
		// 压缩css文件
		cssmin: {
			options: {
				compatibility: 'ie8',
				keepSpecialComments: '*',
				advanced: false
			},
			cssRelease: {
				files: [{
					expand: true,
					extDot: 'last',
					cwd: 'src/css/',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css/',
					ext: '.min.css'
				}, {
					expand: true,
					extDot: 'last',
					cwd: 'utility/css/',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css/',
					ext: '.min.css'
				}]
			}
		},
		// 压缩图片
		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 3, //默认压缩级别
					pngquant: true
				},
				files: [{
					expand: true,
					cwd: 'src/images/',
					src: ['*.{png,jpg,gif,svg,jpeg}'],
					dest: 'dist/images/'
				}]
			}
		},
		// 编译less文件
		less: {
			compileCore: {
				options: {
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: '<%= pkg.name %>-<%= pdata.version.css %>.css.map',
					sourceMapFilename: 'src/css/<%= pkg.name %>-<%= pdata.version.css %>.css.map'
				},
				src: 'build/less/adminjkj.less',
				dest: 'src/css/<%= pkg.name %>-<%= pdata.version.css %>.css'
			},
			compileTheme: {
				options: {
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: '<%= pkg.name %>-themes-<%= pdata.version.theme %>.css.map',
					sourceMapFilename: 'src/css/<%= pkg.name %>-themes-<%= pdata.version.theme %>.css.map'
				},
				src: 'build/less/themes/all-themes.less',
				dest: 'src/css/<%= pkg.name %>-themes-<%= pdata.version.theme %>.css'
			}
		},
		// 替换内容
		replace: {
			htmlRelease: {
				options: {
					patterns: [{
							match: /\/AdminJKJ\/([\S]*?)\/([\S]*?)\//g,
							replacement: function(math, p1, p2, offset, string) {
								//p1如果是src，舍去；如果其它值，就需要保留或替换了
								var str;

								str = '/';
								if(p1 != 'src') {
									str += p1 + '/';
								}
								if(p2 == 'pages') {
									str += 'html';
								} else {
									str += p2;
								}
								str += '/';

								return str;
							}
						},
						{
							match: /"[\s]*?\/AdminJKJ\/([\S]*?)\/([\S]*?)(\.min)?\.js[\s]*?"/g,
							replacement: function(math, p1, p2, p3, offset, string) {
								var str;

								str = '"/';
								if(p1 == 'plugins') {
									str += 'plugins/';
									str += p2 + (p3 || '') + '.js"';
								} else {
									str += p2 + '.min.js"';
								}

								return str;
							}
						},
						{
							match: /"[\s]*?\/AdminJKJ\/([\S]*?)\/([\S]*?)(\.min)?\.css[\s]*?"/g,
							replacement: function(math, p1, p2, p3, offset, string) {
								var str;

								str = '"/';
								if(p1 == 'plugins') {
									str += 'plugins/';
									str += p2 + (p3 || '') + '.css"';
								} else {
									str += p2 + '.min.css"';
								}

								return str;
							}
						}
					]
				},
				files: [{
					expand: true,
					flatten: false,
					cwd: 'dist/html/',
					src: ['*', '**/*'],
					dest: 'dist/html/'
				}]
			},
			jsRelease: {
				options: {
					patterns: [{
						match: /\/AdminJKJ\/([\S]*?)\/([\S]*?)\//g,
						replacement: function(math, p1, p2, offset, string) {
							//p1如果是src，舍去；如果其它值，就需要保留或替换了
							var str;

							str = '/';
							if(p1 != 'src') {
								str += p1 + '/';
							}
							if(p2 == 'pages') {
								str += 'html';
							} else {
								str += p2;
							}
							str += '/';

							return str;
						}
					}]
				},
				files: [{
					expand: true,
					flatten: false,
					cwd: 'dist/js/',
					src: ['<%= pkg.name %>-<%= pdata.version.js %>.js', '<%= pkg.name %>-<%= pdata.version.js %>.min.js'],
					dest: 'dist/js/'
				}]
			}
		},
		// 压缩混淆 js文件
		uglify: {
			options: {
				compress: {
					warnings: true
				},
				mangle: true,
				preserveComments: 'some'
			},
			jsRelease: {
				files: [{
					expand: true,
					extDot: 'last',
					cwd: 'src/js/',
					src: ['*.js', '!*.min.js'],
					dest: 'dist/js/',
					ext: '.min.js'
				}, {
					expand: true,
					extDot: 'last',
					cwd: 'utility/js/',
					src: ['*.js', '!*.min.js'],
					dest: 'dist/js/',
					ext: '.min.js'
				}]
			}
		},
		// 验证JS文件
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			src: {
				src: 'src/js/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},
		// 验证CSS文件
		csslint: {
			options: {
				csslintrc: 'build/less/.csslintrc'
			},
			src: [
				'src/css/<%= pkg.name %>-<%= pkg.version %>.css'
			]
		},
		// 验证基于Bootstrap的网页
		bootlint: {
			options: {
				relaxerror: ['W005']
			},
			files: ['src/pages/*.html', 'src/pages/**/*.html']
		},
		// Nunjucks 转换视图为页面
		nunjucks: {
			options: {
				preprocessData: function(data) {
					var relativePath = this.src[0];

					// build/views/default.html
					data.html.page.relativePath = relativePath;

					return data;
				},
				data: grunt.file.readJSON('data.json')
			},
			render: {
				files: [{
					expand: true,
					cwd: 'build/views',
					src: [
						'**/*.html',
						'**/**/*.html',
						'!shared/**/*.html'
					],
					dest: 'src/pages',
					ext: '.html'
				}]
			}
		},
		// 清理文件
		clean: {
			dev: ['src/pages', 'src/css', 'src/js/*.js'],
			release: ['dist']
		},
		// 压缩或解压缩文件
		zip: {
			'release': {
				router: function(filepath) {
					if(filepath.indexOf('dist') == 0) {
						return filepath.substring(5);
					}
					return filepath;
				},
				src: [
					'dist/css/**',
					'dist/data/**',
					'dist/fonts/**',
					'dist/html/**',
					'dist/images/**',
					'dist/js/**',
					'plugins/**'
				],
				dest: 'zip/<%= pkg.name %>-<%= pdata.version.main %>.zip'
			}
		}
	});

	// 加载所有grunt任务

	// 合并文件
	grunt.loadNpmTasks('grunt-contrib-concat');
	// 复制文件到指定目录
	grunt.loadNpmTasks('grunt-contrib-copy');
	// 压缩css文件
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	// 压缩图片
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	// 编译Less文件
	grunt.loadNpmTasks('grunt-contrib-less');
	// Watch File Changes
	grunt.loadNpmTasks('grunt-contrib-watch');
	// 压缩js文件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// Validate JS code
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// Delete not needed files
	grunt.loadNpmTasks('grunt-contrib-clean');
	// 检查 CSS
	grunt.loadNpmTasks('grunt-contrib-csslint');
	// 检查 Bootstrap
	grunt.loadNpmTasks('grunt-bootlint');
	// Nunjucks 转换视图为页面
	grunt.loadNpmTasks('grunt-nunjucks-2-html');
	// 替换文件内容
	grunt.loadNpmTasks('grunt-replace');
	// 压缩或解压缩文件
	grunt.loadNpmTasks('grunt-zip');

	// 检查任务
	grunt.registerTask('lint', ['jshint', 'csslint', 'bootlint']);

	// 默认任务
	grunt.registerTask('default', ['watch']);

	// 构建任务
	grunt.registerTask('build', ['clean:dev', 'copy:build', 'less', 'nunjucks', 'concat:js']);
	// 发布任务
	grunt.registerTask('release', ['clean:release', 'cssmin', 'uglify', 'imagemin', 'copy:release', 'replace', 'zip']);
};