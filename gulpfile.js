'use strict';

global.$ = {
  gulp: require('gulp'),
  gp: require( 'gulp-load-plugins' )(),
  browserSync: require( 'browser-sync' ),
  fn: require( './gulp/functions.js')
};

/*******************************
 * BrowserSync Task
 *******************************/
$.gulp.task( 'browserSync', function( cb ) {
  return $.browserSync( {
    port: 63342,
    server: {
      baseDir: './'
    },
    open: "local",
    browser: "chrome"
  }, cb );
});

/*******************************
 * Scss Task
 *******************************/
$.gulp.task( 'scss', function() {
    return $.gulp.src('./src/scss/styles.scss')
        .pipe( $.gp.sourcemaps.init() )
        .pipe( $.gp.sass()).on('error', $.gp.notify.onError({ title: 'Sass' }) )
        .pipe( $.gp.autoprefixer({ browsers: ['last 3 version', '> 1%', 'ie 8', 'ie 9', 'Opera 12.1'] }) )
        .pipe( $.gp.rename( 'styles.css' ) )
        .pipe( $.gp.sourcemaps.write( '.' ) )
        .pipe( $.gulp.dest( './dist/css' ) )
        .pipe( $.browserSync.stream() );
} );


/*******************************
 * Scripts Task
 *******************************/
$.gulp.task( 'scripts', function() {
  return $.gulp.src('src/js/app.js')
      .pipe( $.gp.plumber({errorHandler: $.fn.onError}) )
      .pipe( $.gp.browserify() )
      .pipe( $.gp.babel({
        presets: ['es2015']
      }) )
      .pipe( $.gulp.dest('./dist/js') )
      .pipe( $.browserSync.stream() );
} );


/*******************************
 * Watch Task
 *******************************/
$.gulp.task( 'watch', ['scripts'], function () {
  $.gulp.watch('./src/js/**/*.js', ['scripts', $.browserSync.reload]);
  $.gulp.watch('./src/scss/**/*.scss', ['scss', $.browserSync.reload]);
  $.gulp.watch('./index.html').on('change', $.browserSync.reload);
});


/*******************************
 * Default Task
 *******************************/
$.gulp.task( 'default', ['scripts', 'scss', 'browserSync', 'watch'] );