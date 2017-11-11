import * as npm from 'global-npm';
import * as npmAddScript from 'npm-add-script';
import { Handlebars } from './Engines/Handlebars';
import * as fs from 'fs';

const engine = new Handlebars();

// Initialize package.json
npm.load({}, function (error) {
    if (error) {
        console.error(error);
        return;
    }
    else {
        npm.commands.init();
        npm.commands.install(engine.dependencies);

        Object.keys(engine.scripts).forEach(key => {
            npmAddScript({ key: key, value: engine.scripts[key] });
        });
    }
});

// Create project folder
let name = 'test';
let configFile = __dirname + '/spa.options.js';

const config = require(configFile);

const projectFolder = __dirname + '/' + name + '/';
if (!fs.existsSync(projectFolder))
    fs.mkdirSync(projectFolder);

const sourceFolder = projectFolder + 'src/';
fs.mkdirSync(sourceFolder);

Object.keys(engine.createPages).forEach(key => {
    fs.writeFile(sourceFolder + key, engine.createPages[key], error => {
        if (error) console.error(error);
        else console.log("Created file `" + key + "`");
    });
});

Object.keys(engi)
