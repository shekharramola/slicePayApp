var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var url = require('url');
var proxy = require('proxy-middleware');
var proxyMiddleware = require('http-proxy-middleware');
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('clean-tmp', function(done) {
    var files = config.tmp;
    clean(files, done);
});

gulp.task('clean', function(done) {
    var delconfig = [].concat(config.dist, config.tmp);
    log('Cleaning ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

gulp.task('clean-all', function(done) {
    var delconfig = config.allToClean;
    log('Cleaning ' + $.util.colors.blue(delconfig));
    clean(delconfig, done);
});

gulp.task('jade-docs', function() {
    log('Compiling docs jade --> html');

    var options = {
        pretty: false
    }

    return gulp
        .src(config.docsJade)
        // .pipe($.plumber({errorHandler: swallowError}))
        .pipe($.jade(options))
        .pipe(gulp.dest(config.docs));
});

gulp.task('less', function() {
    log('Compiling Less --> CSS');

    return gulp
        .src(config.less)
        // .pipe($.plumber({errorHandler: swallowError}))
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(config.tmp));
});

gulp.task('less-watcher', function() {
    gulp.watch([config.less], ['less']);
});

gulp.task('sass', function() {
    log('Compiling Sass --> CSS');

    var sassOptions = {
        outputStyle: 'nested' // nested, expanded, compact, compressed
    };

    return gulp
        .src(config.sass)
        // .pipe($.plumber({errorHandler: swallowError}))
        // .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions))
        .pipe($.autoprefixer())
        // .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmp + '/styles'));
});

gulp.task('sass-min', function() {
    log('Compiling Sass --> minified CSS');

    var sassOptions = {
        outputStyle: 'compressed' // nested, expanded, compact, compressed
    };

    return gulp
        .src(config.sass)
        // .pipe($.plumber({errorHandler: swallowError}))
        .pipe($.sass(sassOptions))
        .pipe($.autoprefixer())
        .pipe(gulp.dest(config.tmp + '/styles'));    
})

gulp.task('sass-watcher', function() {
    gulp.watch([config.sass], ['sass']);
});

gulp.task('inject', function() {
    log('Injecting custom scripts to index.html');

    return gulp
        .src(config.index)
        .pipe( $.inject(gulp.src(config.js), {relative: true}) )
        .pipe(gulp.dest(config.src));
});


gulp.task('injectmock', function() {
    log('Injecting custom and mock scripts to index.html');

    return gulp
        .src(config.index)
        .pipe( $.inject(gulp.src(config.mockjs), {relative: true}) )
        .pipe(gulp.dest(config.src));
});

gulp.task('copy', function() {
    log('Copying assets');

    return gulp
        .src(config.assets, {base: config.src})
        .pipe(gulp.dest(config.dist + '/'));
});

gulp.task('optimize', ['inject', 'sass-min'], function() {
    log('Optimizing the js, css, html');

    return gulp
        .src(config.index)
        // .pipe($.plumber({errorHandler: swallowError}))
        .pipe($.useref())
        .pipe($.if('scripts/app.module.js', $.ngAnnotate()))
        .pipe($.if('scripts/app.module.js', $.uglify()))
        .pipe(gulp.dest( config.dist ));

});

gulp.task('mock', ['injectmock', 'sass'], function() {
    startBrowserSync('mock');
});

gulp.task('serve', ['inject', 'sass'], function() {
    startBrowserSync('serve');
});

gulp.task('build', ['optimize', 'copy'], function() {
    startBrowserSync('dist');
})

gulp.task('buildmock', ['injectmock', 'optimize', 'copy'], function() {
    startBrowserSync('dist');
})

gulp.task('serve-dist', function() {
    gulp.run('build');
})

gulp.task('serve-docs', ['jade-docs'], function() {
    startBrowserSync('docs');
})


function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.green(msg));
    }
}

function swallowError (error) {
    // If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}

function startBrowserSync(opt) {
    if (args.nosync || browserSync.active) {
        return;
    }

    var options = {
        open:true,
        port: 4000,
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0, //1000,
        online: false
    };

    switch(opt) {
        case 'dist':
            log('Serving dist app');
            serveDistApp();
            break;
        case 'docs':
            log('Serving docs');
            serveDocs();
            break;
        case 'prod':
            log('Serving angular app and proxying api request to prodcution server...');
            serveProductionApp();
            break;
        case 'dev':
            log('Serving angular app and proxying api request to dev server...');
            serveDevApp();
            break;
        default:
            log('Serving angular mock app...');
            serveMockApp();
            break;
    }

    function serveProductionApp() {
        gulp.watch([config.sass], ['sass']);
        var proxy = proxyMiddleware(config.proxy.prodcution.route, {target: config.proxy.prodcution.url});
        serveApp();

    }

    function serveDevApp() {
        gulp.watch([config.sass], ['sass']);
        var proxy = proxyMiddleware(config.proxy.dev.route, {target: config.proxy.dev.url});
        serveApp();
    }


    function serveApp(){
        options.host= config.proxy.dev.host;
        options.server = {
            baseDir: [
                config.dist
            ],
            middleware: [proxy]
        };
        options.files = [
            config.src + '/**/*.*',
            '!' + config.sass,
            config.tmp + '/**/*.css'
        ];
        browserSync(options);        
    }



    function serveMockApp() {
        gulp.watch([config.sass], ['sass']);
        options.server = {
            baseDir: [
                config.src,
                config.tmp
            ]
        };
        options.files = [
            config.src + '/**/*.*',
            '!' + config.sass,
            config.tmp + '/**/*.css'
        ];

        browserSync(options);
    }

    function serveDistApp() {
        options.server = {
            baseDir: [
                config.dist
            ]
        };
        options.files = [];

        browserSync(options);
    }

    function serveDocs() {
        gulp.watch([config.docsJade], ['jade-docs']);

        options.server = {
            baseDir: [
                config.docs
            ]
        }

        options.files = [
            config.docs + '/index.html',
            '!' + config.jade
        ];

        browserSync(options);
    }

}