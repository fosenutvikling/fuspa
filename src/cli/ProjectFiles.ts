export class ProjectFiles {
    public static main(loadTemplates: string, assignEngine: string) {
        return `import * as spa from 'spa';
        const routeMapper = spa.RouteMapper.instance;
        
        // Load engine specific templates
        ${loadTemplates}
        
        spa.Route.options = {
            container_ 'app',
            templateEngine: ${assignEngine}
        };
        const route = spa.Route;
        
        routeMapper.addRoute('/', () => {
        
        });
        
        routeMapper.addRoute('/hello', () => {
        
        });`;
    }
}
