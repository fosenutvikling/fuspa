import { Main } from './Main';
import { tsconfig } from './tsconfig';
import { iEngine } from '../Engines/iEngine';
import * as fs from 'fs';

// tasks
import { liveServerJs } from './tasks/liveServerJs';
import { webpackJs } from './tasks/wepackJs';
import { baseJs } from './tasks/baseJs';
import { sassJs } from './tasks/sassJs';
import { assembleJs } from './tasks/assembleJs';

// styles
import { mainScss } from './styles/mainScss';

import { headerHbs, layoutHbs, pageHbs } from './assemble';

export interface IFileContent {
    filename: string;
    textContent: string;
}

export const envSlash = () => {
    return process.platform == 'win32' ? '\\' : '/';
}

export class ProjectFiles {
    private projectFolder;
    private engine: iEngine;
    private mainFile: string;

    private outFolder = './dist';
    private assetsFolder = '/assets';

    public constructor(engine: iEngine, projectFolder: string, mainFile: string) {
        this.projectFolder = projectFolder;
        this.mainFile = mainFile;
        this.engine = engine;
    }

    public get dependencies() {
        return ['live-server', 'webpack', 'node-sass',
            'assemble', 'gulp-extname'
        ]
    }

    private createProjectFolders() {
        return this.createFolder(this.projectFolder) &&
            this.createFolder(this.projectFolder + envSlash() + 'src') &&
            this.createFolder(this.projectFolder + envSlash() + 'src/app') &&
            this.createFolder(this.projectFolder + envSlash() + 'src' + envSlash() + 'styles') &&
            this.createFolder(this.projectFolder + envSlash() + 'src' + envSlash() + 'views') &&
            this.createFolder(this.projectFolder + envSlash() + 'src' + envSlash() + 'views/assemble') &&
            this.createFolder(this.projectFolder + envSlash() + 'src' + envSlash() + 'views/assemble/pages') &&
            this.createFolder(this.projectFolder + envSlash() + 'src' + envSlash() + 'views/assemble/layouts') &&
            this.createFolder(this.projectFolder + envSlash() + 'src' + envSlash() + 'views/assemble/partials') &&
            this.createFolder(this.projectFolder + envSlash() + 'tasks') &&
            this.createFolder(this.projectFolder + envSlash() + 'static') &&
            this.createFolder(this.projectFolder + envSlash() + 'static' + envSlash() + 'fonts') &&
            this.createFolder(this.projectFolder + envSlash() + 'static' + envSlash() + 'images');
    }

    private createFolder(path) {
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        else return true;
        return fs.existsSync(path);
    }

    private createTaskFiles() {
        // Create each file in tasks
        let files: IFileContent[] = [
            {
                filename: 'webpack.js',
                textContent: webpackJs('./src/main.ts', this.outFolder + this.assetsFolder + '/js/bundle.min.js')
            },
            {
                filename: 'liveServer.js',
                textContent: liveServerJs('./dist')
            },
            {
                filename: 'base.js',
                textContent: baseJs()
            },
            {
                filename: 'sass.js',
                textContent: sassJs('./styles/main.scss', this.outFolder + this.assetsFolder + '/css/bundle.min.css')
            },
            {
                filename: 'assemble.js',
                textContent: assembleJs()
            }
        ];

        return this.writeFiles(this.projectFolder + envSlash() + 'tasks', files);
    }

    private createStyleFiles() {
        let files: IFileContent[] = [
            {
                filename: 'main.scss',
                textContent: mainScss()
            }
        ];

        return this.writeFiles(this.projectFolder + envSlash() + 'styles', files);
    }

    private createSrcFiles() {
        let files: IFileContent[] = [
            {
                filename: this.mainFile,
                textContent: Main(this.engine.loadTemplates, this.engine.assignEngine)
            }
        ];

        return this.writeFiles(this.projectFolder + envSlash() + 'src', files);
    }

    private createProjectFiles() {
        let files: IFileContent[] = [
            {
                filename: 'tsconfig.json',
                textContent: tsconfig(this.mainFile)
            }
        ];

        return this.writeFiles(this.projectFolder, files);
    }

    private createAssembleFiles() {
        const assembleDir = this.projectFolder + envSlash() + 'src' + envSlash() + 'views' + envSlash() + 'assemble';
        let files: IFileContent[] = [
            {
                filename: assembleDir + 'partials/header.hbs',
                textContent: headerHbs
            },
            {
                filename: assembleDir + 'pages/simplePage.hbs',
                textContent: pageHbs
            },
            {
                filename: assembleDir + 'layouts/baseLayout.hbs',
                textContent: layoutHbs
            }
        ];
    }

    private writeFiles(folder: string, files: IFileContent[]) {
        for (let i = 0; i < files.length; ++i) {
            const file = folder + envSlash() + files[i].filename;
            console.log("file to write: ", files[i].textContent);
            /*  fs.writeFile(file, files[i].textContent, error => {
                  if (error) {
                      console.error(error);
                      throw Error('Not able to create file: `' + file + '`');
                  }
                  else console.log('Created file: `' + file + '`');
              });*/
        }

        return true;
    }

    public write() {
        return this.createProjectFolders &&
            this.createTaskFiles() &&
            this.createStyleFiles() &&
            this.createSrcFiles() &&
            this.createProjectFiles();
    }

    public scripts() {
        return {
            'build:assemble': './node_modules/.bin/assemble --cwd=tasks',
            'build:sass': 'node tasks/node-sass.js',
            'build:webpack': './node_modules/.bin/webpack --config tasks/webpack.js',
            'start': 'node tasks/liveServer.js'
        }
    }
}
