declare module Spa {
	export class RouteMapper {
		static runOnNextChange: Function;
		static runOnChange: Function;
		static init(): void;
	    /**
	     * Changes the current hash without notifying Crossroads, to prevent any parsing and redirecting of hash
	     * @param  {string} hash to silently change
	     */
		static setHashSilently(hash: string): void;
		static setHash(hash: string): void;
		static isHash(hash: string): boolean;
	    /**
	     * Add a route to which should be searched on a hashChange event
	     * @param  {string} path to listen for
	     * @param  {Function} func to run if route matches
	     */
		static addRoute(path: string, func: Function): void;
		static hashChange(newHash: string, oldHash: string): void;
	}

	export class App {
		static namespace: Object;
		static container: string;
		init(): void;
	    /**
	     * Generates the html for rendering the set route template
	     * @param  {object} data      to pass to template
	     * @param  {string} template  name to render
	     * @param  {string} container id which template should replace
	     */
		static generateHtml(data: Object, template: string): void;
	    /**
	     * Renders the error page
	     */
		static renderErrorPage(): void;
	}

	export type Protocol = 'http' | 'https';
	export interface iOptions {
		protocol: Protocol;
		encoding: string;
		port?: number;
		error: Function;
	}
	export class HttpClient {
		private url;
		private headers;
		private options;
		private error;
		private keepAliveAgent;
		constructor(url: string, options?: iOptions);
		setError(error: Function): void;
		addHeader(key: string, value: string): void;
		setHeader(headers: Object): void;
		getHeaders(): Object;
	    /**
	      * do a GET request to given path of the global URL defined for the class
	      * @param  {string}   path the path which to do a get request
	      * @param  {object}   data that should be sent with request
	      * @param  {Function} next function to run when request is done
	      */
		get(path: string, data: Object, next: Function): void;
	    /**
	     * do a POST request to given path of the global URL defined for the class
	     * @param  {string}   path the path which to do a get request
	     * @param  {object}   data that should be sent with request
	     * @param  {Function} next function to run when request is done
	     */
		post(path: string, data: Object, next: Function): void;
	    /**
	     * do a PUT request to given path of the global URL defined for the class
	     * @param  {string}   path the path which to do a get request
	     * @param  {object}   data that should be sent with request
	     * @param  {Function} next function to run when request is done
	     */
		put(path: string, data: Object, next: Function): void;
	    /**
	     * do a DELETE request to given path of the global URL defined for the class
	     * @param  {string}   path the path which to do a get request
	     * @param  {object}   data that should be sent with request
	     * @param  {Function} next function to run when request is done
	     */
		delete(path: string, data: Object, next: Function): void;
		request(type: string, path: string, data: Object, next: Function): void;
		private responseHandler(response, next);
	}

	export interface iRoute {
		container: string;
		setRouteTitle(title: string): any;
		getRouteTitle(): string;
		getRoute(): string;
		initRoutes(): any;
		addRoute(path: string, func: Function): any;
		render(template: string): any;
	}

	export abstract class Route implements iRoute {
		private route;
		private title;
		container: string;
		constructor(route: string);
		setRouteTitle(title: string): void;
		getRouteTitle(): string;
		getRoute(): string;
	    /**
	     * Initializes routes
	     */
		abstract initRoutes(): any;
		addRoute(path: string, func: Function): void;
	    /**
	     * Renders a hbs template file, defined in views folder:
	     * views/templates/pages/*
	     */
		render(template: string): void;
	}
}

export = Spa;