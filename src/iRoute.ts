module Spa {
    export interface iRoute {
        container: string;//html dom-id which should be replaced with html for current route
        
        setRouteTitle(title: string);//set route title
        getRouteTitle(): string;//retrieve route title

        getRoute(): string;//retrieve the route which module is made accessible

        initRoutes();//initializes all routes for module
        addRoute(path: string, func: Function);//add route, listen for access
        render(template: string);//render template
    }
}