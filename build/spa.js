var Spa;
(function (Spa) {
    var App = (function () {
        function App() {
        }
        App.prototype.init = function () {
            Spa.RouteMapper.init();
        };
        /**
         * Generates the html for rendering the set route template
         * @param  {object} data      to pass to template
         * @param  {string} template  name to render
         * @param  {string} container id which template should replace
         */
        App.generateHtml = function (data, template) {
            var hbsTemplate = App.namespace[template];
            if (hbsTemplate !== undefined) {
                var html = App.namespace[template](data);
                var element = document.getElementById(App.container);
                if (element === null)
                    throw "Couldn\'t find element. Is DOM ready?";
                document.getElementById(App.container).innerHTML = html;
            }
            else
                App.renderErrorPage();
        };
        /**
         * Renders the error page
         */
        App.renderErrorPage = function () {
            App.generateHtml(null, '404');
        };
        App.namespace = null; //handlebars namespace - same as defined in config.js in root folder
        App.container = null;
        return App;
    })();
    Spa.App = App;
})(Spa || (Spa = {}));
var Spa;
(function (Spa) {
    var Route = (function () {
        function Route(route) {
            this.route = route;
            this.title = null;
        }
        Route.prototype.setRouteTitle = function (title) {
            this.title = title;
        };
        Route.prototype.getRouteTitle = function () {
            return this.title;
        };
        Route.prototype.getRoute = function () {
            return this.route;
        };
        Route.prototype.addRoute = function (path, func) {
            Spa.RouteMapper.addRoute(this.route + path, func);
        };
        /**
         * Renders a hbs template file, defined in views folder:
         * views/templates/pages/*
         */
        Route.prototype.render = function (template) {
            Spa.App.generateHtml(null, 'pages/' + template);
        };
        return Route;
    })();
    Spa.Route = Route;
})(Spa || (Spa = {}));
var Spa;
(function (Spa) {
    var RouteMapper = (function () {
        function RouteMapper() {
        }
        RouteMapper.init = function () {
            hasher.changed.add(RouteMapper.hashChange); //add hash change listener
            hasher.initialized.add(RouteMapper.hashChange); //add initialized listener (to grab initial value in case it is already set)
            hasher.init(); //initialize hasher (start listening for history changes)
        };
        /**
         * Changes the current hash without notifying Crossroads, to prevent any parsing and redirecting of hash
         * @param  {string} hash to silently change
         */
        RouteMapper.setHashSilently = function (hash) {
            hasher.changed.active = false; //disable changed signal.set hash without dispatching changed signal
            RouteMapper.setHash(hash);
            hasher.changed.active = true; //re-enable signal
        };
        RouteMapper.setHash = function (hash) {
            hasher.setHash(hash);
        };
        RouteMapper.isHash = function (hash) {
            return hash === hasher.getHash();
        };
        /**
         * Add a route to which should be searched on a hashChange event
         * @param  {string} path to listen for
         * @param  {Function} func to run if route matches
         */
        RouteMapper.addRoute = function (path, func) {
            crossroads.addRoute(path, func);
        };
        RouteMapper.hashChange = function (newHash, oldHash) {
            crossroads.parse(newHash);
        };
        return RouteMapper;
    })();
    Spa.RouteMapper = RouteMapper;
})(Spa || (Spa = {}));
//# sourceMappingURL=spa.js.map