import { iEngine } from '../iEngine';


import { Helpers } from './Helpers';

export class Handlebars implements iEngine {
    private handlebarsBin = '../node_modules/.bin/handlebars ';
    private templateFolder = 'src/views/templates/';
    private partialFolder = 'src/views/partials';

    private outputFolder = 'src/';
    private templateOutput = 'templates.js';
    private partialOutput = 'partials.js';

    public readonly dependencies = ['handlebars'];

    public readonly loadTemplates =
    `
    const handlebars = require('handlebars/runtime');
    require('./templates.js');
    require('./partials.js');
    require('./HbsHelpers')(Handlebars);
    `;

    public readonly assignEngine = 'handlebars.templates';

    public readonly scripts = {
        'spa:engine': this.handlebarsBin + this.templateFolder + ' --extension hbs --output ' + this.outputFolder + this.templateOutput + ' --commonjs handlebars/runtime --min',
        'spa:engine:partials': this.handlebarsBin + this.partialFolder + ' --extension hbs --output ' + this.outputFolder + this.partialOutput + ' --commonjs handlebars/runtime --map'
    }

    public readonly createPages = {
        'hbsHelpers.js': Helpers
    };
}