const npmAddScript = require('npm-add-script');
// TODO: continue here. engine should work :)

const handlebars = {
    dependencies: ['handlebars'],
    loadTemplates: `const handlebars = require('handlebars/runtime');
    require('./templates.js');
    require('./partials.js');
    require('./HbsHelpers')(Handlebars);
    `,
    assignEngine: 'handlebars.templates',
    scripts: function() {
        npmAddScript({
            key: 'spa:engine',
            value: handlebarsBin + templateFolder + ' --extension hbs --output ' + outputFolder + templateOutput + ' --commonjs handlebars/runtime --min'
        });
        npmAddScript({
            key: 'spa:engine:partials',
            value: handlebarsBin + partialFolder + ' --extension hbs --output ' + outputFolder + partialOutput + ' --commonjs handlebars/runtime --map'
        });
    }
};

module.exports.handlebars = handlebars;
