export class Route {
    private static _instance;
    public static options: {
        container: string, // Id of html-element which should be replaced by rendered template
        templateEngine: any // Engine to use for rendering
    };

    private _title: string; //title of current route
    private _container: HTMLElement;
    private _engine;

    public static get instance() {
        if (this._instance == null) {
            this._instance = new Route();
        }
        return this._instance;
    }

    private constructor() {
        if (Route.options.container == null)
            throw new Error('Container not set');
        if (Route.options.templateEngine == null)
            throw new Error('TemplateEngine not set');

        this._container = document.getElementById(Route.options.container);
        if (this._container === null)
            throw 'Couldn\'t find element. Is DOM ready?';

        this._engine = Route.options.templateEngine;
    }

    public get container() {
        return this._container;
    }

    public get engine() {
        return this._engine;
    }

    public set title(title: string) {
        this._title = title;
        window.document.title = title;
    }

    public get title(): string {
        return this._title;
    }

    /**
     * Renders a hbs template file
     */
    public render(template: string, data: Object = {}) {
        const html = this.engine[template](data); // App.namespace[template](data);
        this._container.innerHTML = html;
    }
}