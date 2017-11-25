require('source-map-support').install()

import { ProjectFiles } from './ProjectFiles/ProjectFiles';
import * as npm from 'global-npm';
import * as npmAddScript from 'npm-add-script';
import { Handlebars } from './Engines/Handlebars/Handlebars';
import { envSlash } from './Functions';

import * as fs from 'fs';
import { iEngine } from './Engines/iEngine';

interface IConfig {
    engine: 'handlebars',
    container: string,
    name: string,
    mainFile: string
}

class SpaProject {
    private engine: iEngine;
    private projectFiles: ProjectFiles;
    private config: IConfig;

    constructor(config: IConfig) {
        this.config = config;
        console.log("Current config: ", this.config);
        this.verifyConfig();
        this.loadScript();
    }

    private verifyConfig() {
        if (SpaProject.ContainsSlash(this.config.name))
            throw Error('Name cannot contain a `/` character');
        if (SpaProject.ContainsSlash(this.config.mainFile))
            throw Error('Mainfile cannot contain a `/` character');
        if (!this.config.container.match(/^[A-Za-z]+$/))
            throw Error('Container can only consist of characters [a-z]' + this.config.container.search(/[^a-zA-Z]+/));
    }

    private loadScript() {
        this.loadEngine();
        this.projectFiles = new ProjectFiles(this.engine, process.cwd() + envSlash() + this.config.name, this.config.mainFile);
    }

    private loadEngine() {
        switch (this.config.engine) {
            case 'handlebars':
                this.engine = new Handlebars('src/views', 'src/app');
                break;

            default:
                throw Error('Unknown engine type: ' + this.config.engine);
        }
    }

    public create() {
        this.runNpm();
        this.projectFiles.write();
    }

    private runNpm() {
        npm.load({}, error => {
            if (error) {
                console.error(error);
                return;
            } else {
                npm.commands.init();
                npm.commands['install-test'](this.projectFiles.dependencies);
                npm.commands.install(this.engine.dependencies);

                const scripts = this.engine.scripts();

                SpaProject.AddNpmScript(this.engine.scripts());
                SpaProject.AddNpmScript(this.projectFiles.scripts());
            }
        });
    }

    static AddNpmScript(scripts) {
        Object.keys(scripts).forEach(key => {
            try {
                npmAddScript({ key: key, value: scripts[key] });
            }
            catch (exception) {
                console.error('Exception:', exception);
            }
        });
    }

    static ContainsSlash(str: string) {
        return str.indexOf('/') >= 0;
    }
}

let configFilePath = process.cwd() + envSlash() + 'spa.options.js';

let config: IConfig = {
    engine: 'handlebars',
    container: 'container',
    name: 'spa-starter',
    mainFile: 'main.ts'
};

try {
    const loadedConfig: IConfig = require(configFilePath);

    // Load default values for keys not set in required config
    config.engine = loadedConfig.engine || config.engine;
    config.container = loadedConfig.container || config.container;
    config.name = loadedConfig.name || config.name;
    config.mainFile = loadedConfig.mainFile || config.mainFile;
}
catch (exception) {
    console.error('Couldn\'t locate spa.options.js, using default config');
}

const project = new SpaProject(config);
//project.create();

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
