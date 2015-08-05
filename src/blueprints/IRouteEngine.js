Hilary.scope('gidget').register({
    name: 'IRouteEngine',
    dependencies: ['Blueprint'],
    factory: function (Blueprint) {
        'use strict';

        return new Blueprint({
            __blueprintId: 'IRouteEngine',
            get: {
                type: 'function',
                args: ['path']
            },
            post: {
                type: 'function',
                args: ['path']
            },
            put: {
                type: 'function',
                args: ['path']
            },
            del: {
                type: 'function',
                args: ['path']
            },
            navigate: {
                type: 'function',
                args: ['path', 'data', 'pushStateToHistory']
            },
            register: {
                type: 'blueprint',
                blueprint: new Blueprint({
                    __blueprintId: 'IRouteEngine.register',
                    get: {
                        type: 'function',
                        args: ['path', 'callback']
                    },
                    post: {
                        type: 'function',
                        args: ['path', 'callback']
                    },
                    put: {
                        type: 'function',
                        args: ['path', 'callback']
                    },
                    del: {
                        type: 'function',
                        args: ['path', 'callback']
                    },
                })
            },
            resolveRoute: {
                type: 'function',
                args: ['path', 'verb']
            },
            resolveAndExecuteRoute: {
                type: 'function',
                args: ['path', 'verb']
            },
            start: 'function',
            dispose: 'function',
            pipeline: 'object'
        });
    }
});
