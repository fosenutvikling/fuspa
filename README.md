# SPA

Single-Page-Application typescript classes, for listening and adding routes with the use of `hasher` and `crossroads`. The library expect templates to be used, made available through a global object.

## Install Dependencies

Project dependencies are defined in both `bower.json`, `package.json`, and `typings.json`. You should have [npm](https://nodejs.org/en/), [bower](http://bower.io/), and [typings](https://github.com/typings/typings) to install them.


```sh
npm install -g bower
npm install typings --global
```

Install dependencies:

```sh
npm install
bower install
typings install
```

TypeScript is needed to be installed to compile `.ts` files as well:

```sh
npm install -g typescript
```

## Building

The build tool used is [grunt](http://gruntjs.com/). A build task is defined, and are invoked by running


```sh
grunt build
```

Alternatively scripts defined in `package.json` can be used:

```sh
npm run republish
npm run build
```

### Build Output

Files generated from `*.ts` are located within the `build/` folder. The minified file are located in `dist/`. 

```html
<script src="spa.min.js"></script>
```

## Development

The `d.ts` file should be referenced within the `.ts` files, to help with autocompletion if building on top of the library.

A route should be defined and extend the `Spa.Route` class.


```js
/// <reference path="build/spa.d.ts" />
module Home{
    export class HomeRoute extends Spa.Route{
         constructor(route: string) {
            super(route);//url which route is made accessible
            this.setRouteTitle("Home");//the title of the route
        }
        /**
         * Initializes all routes for the HomeRoute
         */
        initRoutes(){
            var parent=this;
            
            super.addRoute('/',function(){
               parent.render('index'); 
            });
            
             super.addRoute('/{id}',function(id){
               parent.render('details'); 
            });
        }
    }
}
```



To start using the library, the classes should be initialized; for example in a `main.ts` file. Here `JST` is a global object defining holding handlebars templates.

```js
/// <reference path="build/spa.d.ts" />

declare var JST:any;
Spa.App.namespace=JST;
Spa.App.container="content";//dom-id which should be replaced with templates defined in Spa.App.namespace
var app=new Spa.App();

let home=new Home.HomeRoute('home');//route which should make route listener for
home.initRoutes();


window.onload=function(){
    app.init();
}
```

When the url visiting matches `#/home`, the HomeRoute is triggered. For defining routes, take a look at the crossroads documentation for add-route [here](https://millermedeiros.github.io/crossroads.js/#crossroads-add_route).

### Extend Route

Own route classes can be specified as well if more functionality is wanted by implementing the `iRoute` interface, or extending the `Route` class.


### REST

Example of using Rest within the application.

```js
var rest=new Spa.Rest("http://localhost");
rest.headers = {
            "x-access-token": this.credentials.credentials.token,
            'Access-Control-Allow-Origin': '*'
        };
rest.setError(function (error) {
            if (error.code == 401) //user not authorized..
            { //and should be redirected to the login page
                //TODO: redirect login
                return;
            }
        });

```