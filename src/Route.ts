import {iRoute} from './iRoute';
import {RouteMapper} from './RouteMapper';
import {App} from './App';

export abstract class Route implements iRoute {
    private route: string;//the url path of the current route
    private title: string;//title of current route
    container: string;//container which should replace the dynamic html-page

    constructor(route: string) {
        this.route = route;
        this.title = null;
    }

    setRouteTitle(title: string) {
        this.title = title;
    }

    getRouteTitle(): string {
        return this.title;
    }

    getRoute(): string {
        return this.route;
    }

    /**
     * Initializes routes
     */
    abstract initRoutes();

    addRoute(path: string, func: Function) {
        RouteMapper.addRoute(this.route + path, func);
    }

    /**
     * Renders a hbs template file, defined in views folder:
     * views/templates/pages/*
     */
    render(template: string) {
        App.generateHtml(null, 'pages/' + template);
    }
}