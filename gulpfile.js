var gulp			= require('gulp'),
	gutil			= require('gulp-util'),
	jade			= require('gulp-jade'),
	sourcemaps		= require('gulp-sourcemaps'),
	coffee			= require('gulp-coffee'),
	include			= require('gulp-include'),
	uglify			= require('gulp-uglify'),
	sass			= require('gulp-sass'),
	autoprefixer	= require('gulp-autoprefixer'),
	base64			= require('gulp-base64'),
	filter			= require('gulp-filter'),
	browsersync		= require('browser-sync');

var reload = browsersync.reload;

function handler (error) {
	if (typeof error.location != 'undefined') {
		gutil.log(error.filename + '(' + error.location.first_line + '): ' + error.message);
	} else {
		gutil.log(error.message);
	}
}

var paths = {
	jade:			'./sources/jade/*.jade',
	sass:			'./sources/sass/*.sass',
	coffeescript:	'./sources/coffee/*.coffee',
	scheme:			'./assets/scheme.xml'
};

gulp.task('jade', function ( ) {
	gulp.src(paths.jade)
		.pipe(jade({ pretty: true }).on('error', handler))
		.pipe(gulp.dest('./build/'))
		.pipe(reload({ stream: true }));
});

gulp.task('sass', function ( ) {
	gulp.src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({ indentedSyntax: true }).on('error', handler))
		.pipe(autoprefixer())
		.pipe(base64({ extensions: [ 'svg' ] }))
		.pipe(sourcemaps.write('./maps/'))
		.pipe(gulp.dest('./build/css/'))
		.pipe(filter('**/*.css'))
		.pipe(reload({ stream: true }));
});

gulp.task('coffeescript', function ( ) {
	gulp.src(paths.coffeescript)
		.pipe(include())
		//.pipe(sourcemaps.init())
		.pipe(coffee().on('error', handler))
		//.pipe(uglify())
		//.pipe(sourcemaps.write('./maps/'))
		.pipe(gulp.dest('./build/js/'))
		.pipe(filter('**/*.js'))
		.pipe(reload({ stream: true }));
});

gulp.task('copyscheme', function ( ) {
	gulp.src(paths.scheme)
		.pipe(gulp.dest('./build/'));
});

gulp.task('watch', function ( ) {
	browsersync({
		server: { baseDir: './build/' },
		notify: {
			styles: [
				'width: 100px;',
				'height: 30px;',
				'background: black;',
				'position: absolute;',
				'font: 12px Arial, sans-serif;',
				'overflow: hidden;',
				'color: white;',
				'bottom: 0;',
				'right: 0;'
			]
		}
	});

	gulp.watch(paths.jade, [ 'jade' ]);
	gulp.watch(paths.sass, [ 'sass' ]);
	gulp.watch(paths.coffeescript, [ 'coffeescript' ]);
});

gulp.task('default', [ 'watch', 'jade', 'sass', 'coffeescript', 'copyscheme' ]);