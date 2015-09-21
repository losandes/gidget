/*jshint unused: false*/
Hilary.scope('gidget-tests').register({
    name: 'pipeline.fixture',
    dependencies: ['describe', 'it', 'expect', 'xdescribe', 'xit'],
    factory: function (describe, it, expect, xdescribe, xit) {
        'use strict';

        describe('Gidget DefaultRouteEngine pipelines', function () {

            describe('when before.routeResolution has a registered handler', function () {

                it('should pass the path into the handler', function (done) {
                    // given
                    var sutPath = '/pipeline/before/routeResolution/path';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeResolution(function (err, req) {
                                if (req.uri.path === sutPath) {
                                    // then
                                    expect(req.uri.path).to.equal(sutPath);
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {

                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });

                it('should be able to affect the path', function (done) {
                    // given
                    var sutPath = '/pipeline/before/routeResolution/path/affect',
                        affectedPath = '/pipeline/before/routeResolution/path/affected';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeResolution(function (err, req, next) {
                                if (req.uri.path === sutPath) {
                                    req.uri.path = affectedPath;
                                }
                                next(err, req);
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[affectedPath] = function (err, req) {
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });

            }); // /before.routeResolution

            describe('when after.routeResolution has a registered handler', function () {
                it('should pass the request into the handler', function (done) {
                    // given
                    var sutPath = '/pipeline/after/routeResolution/path';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.after.routeResolution(function (err, req) {
                                if (req.uri.path === sutPath) {
                                    // then
                                    expect(req.route.source).to.equal(sutPath);
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {

                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });
            }); // /after.routeResolution

            describe('when before.routeExecution has a registered handler', function () {
                it('should be able to modify the params', function (done) {
                    // given
                    var sutPath = '/pipeline/before/routeExecution/params';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeExecution(function (err, req, next) {
                                if (req.uri.path === sutPath) {
                                    req.params = { foo: 'bar' };
                                }

                                next(err, req);
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {
                                expect(req.params.foo).to.equal('bar');
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });
            }); // /before.routeExecution

            describe('when after.routeExecution has a registered handler', function () {
                it('should receive the request as passed by the route handler', function (done) {
                    // given
                    var sutPath = '/pipeline/after/routeExecution';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.after.routeExecution(function (err, req) {
                                if (req.uri.path === sutPath) {
                                    expect(req.foo).to.equal('bar');
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req, next) {
                                req.foo = 'bar';
                                next(null, req);
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });

                it('should receive an error if one is passed earlier in the pipeline', function (done) {
                    // given
                    var sutPath = '/pipeline/after/routeExecution/err';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.after.routeExecution(function (err, req) {
                                if (req.uri.path === sutPath) {
                                    expect(err.status).to.equal(500);
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req, next) {
                                next({ status: 500 }, req);
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });
            }); // /after.routeExecution

            describe('when on.error has a registered handler', function () {
                it('should get called, when an error event is triggered', function (done) {
                    // given
                    var sutPath = '/pipeline/on/errror';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeResolution(function (err, req, next) {
                                next({ status: 500, path: sutPath });
                            });

                            pipeline.on.error(function (err) {
                                if (err.data.path === sutPath) {
                                    expect(err.data.status).to.equal(500);
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req, next) {
                                next(null, req);
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });
            }); // /on.error

            describe('when the once property is true on an event', function () {
                it('should remove the event from the pipeline', function (done) {
                    // given
                    var sutPath = '/pipeline/once',
                        count = 0;

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeResolution(new gidgetApp.PipelineEvent({
                                eventHandler: function (err, req) {
                                    if (req.uri.path === sutPath) {
                                        count += 1;
                                    }
                                },
                                once: true
                            }));
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {

                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                            gidgetApp.routeEngine.navigate(sutPath, null, false);

                            // then
                            expect(count).to.equal(1);
                            done();
                        }
                    });
                });
            });

            describe('when the remove condition is declared on an event', function () {
                it('should remove the event from the pipeline when remove returns true', function (done) {
                    // given
                    var sutPath = '/pipeline/once',
                        count = 0;

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeResolution(new gidgetApp.PipelineEvent({
                                eventHandler: function (err, req) {
                                    if (req.uri.path === sutPath) {
                                        count += 1;
                                    }
                                },
                                // remove: when
                                remove: function (err, req) {
                                    if (req.uri.path === sutPath) {
                                        return true;
                                    }
                                }
                            }));
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {

                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                            gidgetApp.routeEngine.navigate(sutPath, null, false);

                            // then
                            expect(count).to.equal(1);
                            done();
                        }
                    });
                });

                it('should NOT remove the event from the pipeline when remove does not return true', function (done) {
                    // given
                    var sutPath = '/pipeline/once',
                        count = 0;

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeResolution(new gidgetApp.PipelineEvent({
                                eventHandler: function (err, req) {
                                    if (req.uri.path === sutPath) {
                                        count += 1;
                                    }
                                },
                                // remove: when
                                remove: function (err, req) {
                                    if (req.uri.path === sutPath && count === 2) {
                                        return true;
                                    }
                                }
                            }));
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {

                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                            gidgetApp.routeEngine.navigate(sutPath, null, false);

                            // then
                            expect(count).to.equal(2);
                            done();
                        }
                    });
                });
            });

        }); // pipelines
    }
});