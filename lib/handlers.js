/*
* Request handlers
*  
*/

// Define [handlers]
    var handlers = {};
// Define [handlers]

// [ping] handler
    handlers.ping = function(data, callback){
        callback(200);
    };
// [ping] handler

// [notFound] handler
    handlers.notFound = function(data, callback){
        // Callback a http status code
            callback(404);
        // Callback a http status code
    };
// [notFound] handler

// Export the module
    module.exports = handlers;
// Export the module
