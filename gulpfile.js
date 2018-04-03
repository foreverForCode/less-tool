var gulp = require("gulp");
var less = require("gulp-less");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var browserSync = require('browser-sync');
var comments = require('postcss-discard-comments');
var rename = require('gulp-rename');
var nano = require('gulp-cssnano');
var pkg = require('./package.json');
var dist = __dirname + '/dist';
gulp.task('less',function(){
	var banner = [
		'/*!',
		' *  v<%= pkg.version %> (<%= pkg.homepage %>)',
		' *  <%= new Date().getFullYear() %> ',
		' * Licensed under the <%= pkg.license %> license',
		' */',
		''
	  ].join('\n');
	  gulp
	  .src('src/index.less',{base:'src'})
	  .pipe(sourcemaps.init())
	  .pipe(
		  less().on('error',function(e){
			  console.error(e.message);
			  this.emit('end')
		  })
	  )
	  .pipe(postcss([autoprefixer(['ios >= 7','Android >= 4.1']),comments()]))
	  .pipe(header(banner,{pkg:pkg}))
	  .pipe(sourcemaps.write())
	  .pipe(gulp.dest(dist))
	  .pipe(
		  nano({
			  zindex:false,
			  autoprefixer:false
		  })
	  )
	  .pipe(
		  rename(function(path){
			  path.basename += '.min';
		  })
	  )
	  .pipe(gulp.dest(dist))
})

gulp.task('auto',function(){
	gulp.watch('src/**.less',['less'])
})

gulp.task('default',['less','auto'])
