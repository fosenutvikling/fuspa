export const Main = (loadTemplates, assignEngine) => {
    return `import * as spa from 'spa';
const routeMapper = spa.RouteMapper.instance;
const route = spa.Route.instance;

// Load engine specific templates
${loadTemplates}

spa.Route.options = {
    container: 'app',
    templateEngine: ${assignEngine}
};


routeMapper.addRoute('/', () => {
    route.title='Home';
    route.render('home');
});

routeMapper.addRoute('/hello/:name', () => {
    route.title = 'Welcome, ' + name + '!';
    route.render('greeting', {id: id});
});

windows.onload = function() {
    route.start();
    routeMapper.listen();
}
`;
};
