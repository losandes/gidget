/*globals Hilary*/
Hilary.scope('GidgetContainer').register({
    name: 'locale::en_US',
    factory: {
        errors: {
            interfaces: {
                requiresImplementation: 'An implementation is required to create a new instance of an interface',
                requiresProperty: 'The implementation is missing a required property: ',
                requiresArguments: 'The implementation of this function requires the arguments: ',
                notAnIRouteEngine: 'The router instance that was passed into the RouteEngine constructor does not implement IRouteEngine',
                notAnIGidgetApp: 'The gidgetApp instance that were passed into the GidgetApp constructor does not implement IGidgetApp',
                notAnIGidgetModule: 'The module that you are trying to register does not implement IGidgetModule',
                missingOptions: 'To create a Gidget instance, you must provide the minimum required options'
            }
        }
    }
});