const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');
const webpack = require('webpack-stream');
const { execFileSync } = require('node:child_process');
const { version } = require('./package.json');

/* Remove all compiled files */
function cleanDist() {
  return gulp.src('dist', { allowEmpty: true }).pipe(clean());
}

/**
 * CSS tasks
 */

/* Build the CSS from source */
function compileCSS() {
  const outputNames = {
    ofh: 'ofh-design-system-toolkit',
    'ofh-participant': 'ofh-design-system-toolkit-participant',
    'ofh-research': 'ofh-design-system-toolkit-research',
  };

  return gulp
    .src(['ofh.scss', 'ofh-participant.scss', 'ofh-research.scss'])
    .pipe(sass.sync({ 
      api: 'modern-compiler',
      quietDeps: true,
    }))
    .pipe(
      rename((path) => {
        path.basename = outputNames[path.basename] || path.basename;
      }),
    )
    .pipe(gulp.dest('dist/'))
    .on('error', (err) => {
      console.error(err);
      process.exit(1);
    });
}

/* Minify CSS and add a min.css suffix */
function minifyCSS() {
  return gulp
    .src([
      'dist/*.css',
      '!dist/*.min.css', // don't re-minify minified css
    ])
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: `-${version}.min`,
      }),
    )
    .pipe(gulp.dest('dist/'));
}

/**
 * JavaScript tasks
 */

/* Use Webpack to build and minify the Our Future Health components JS. */
function webpackJS() {
  return gulp
    .src('./ofh.js')
    .pipe(
      webpack({
        mode: 'production',
        stats: {
          preset: 'errors-warnings',
          colors: true,
          timings: true,
        },
        module: {
          rules: [
            {
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            },
          ],
        },
        output: {
          filename: 'ofh-design-system-toolkit.js',
        },
        target: 'web',
      }),
    )
    .pipe(gulp.dest('./dist'));
}

/* Minify the JS file for release */
function minifyJS() {
  return gulp
    .src([
      'dist/*.js',
      '!dist/*.min.js', // don't re-minify minified javascript
    ])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(gulp.dest('dist/'));
}

/* Version the JS file for release */
function versionJS() {
  return gulp
    .src([
      'dist/*.js',
      '!dist/*.min.js', // don't re-minify minified javascript
    ])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: `-${version}.min`,
      }),
    )
    .pipe(gulp.dest('dist/'));
}

/**
 * Assets tasks
 */

function buildMaterialIconSprite(done) {
  execFileSync('node', ['scripts/build-material-icon-sprite.js'], {
    stdio: 'inherit',
  });

  done();
}

/**
 * Copy assets such as icons and images into the distribution
 */
function assets() {
  return gulp.src('assets/**').pipe(gulp.dest('dist/assets/'));
}

/**
 * Release tasks
 */

/* Copy JS files into their relevant folders */
function jsFolder() {
  return gulp
    .src('dist/*.min.js', '!dist/js/ofh-design-system-toolkit.min.js')
    .pipe(clean())
    .pipe(gulp.dest('dist/js/'));
}

/* Copy CSS files into their relevant folders */

function cssFolder() {
  return gulp.src('dist/*.min.css').pipe(clean()).pipe(gulp.dest('dist/css/'));
}

function createZip() {
  return gulp
    .src(
      [
        'dist/css/*.min.css',
        'dist/js/*.min.js',
        'dist/assets/**',
        '!dist/js/ofh-design-system-toolkit.min.js',
      ],
      { base: 'dist' },
    )
    .pipe(zip(`ofh-design-system-toolkit-${version}.zip`))
    .pipe(gulp.dest('dist'));
}

/**
 * Development tasks
 */

/* Recompile CSS, JS and docs when there are any changes,
   ignoring the dist folder */
function watch() {
  gulp.watch(['./**/*', '!dist/**'], gulp.series(['build']));
}

gulp.task('clean', cleanDist);

gulp.task('style', compileCSS);

gulp.task('build', gulp.series([buildMaterialIconSprite, compileCSS, webpackJS]));

gulp.task(
  'bundle',
  gulp.series([
    cleanDist,
    'build',
    minifyCSS,
    minifyJS,
    versionJS,
    assets,
  ]),
);

gulp.task(
  'zip',
  gulp.series(['bundle', assets, jsFolder, cssFolder, createZip]),
);

gulp.task('watch', watch);
