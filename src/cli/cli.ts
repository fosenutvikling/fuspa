import { ProjectFiles } from './ProjectFiles/ProjectFiles';
import * as npm from 'global-npm';
import * as npmAddScript from 'npm-add-script';
import { Handlebars } from './Engines/Handlebars/Handlebars';
import { envSlash } from './Functions';

import * as fs from 'fs';

const engine = new Handlebars('src/views', 'src/app'); // TOOD: add constructor parameter

// Initialize package.json
npm.load({}, function (error) {
    if (error) {
        console.error(error);
        return;
    } else {
        //console.log("NPM", npm);
        //npm.commands.init();
        //npm.commands['install-test'](projectFiles.dependencies); // TODO: continue here
        //npm.commands.install(engine.dependencies);

        const scripts = engine.scripts();
        Object.keys(scripts).forEach(key => {
            try {
                npmAddScript({ key: key, value: scripts[key] });
            }
            catch (e) {
                console.error("Ex", e);
            }
        });
    }
});

// Create project folder
let name = 'test';
let configFile = process.cwd() + envSlash() + 'spa.options.js';

const config = require(configFile);

const projectFiles = new ProjectFiles(engine, process.cwd() + envSlash() + name, 'main.ts');
projectFiles.write();

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
