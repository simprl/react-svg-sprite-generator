const path = require('path');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const svgstore = require('gulp-svgstore');
const rename = require('gulp-rename');
const sort = require('gulp-sort');
const filelist = require('gulp-filelist');
const log = require('fancy-log');

const getArg = (name, def) => {
    const srcIndex = process.argv.indexOf(name);
    return (srcIndex === -1) ? def : process.argv[srcIndex + 1];
}

const getArgDir = (name, def) => {
    const rootPath = getArg("--cwd", "");
    const relativePath = getArg(name, def);
    const absPath = path.join(rootPath, relativePath);
    console.log(`${name}: ${absPath}`);
    return absPath;
}
const getSrcDir = () => getArgDir('--src', './src/assets/icons');
const getDestDir = () => getArgDir('--dest', './src/components/Icon');

const renameFunc2 = (file) => {
    const path = file.dirname === '.' ? [] : file.dirname.split('\\');
    path.push(file.basename);
    // eslint-disable-next-line no-param-reassign
    file.basename = path
        .join('_')
        .replace(/[^\d\w]+/g, '_')
        .toUpperCase();
};

gulp.task('svg-sprite', () => {
    const src = getSrcDir();
    const dest = getDestDir();
    return gulp
        .src([
            `${src}/**/*.svg`,
            `!${src}/sprite.svg`,
            `!${src}/otherFiles/**/*.svg`,
        ])
        .pipe(rename(renameFunc2))
        .pipe(sort())
        .pipe(
            imagemin([
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: false },
                        { cleanupIDs: false },
                        { removeAttrs: { attrs: ['fill', 'stroke'] } },
                        // { removeElementsByAttr: { id: ('bg') } },
                    ],
                }),
            ])        )
        .pipe(
            svgstore({
                inlineSvg: true,
            })
        )
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest(dest))
    }
);

gulp.task('svg-list', () => {
    let isFirst = true;
    const src = getSrcDir();
    const dest = getDestDir();
    return gulp
        .src([
            `${src}/**/*.svg`,
            `!${src}/sprite.svg`,
            `!${src}/otherFiles/**/*.svg`,
        ])
        .pipe(rename(renameFunc2))
        .pipe(sort())
        .pipe(
            filelist('names.js', {
                relative: true,
                removeExtensions: true,
                destRowTemplate: (filePath) => {

                    const fileName = path.basename(filePath);
                    const name = fileName
                        .replace(/[^\d\w]+/g, '_')
                        .toUpperCase();
                    const prefix = isFirst ? '' : '\r\n';
                    isFirst = false;
                    return `${prefix}// ${filePath}\r\nexport const ${name} = '${fileName}';\r\n`;
                },
            })
        )
        .pipe(gulp.dest(dest));
});
