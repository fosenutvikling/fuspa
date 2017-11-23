import { Main } from './Main';
import { tsconfig } from './tsconfig';
import { iEngine } from '../Engines/iEngine';
import { envSlash, createFolder, IFileContent } from '../Functions';

// tasks
import { liveServerJs } from './tasks/liveServerJs';
import { webpackJs } from './tasks/wepackJs';
import { baseJs } from './tasks/baseJs';
import { sassJs } from './tasks/sassJs';
import { assembleJs } from './tasks/assembleJs';

// styles
import { mainScss } from './styles/mainScss';

import { headerHbs, layoutHbs, pageHbs } from './assemble';

export class ProjectFiles {
    private projectFolder;
    private engine: iEngine;
    private mainFile: string;

    private outFolder = './dist';
    private assetsFolder = '/assets';

    private assembleDir;
    public constructor(engine: iEngine, projectFolder: string, mainFile: string) {
        this.projectFolder = projectFolder;
        this.mainFile = mainFile;
        this.engine = engine;
        this.assembleDir = this.projectFolder + envSlash() + 'src' + envSlash() + 'views' + envSlash() + 'assemble';
    }

    public get dependencies() {
        return ['live-server', 'webpack', 'node-sass',
            'assemble', 'gulp-extname'
        ]
    }

    private createProjectFolders() {
        return createFolder(this.projectFolder) &&
            createFolder(this.projectFolder + envSlash() + 'src') &&
            createFolder(this.projectFolder + envSlash() + 'src' + envSlash() + 'app') &&
            createFolder(this.projectFolder + envSlash() + 'src' + envSlash() + 'styles') &&
            createFolder(this.projectFolder + envSlash() + 'src' + envSlash() + 'views') &&
            createFolder(this.assembleDir) &&
            createFolder(this.assembleDir + envSlash() + 'pages') &&
            createFolder(this.assembleDir + envSlash() + 'layouts') &&
            createFolder(this.assembleDir + envSlash() + 'partials') &&
            createFolder(this.projectFolder + envSlash() + 'tasks') &&
            createFolder(this.projectFolder + envSlash() + 'static') &&
            createFolder(this.projectFolder + envSlash() + 'static' + envSlash() + 'fonts') &&
            createFolder(this.projectFolder + envSlash() + 'static' + envSlash() + 'images');
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
                textContent: assembleJs([{
                    task: 'default',
                    pages: './src/views/assemble/pages/*.hbs',
                    layout: './src/views/assemble/layouts/baseLayout.hbs',
                    partials: './src/views/assemble/partials/*.hbs'
                }], this.outFolder)
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
        let files: IFileContent[] = [
            {
                filename: 'partials/header.hbs',
                textContent: headerHbs()
            },
            {
                filename: 'pages/simplePage.hbs',
                textContent: pageHbs()
            },
            {
                filename: 'layouts/baseLayout.hbs',
                textContent: layoutHbs()
            }
        ];

        return this.writeFiles(this.assembleDir, files)
    }

    private createEngineFiles() {
        let files = this.engine.createPages();

        return this.writeFiles(this.projectFolder, files);
    }

    private writeFiles(folder: string, files: IFileContent[]) {
        for (let i = 0; i < files.length; ++i) {
            const file = folder + envSlash() + files[i].filename;
            console.log("file to write: ", files[i].filename);
            /*fs.writeFile(file, files[i].textContent, error => {
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
        return this.createProjectFolders() &&
            this.createTaskFiles() &&
            this.createStyleFiles() &&
            this.createSrcFiles() &&
            this.createProjectFiles() &&
            this.createAssembleFiles() &&
            this.createEngineFiles(); // ./src/views. should probably do something else..
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
