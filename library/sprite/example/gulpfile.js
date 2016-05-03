'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');

var cssTemplate = require('../index');

gulp.task('sprite', function() {
	gulp.src(['img/*.png', '!img/spri*.png'])
		.pipe(spritesmith({
			padding: 8,
			retinaImgName: 'img/sprite@2x.png',
			retinaSrcFilter: 'img/*@2x.png',
			imgName: 'img/sprite.png',
			cssName: 'css/sprite.scss',
			cssTemplate: cssTemplate
		}))
		.pipe(gulp.dest('./'))
});

gulp.task('default', ['sprite'], function() {
	gulp.src('css/example.scss')
		.pipe(sass())
		.pipe(gulp.dest('css'))
});