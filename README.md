# fuspa

__fuspa__ is a library for creating a Single-Page-Application, written in TypeScript. 

fuspa is using [url-pattern](https://github.com/snd/url-pattern), for matching with routes, and [hasher](https://github.com/millermedeiros/Hasher), for listening on url-hash changes.

Use this library to quickly create your own SPA with minimal effort.

## Getting Started

To get started quickly, use [fuspa-cli](https://github.com/fosenutvikling/fuspa-cli).

fuspa requires an id reference to a html-element, and a setup of a render-engine. 

```
fuspa.Route.options = {
    container: 'container',
    templateEngine: Handlebars.templates
};
```

fuspa parses url-routes, renders a view using a render-engine. A http-client is also included, everything you need to get started with your own single-page-application.
