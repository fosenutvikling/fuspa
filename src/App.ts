import {RouteMapper} from './RouteMapper';

export class App {
    static namespace: Object = null; //handlebars namespace - same as defined in config.js in root folder
    static container: string = null;

    init() {
        RouteMapper.init();
    }

    /**
     * Generates the html for rendering the set route template
     * @param  {object} data      to pass to template
     * @param  {string} template  name to render
     * @param  {string} container id which template should replace
     */
    static generateHtml(data: Object, template: string) {
        var hbsTemplate = App.namespace[template];

        if (hbsTemplate !== undefined) {
            var html = App.namespace[template](data);
            var element = document.getElementById(App.container);
            if (element === null)
                throw "Couldn\'t find element. Is DOM ready?";
            document.getElementById(App.container).innerHTML = html;
        } else
            App.renderErrorPage();
    }

    /**
     * Renders the error page
     */
    static renderErrorPage(): void {
        App.generateHtml(null, '404');
    }
}