Hilary.scope('gidget-tests').register({
    name: 'gidget.browser.bootstrappers.sammy.fixture',
    dependencies: ['describe', 'it', 'expect'],
    factory: function (describe, it, expect) {
        'use strict';

        describe('Gidget Sammy Bootstrapper', function () {

            it('should exist on window', function () {
                expect(window.Gidget).to.not.equal(undefined);
            });

        });
    }
});