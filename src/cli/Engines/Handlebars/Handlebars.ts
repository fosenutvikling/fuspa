import { iEngine } from '../iEngine';
import { Helpers } from './Helpers';
import { envSlash } from '../../Functions';
import { homeIndexPage, headerPartial } from './PagesHbs';

export class Handlebars implements iEngine {
    private handlebarsBin = '../node_modules/.bin/handlebars ';
    private templateFolder = '/templates';
    private partialFolder = '/partials';

    public sourceFolder;
    public outputFolder;

    private templateOutput = 'templates.js';
    private partialOutput = 'partials.js';

    public readonly dependencies = ['handlebars'];

    public readonly loadTemplates = `
    const handlebars = require('handlebars/runtime');
    require('./templates.js');
    require('./partials.js');
    require('./HbsHelpers')(Handlebars);
    `;

    public readonly assignEngine = 'handlebars.templates';

    public readonly scripts = () => {
        return {
            'spa:engine':
                this.handlebarsBin + ' ' +
                this.sourceFolder +
                this.templateFolder +
                ' --extension hbs --output ' +
                this.outputFolder +
                this.templateOutput +
                ' --commonjs handlebars/runtime --min',

            'spa:engine:partials':
                this.handlebarsBin + ' ' +
                this.sourceFolder +
                this.partialFolder +
                ' --extension hbs --output ' +
                this.outputFolder +
                this.partialOutput +
                ' --commonjs handlebars/runtime --map'
        };
    };

    public createPages = () => [
        {
            filename: this.outputFolder + '/hbsHelpers.js',
            textContent: Helpers
        },
        {
            filename: this.sourceFolder + this.templateFolder + envSlash() + 'home' + envSlash() + 'index.hbs',
            textContent: homeIndexPage
        },
        {
            filename: this.sourceFolder + this.partialFolder + envSlash() + 'footer.hbs',
            textContent: headerPartial
        }
    ];


    public constructor(sourceFolder, outputFolder) {
        this.sourceFolder = sourceFolder;
        this.outputFolder = outputFolder;
    }
}
