const path = require('path');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const svgstore = require('gulp-svgstore');
const rename = require('gulp-rename');
const sort = require('gulp-sort');
const each = require('gulp-each');
const concat = require('gulp-concat');
const sharp = require('sharp');
const gulpClone = require("gulp-clone");
const mergeStream = require('merge-stream');
const gap = require('gulp-append-prepend');

const getArg = (name, def) => {
    const srcIndex = process.argv.indexOf(name);
    return (srcIndex === -1) ? def : process.argv[srcIndex + 1];
}

const getArgDir = (name, def) => {
    const relativePath = getArg(name, def);
    if (relativePath === undefined) {
        return undefined;
    }
    const rootPath = getArg("--cwd", "");
    const absPath = path.isAbsolute(relativePath) ? relativePath : path.join(rootPath, relativePath);
    console.log(`${name}: ${absPath}`);
    return absPath;
}
const getSrcDir = () => getArgDir('--src', 'src/assets/icons');
const getDestDir = () => getArgDir('--dest', 'src/components/Icon');
const getDocDir = () => getArgDir('--doc');

const renameFunc2 = (file) => {
    const path = file.dirname === '.' ? [] : file.dirname.split('\\');
    path.push(file.basename);
    // eslint-disable-next-line no-param-reassign
    file.basename = path
        .join('_')
        .replace(/[^\d\w]+/g, '_')
        .toUpperCase();
};

const renameFunc3 = (filePath) => {

    return filePath.split('\\').join('_')
        .replace(/[^\d\w]+/g, '_')
        .toUpperCase();
};

gulp.task('svg-sprite', () => {
    const src = getSrcDir();
    const dest = getDestDir();
    const namesName = getArg("--names-filename", "names.js");
    const docPath = getDocDir();
    const prependReadme = getArgDir('--prepend-readme');
    const streams = [];
    const optimizeSvg = gulp
        .src([
            `${src}/**/*.svg`,
            `!${src}/sprite.svg`,
            `!${src}/otherFiles/**/*.svg`,
        ])
        .pipe(
            imagemin([
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: false},
                        {cleanupIDs: false},
                        {
                            removeUselessStrokeAndFill: {
                                stroke: true,
                                fill: true,
                                removeNone: true
                            }
                        },
                        {removeAttrs: {attrs: ['fill', 'stroke']}},
                    ],
                }),
            ])
        );

    const sprite = optimizeSvg
        .pipe(gulpClone())
        .pipe(rename(renameFunc2))
        .pipe(sort())
        .pipe(
            svgstore({
                inlineSvg: true,
            })
        )
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest(dest))
    streams.push(sprite);

    const names = optimizeSvg
        .pipe(gulpClone())
        .pipe(each(function (content, file, callback) {
            sharp(content)
                .resize(64, 64)
                .png()
                .toBuffer(function (err, data, info) {
                    if (err) {
                        callback(err);
                    } else {
                        const base64String = `data:image/png;base64,${data.toString('base64')}`;
                        file.contents = Buffer.from(base64String);
                        callback(null, file.contents);
                    }
                });
        }, 'buffer'))
        .pipe(each(function (content, file, callback) {
            const filePath = path.join(
                path.dirname(file.relative),
                path.basename(file.relative, path.extname(file.relative))
            );
            const name = renameFunc3(filePath);

            const result = `/**
 * ![](${content})  
 * ${filePath.split('\\').join('/')}.svg
 */
export const ${name} = '${name}';
`;
            callback(null, result);
        }))
        .pipe(concat(namesName))
        .pipe(gulp.dest(dest));
    streams.push(names);

    let readme = optimizeSvg
        .pipe(gulpClone())
        .pipe(each(function (content, file, callback) {
            const filePath = path.join(
                path.dirname(file.relative),
                path.basename(file.relative, path.extname(file.relative))
            );

            const srcPath = path.join(
                src,
                file.relative,
            );
            const relativePath = path.relative(dest, srcPath);
            const name = renameFunc3(filePath);

            const result = `|  ![](/${relativePath.split('\\').join('/')}) | ${name} | ${filePath.split('\\').join('/')}.svg |`;
            callback(null, result);
        }))
        .pipe(concat('README.md'))
        .pipe(each(function (content, file, callback) {
            const result = `# List of icons
| Source | Name | Path |
|---|---|---|
${content}`;
            callback(null, result);
        }));
    if (prependReadme) {
        readme = readme.pipe(gap.prependFile(prependReadme));
    }
    readme = readme.pipe(gulp.dest(dest));
    streams.push(readme);

    if (docPath) {
        const docs = optimizeSvg
            .pipe(gulpClone())
            .pipe(each(function (content, file, callback) {
                const filePath = path.join(
                    path.dirname(file.relative),
                    path.basename(file.relative, path.extname(file.relative))
                );
                const name = renameFunc3(filePath);

                const result = `        <tr><td>${content}</td><td>${name}</td><td>${filePath.split('\\').join('/')}.svg</td></tr>`;
                callback(null, result);
            }))
            .pipe(concat(path.basename(docPath)))
            .pipe(each(function (content, file, callback) {
                const result = `<!DOCTYPE html>
<html lang="">
    <head>
        <style>
            table {
                border-collapse: collapse;
            }
            th {
                text-align: center;
                border: 1px solid darkgray;
                padding: 4px 8px;
            }
            td {
                text-align: left;
                border: 1px solid darkgray;
                padding: 4px 8px;
            }
        </style>
    </head>
    <body>
        <table>
        <tr><th>Icon</th><th>Name</th><th>Path</th></tr>
        ${content}
        </table>
    </body>
</html>
`;
                callback(null, result);
            }))
            .pipe(gulp.dest(path.dirname(docPath)));

        streams.push(docs);
    }
    return mergeStream(...streams);
});
