/*
* Primary file for the API
* es5
*/

// Dependencies
    var http = require('http');
    var https = require('https');
    var url = require('url');
    var StringDecoder = require('string_decoder').StringDecoder;
    var config = require('./lib/config');
    var fs = require('fs');
    var handlers = require('./lib/handlers');
    var helpers = require('./lib/helpers');
    // lib test dependency
        //var _data = require('./lib/data');
    // lib test dependency
// Dependencies

// Testing lib manually

    // Create test
        // _data.create('test', 'newFile',{'foo' : 'bar'}, function(err){
        //     console.log('this was the error', err);
        // });
    // Create test
    // Read test
        // _data.read('test', 'newFile', function(err, data){
        //     console.log('this was the error', err, 'and this was the data', data);
        // });
    // Read test
    // Update test
        // _data.update('test', 'newFile', {'fizz' : 'buzz'}, function(err){
        //     console.log('this was the error', err);
        // });
    // Update test
    // Delete test
        // _data.delete('test', 'newFile', function(err){
        //     console.log('this was the error', err);
        // });
    // Delete test

// Testing lib manually

// Instantiate the [httpServer]
    var httpServer = http.createServer(function(req, res){
        unifiedServer(req,res);
    });
// Instantiate the [httpServer]

// Start the [httpServer]
    httpServer.listen(config.httpPort, function(){
        console.log("The server is listening on port " +config.httpPort);
    });
// Start the [httpServer]

// Instantiate the [httpServer]
    var httpsServerOptions = {
        'key': fs.readFileSync('./https/key.pem'),
        'cert': fs.readFileSync('./https/cert.pem')
    };
    var httpsServer = https.createServer(httpsServerOptions,function(req, res){
        unifiedServer(req, res);
    });
// Instantiate the [httpServer]

// Start the [httpServer]
    httpsServer.listen(config.httpsPort, function(){
        console.log("The server is listening on port " +config.httpsPort);
    });
// Start the [httpServer]

// [unifiedServer] logic
    
    var unifiedServer = function(req, res){

        // Get the [url] and parse it
            //second parameter set to true so that the query-string-module gets called
            var parsedUrl = url.parse(req.url, true) 
        // Get the [url] and parse it

        // Get the [path]

            // [pathname] is a key on the object [parsedUrl], [path] = foo -> http://localhost3000/foo
                var path = parsedUrl.pathname;
            // [pathname] is a key on the object [parsedUrl], [path] = foo -> http://localhost3000/foo
            
            // trimming [path] with regex inside of the replace string method
                var trimmedPath = path.replace(/^\/+|\/+$/g,'');
            // trimming [path] with regex inside of the replace string method
        
        // Get the [path]
        
        // Get the query string as an object
            var queryStringObject = parsedUrl.query;
        // Get the query string as an object
        
        // Get the HTTP [method]
            // [req] is a parameter passed to the createServer function
            var method = req.method.toLocaleLowerCase();
        // Get the HTTP [method]
        
        // Get the [headers] as an object
            var headers = req.headers;
        // Get the [headers] as an object
        
        // Get the [payload], if any 
            
            // decode and append incoming [data] to empty string

                var decoder = new StringDecoder('utf-8');
                var buffer = '';                
                // [req]'s [data] event handler
                    req.on('data', function(data){
                        buffer += decoder.write(data);
                    });
                // [req]'s [data] event handler
            
            // decode and append incoming [data] to empty string

            // [req]'s end event handler
                req.on('end', function(){
                    
                    buffer += decoder.end();            
                    //Choose the handler this request should go to. If one is not found, use the [notFound] handler
                        // If the [path] that the user is requesting exist as a key on the [router] call that handler, or call [notFound] handler
                            var chosenHandler =
                                typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound
                            ; 
                        // If the [path] that the user is requesting exist as a key on the [router] call that handler, or call [notFound] handler
                    //Choose the handler this request should go to. If one is not found, use the [notFound] handler
                    
                    // Construct the [data] object to send to the handler
                        var data = {
                            'trimmedPath' : trimmedPath,
                            'queryStringObject' : queryStringObject,
                            'method' : method,
                            'headers' : headers,
                            'payload' : helpers.parseJsonToObject(buffer)
                        };
                    // Construct the [data] object to send to the handler
                    
                    // Route the request to the handler specified in [router]
                        chosenHandler(data, function(statusCode, payload){
                            
                            // Use the [statusCode] called back by the handler, or default to 200
                                // Set [statusCode] to incoming parameter [statusCode] only if it is of type ['number'], otherwise set [statusCode] to the 200
                                    statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
                                // Set [statusCode] to incoming parameter [statusCode] only if it is of type ['number'], otherwise set [statusCode] to the 200
                            // Use the [statusCode] called back by the handler, or default to 200
                            
                            // Use the [payload] called back by the handler, or default to an empty object
                                // If the typeof [buffer] is an object than set it to [payload], otherwise set [payload] to empty object 
                                    payload = typeof(payload) == 'object' ? payload : {};
                                // If the typeof [buffer] is an object than set it to [payload], otherwise set [payload] to empty object 
                            // Use the [payload] called back by the handler, or default to an empty object
                            
                            // Convert the [payload] to a string
                                var payloadString = JSON.stringify(payload);
                            // Convert the [payload] to a string
                            
                            // Return the response [res]
                                res.setHeader('Content-Type', 'application/json');
                                res.writeHead(statusCode);
                                res.end(payloadString);
                            // Return the response [res]
                            
                            // Log the request [path]
                                console.log('Returning this response: ', statusCode, payloadString);
                            // Log the request [path]
                        
                        });
                    // Route the request to the handler specified in [router]
                    
                });
            // [req]'s end event handler
            
        // Get the [payload], if any
    
        // Define a request [router]
            var router = {
                'ping' : handlers.ping,
                'users' : handlers.users
            };
        // Define a request [router]

    };

// [unifiedServer] logic
