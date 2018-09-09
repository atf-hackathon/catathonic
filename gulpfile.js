var gulp = require('gulp')
	, connect = require('gulp-connect')
	, paths;

paths = {
	assets: 'src/assets/**/*',
	css:    'src/css/*.css',
	libs:   [
		'src/bower_components/phaser-official/build/phaser.min.js'
	],
	js:     ['src/js/**/*.js'],
};

gulp.task('html', function(){
	gulp.src('src/*.html')
		.pipe(connect.reload())
		.on('error', gutil.log);
});

gulp.task('connect', function () {
	connect.server({
		root: [__dirname + '/src'],
		port: 9000,
		livereload: true
	});
});

gulp.task('watch', function () {
	gulp.watch(paths.js, ['lint']);
	gulp.watch(['./src/index.html', paths.css, paths.js], ['html']);
});

gulp.task('default', ['connect', 'watch']);