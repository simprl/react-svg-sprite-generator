#!/usr/bin/env node
const path = require('path');
const { exec } = require('child_process');
const args = process.argv.slice(2).join(' ');
const gulpfile = `${__dirname}/gulpfile.js`;
const cwd = process.env.PWD || process.cwd();

exec(`gulp svg-sprite -f ${gulpfile} --cwd ${cwd} ${args}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
