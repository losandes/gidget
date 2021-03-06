Hilary.scope('node-example').register({
    name: 'homeController',
    dependencies: ['newGidgetModule', 'GidgetRoute', 'locale', 'viewEngine', 'router'],
    factory: function (self, GidgetRoute, locale, viewEngine, router) {
        'use strict';

        self.get['/'] = function () {
            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: locale.pages.home.empty.body
                },
                after: function (vm) {
                    console.log(vm);
                }
            });
        };

        // Route with `before` and `after` pipelines
        self.get['/example1'] = new GidgetRoute({
            routeHandler: function (err, req) {
                req.title = 'example1';

                viewEngine.setVM({
                    template: 't-empty',
                    data: {
                        heading: locale.pages.home.empty.heading,
                        body: '/example1'
                    }
                });
            },
            before: function (err, res) {
                console.log('before example 1 route', res);
            },
            after: function (err, res) {
                console.log('after example 1 route', res);
            }
        });

        // Single route handler for a route
        self.get['/example2'] = function (err, req) {
            req.title = 'example2';

            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: '/example2'
                }
            });
        };

        self.get['/example/immediate/navigate'] = function (err, req) {
            req.title = 'immediate nav';
            router.navigate('/example/immediate/navigate/2');
        };

        self.get['/example/immediate/navigate/2'] = function (err, req) {
            req.title = 'immediate nav 2';

            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: '/example2'
                }
            });
        };

        self.post['/example/post'] = function (err, req) {
            console.log('post', err, req);
        };

        return self;
    }
});
