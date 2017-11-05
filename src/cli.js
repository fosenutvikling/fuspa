#!/usr/bin/env node

//var program = require('commander');

//program
//    .version('0.1.0')
//    .option('-N, --obs <obse>', 'Name of project')
//    .option('-f, --file <path>', 'set config path. defaults to ./spa.options.js', './spa.options.js')
//    .command('<namert>')
//    .parse(process.argv);

//program.parse(process.argv);
/*if (program.obs)
    console.log("program.name", program.obs);
console.log("NAMERT", program.namert);
*/
//if (program.namert)

const fs = require('fs');
const file = require('./fileStrings');

let name = "test";
let configFile = __dirname + '/spa.options.js';

let config = require(configFile);

// Should create folder if it doesn't exist
const folder = __dirname + '/' + name + '/';
if (fs.existsSync(folder) === false)
    fs.mkdirSync(folder);

const files = {
    'file.js': file
};

Object.keys(files).forEach(key => {
    fs.writeFile(folder + key, files[key], error => {
        if (error) console.error(error);
        else console.log("created successful");
    });
});