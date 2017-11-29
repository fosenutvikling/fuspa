export const Main = (loadTemplates, assignEngine, container) => {
    return `import * as spa from 'spa';
const routeMapper = spa.RouteMapper.instance;
const route = spa.Route.instance;

// Load engine specific templates
${loadTemplates}

spa.Route.options = {
    container: '${container}',
    templateEngine: ${assignEngine}
};


routeMapper.addRoute('/', () => {
    route.title='Home';
    route.render('home');
});

routeMapper.addRoute('/hello/:name', name => {
    route.title = 'Welcome, ' + name + '!';
    route.render('greeting', {name: name});
});

window.onload = function() {
    route.start();
    routeMapper.listen();
}
`;
};
