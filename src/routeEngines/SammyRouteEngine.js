Hilary.scope('gidget').register({
    name: 'SammyRouteEngine',
    dependencies: ['BaseRouteEngine'],
    factory: function (RouteEngine) {
        'use strict';

        var SammyRouteEngine = function (sammyInstance) {
            var sammy = sammyInstance,
                routeEngine,
                addRoute;

            routeEngine = new RouteEngine({
                start: function () {
                    sammy.run();
                }
            });

            addRoute = function (verb, path, callback) {
                var baseRoute = routeEngine.addRoute(verb, path, callback);
                sammy.route(verb, baseRoute.route.expression, baseRoute.callback);
            };

            routeEngine.get = function (path, callback) {
                addRoute('get', path, callback);
            };

            routeEngine.post = function (path, callback) {
                addRoute('post', path, callback);
            };

            routeEngine.put = function (path, callback) {
                addRoute('put', path, callback);
            };

            routeEngine.del = function (path, callback) {
                addRoute('del', path, callback);
            };

            routeEngine.navigate = function (hash, updateUrlBar) {
                if (updateUrlBar === undefined) {
                    updateUrlBar = true;
                }

                if (updateUrlBar) {
                    location.hash = hash;
                } else {
                    throw new Error('Navigating without updating the URL bar is not implemented');
                }
            };

            return routeEngine;
        };

        return SammyRouteEngine;
    }
});
