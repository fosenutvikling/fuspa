import { ProjectFiles } from './ProjectFiles/ProjectFiles';
import * as npm from 'global-npm';
import * as npmAddScript from 'npm-add-script';
import { Handlebars } from './Engines/Handlebars/Handlebars';
import { envSlash } from './Functions';

import * as fs from 'fs';
import { iEngine } from './Engines/iEngine';

export interface IConfig {
    engine: 'handlebars',
    container: string,
    name: string,
    mainFile: string
}

export class SpaProject {
    private engine: iEngine;
    private projectFiles: ProjectFiles;
    private config: IConfig;

    constructor(config: IConfig) {
        this.config = config;
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
        //this.projectFiles.write();
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

//let configFilePath = process.cwd() + envSlash() + 'spa.options.js';