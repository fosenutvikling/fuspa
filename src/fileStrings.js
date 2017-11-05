const addRoutes = `import * as spa from 'spa';
const routeMapper = spa.RouteMapper.instance;
// TODO: add handlebars
spa.Route.options = {
    container_ 'app',
    templateEngine:
};
const route = spa.Route;

routeMapper.addRoute('/', () => {

});

routeMapper.addRoute('/hello', () => {

});`


module.exports = addRoutes;