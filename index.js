/*
* Primary file for the API
* es5
*/

// Dependencies
    var server = require('./lib/server');
    var workers = require('./lib/workers');
// Dependencies

// Declare the [app]
    var app = {};
// Declare the [app]

// Initialization the function [init]
    app.init = function(){
        // Start the server
            server.init(); 
        // Start the server
        // Start the workers
            workers.init(); 
        // Start the workers 
    };
// Initialization the function [init]

// Execute [init]
    app.init();
// Execute [init]

// Export the [app]
    module.exports = app;
// Export the [app]