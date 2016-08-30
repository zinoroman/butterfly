var gulp 					= require('gulp'),
		autopref			= require('gulp-autoprefixer'),
		browserSync 	= require('browser-sync'),
		cache 				= require('gulp-cache'),
		concat 				= require('gulp-concat'),
		connect 			= require('gulp-connect'),
		cssnano 			= require('gulp-cssnano'),
		del 					= require('del'),
		imagemin 			= require('gulp-imagemin'),
		include 			= require('gulp-include'),
		opn 					= require('opn'),
		pngquant 			= require('imagemin-pngquant'),
		rename 				= require('gulp-rename'),
		sass 					= require('gulp-sass'),
		svgo					= require('gulp-svgo'),
		uglify 				= require('gulp-uglifyjs'),
		path 					= '_butterfly_html_css';

gulp.task('connect', function() {
	connect.server({
		root: path,
		livereload: true,
		port: 3000
	});
	opn('http://localhost:3000');
});

gulp.task('bootstrap', function(){
	return gulp.src(path+'/sass/libs/bootstrap.scss')
	.pipe(sass({outputStyle: 'compressed'}).on('error', swallowError))
	.pipe(autopref([
		"Android 2.3",
		"Android >= 4",
		"Chrome >= 20",
		"Firefox >= 24",
		"Explorer >= 8",
		"iOS >= 6",
		"Opera >= 12",
		"Safari >= 6"
	]))
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(path+'/css/libs/'));
});

gulp.task('svgo', function(){
	return gulp.src(path+'/images/svg/**/*.svg')
	.pipe(svgo())
	.pipe(gulp.dest(path+'/images/svg'));
});

gulp.task('html-include', function(){
	return gulp.src(path+'/html/*.html')
	.pipe(include())
	.pipe(gulp.dest(path+'/'));
});

gulp.task('sass', function(){
	return gulp.src(path+'/sass/*.scss')
	.pipe(sass({outputStyle: 'expanded'}).on('error', swallowError))
	.pipe(autopref([
		"Android 2.3",
		"Android >= 4",
		"Chrome >= 20",
		"Firefox >= 24",
		"Explorer >= 8",
		"iOS >= 6",
		"Opera >= 12",
		"Safari >= 6"
	], {cascade: true}))
	.pipe(gulp.dest(path+'/css'));
});

gulp.task('js-libs', function(){
	return gulp.src(path+'/js/libs/*.js')
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest(path+'/js'));
})

gulp.task('css-libs', ['sass'], function(){
	return gulp.src([path+'/css/libs.css'])
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(path+'/css'));
});

gulp.task('html-reload', function(){
	return gulp.src(path+'/*.html')
	.pipe(connect.reload());
});

gulp.task('css-reload', function(){
	return gulp.src(path+'/css/*.css')
	.pipe(connect.reload());
});

gulp.task('js-reload', function(){
	return gulp.src(path+'/js/*.js')
	.pipe(connect.reload());
});

gulp.task('all-reload', ['html-reload', 'css-reload', 'js-reload', 'css-libs', 'js-libs'], function(){
	return;
});

gulp.task('watch', ['html-include', 'css-libs', 'js-libs', 'connect', 'all-reload'], function(){
	gulp.watch([path+'/sass/*.scss'], 		['sass']);
	gulp.watch([path+'/html/**/*.html'], 	['html-include']);
	gulp.watch([path+'/*.html'], 					['html-reload']);
	gulp.watch([path+'/css/*.css'], 			['css-reload']);
	gulp.watch([path+'/js/*.js'], 				['js-reload']);
	gulp.watch([path+'/css/libs/*.css'], 	['css-libs']);
	gulp.watch([path+'/js/libs/*.js'], 		['js-libs']);
});

gulp.task('clean', function(){
	return del.sync('result');
});

gulp.task('img', function(){
	return gulp.src(path+'/images/**/*')
	.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
	.pipe(gulp.dest('result/images'));
});

gulp.task('build', ['clean', 'img', 'css-libs', 'js-libs'], function(){
	
	var buildCss = gulp.src([
		path+'/css/*.css'
	])
		.pipe(gulp.dest('result/css'));

	var buildFonts = gulp.src(path+'/fonts/**/*')
		.pipe(gulp.dest('result/fonts'));

	var buildJs = gulp.src([
		path+'/js/*.js',
	])
		.pipe(gulp.dest('result/js'));

	var buildHtml = gulp.src(path+'/*.html')
		.pipe(gulp.dest('result'));

});

gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task('default', ['watch']);

function swallowError (error) {
	console.log(error.toString())
	this.emit('end')
}