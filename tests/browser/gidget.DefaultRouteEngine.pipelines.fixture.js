Hilary.scope('gidget-tests').register({
    name: 'gidget.DefaultRouteEngine.pipelines.fixture',
    dependencies: ['describe', 'it', 'expect'],
    factory: function (describe, it, expect) {
        'use strict';

        describe('Gidget DefaultRouteEngine pipelines', function () {

            var makeSut = function (scope, ops) {
                Gidget.Bootstrapper(scope, {
                    composeRoutes: function (err, gidgetApp) {
                        var controller = new Gidget.GidgetModule();

                        controller.get['/pipelines'] = function () {};
                        controller.get['/pipelines/breweries/:brewery/beers/:beer'] = function () {};
                        controller.get['/pipelines/error'] = function (err, res, next) { next('error!'); };

                        if (ops.composeRoutes) {
                            ops.composeRoutes(gidgetApp, controller);
                        }

                        gidgetApp.registerModule(controller);
                    },
                    composeLifecycle: function (err, gidgetApp, pipelines) {
                        ops.composeLifecycle(err, gidgetApp, pipelines);
                    }
                });
            };

            describe('when the beforeRouteResolution event has a registered handler', function () {

                it('should pass the path into the handler', function (done) {
                    // given
                    var sutScope = new Hilary(),
                        router;

                    makeSut(sutScope, {
                        composeLifecycle: function (err, gidgetApp, pipelines) {
                            pipelines.beforeRouteResolution(function (err, path) {
                                if (path === '/pipelines/sut/beforeRouteResolution') {
                                    expect(path).to.equal('/pipelines/sut/beforeRouteResolution');
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        }
                    });

                    router = sutScope.resolve('gidgetRouter');

                    // when
                    router.navigate('/pipelines/sut/beforeRouteResolution', null, false);
                });

                it('should be able to affect the path', function (done) {
                    // given
                    var sutScope = new Hilary(),
                        router;

                    makeSut(sutScope, {
                        composeRoutes: function (gidgetApp, controller) {
                            controller.get['/pipelines/sut/beforeRouteResolution/affected'] = function () {
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                        },
                        composeLifecycle: function (err, gidgetApp, pipelines) {
                            pipelines.beforeRouteResolution(function (err, path, next) {
                                if (path === '/pipelines/sut/beforeRouteResolution/affect') {
                                    next(null, '/pipelines/sut/beforeRouteResolution/affected');
                                }
                            });
                        }
                    });

                    router = sutScope.resolve('gidgetRouter');

                    // when
                    router.navigate('/pipelines/sut/beforeRouteResolution/affect', null, false);
                });

            });

        }); // pipelines
    }
});
