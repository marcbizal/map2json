#! /usr/bin/env node

let program = require('commander');
let chalk = require('chalk');
let path = require('path');
let fs = require('fs');

import LRRMap from './map.js';

program
    .version('0.0.1')
    .usage('<folder> [options]')
    .option('-o, --output [file]', 'name of output json file')
    .option('-a, --all', 'finds all subfolders and attempts to convert them')
    .option('-c, --cfg [file]', 'path to game configuration file')
    .parse(process.argv);

const MAP_REGEX = /(cror|path|dugg|high|surf|fall).*map/i;
let dir = (program.args.length ? path.join(process.cwd(), program.args[0]) : null);
if (dir) {
    if (fs.statSync(dir).isDirectory()) {
        fs.readdir(dir, (error, files) => {
            if (error) {
                console.log(`Error finding ${files}!`);
            } else {
                for (let file of files) {
                    if (fs.statSync(path.join(dir, file)).isFile()) {
                        if (file.match(MAP_REGEX))
                        {
                            let map = new LRRMap(path.join(dir, file));
                        }
                    }
                }
            }
        });
    }
} else if (program.all) {
    fs.readdir(process.cwd(), (error, files) => {
        for (let file of files) {
            if (fs.statSync(file).isDirectory()) {
                // Attempt to convert
            }
        }
    });
} else {
    program.help();
    process.exit(1);
}
