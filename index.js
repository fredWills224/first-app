/*
* Primary file for the API
* es5
*/

// Dependencies
    var http = require('http');
    var https = require('https');
    var url = require('url');
    var StringDecoder = require('string_decoder').StringDecoder;
    var config = require('./config');
    var fs = require('fs');
// Dependencies


// Instantiate the HTTP server
    var httpServer = http.createServer(function(req, res){
        unifiedServer(req,res);
    });
// Instantiate the HTTP server

// Start the HTTP server
    httpServer.listen(config.httpPort, function(){
        console.log("The server is listening on port " +config.httpPort);
    });
// Start the HTTP server

// Instantiate the HTTPS server
    var httpsServerOptions = {
        'key': fs.readFileSync('./https/key.pem'),
        'cert': fs.readFileSync('./https/cert.pem')
    };
    var httpsServer = https.createServer(httpsServerOptions,function(req, res){
        unifiedServer(req, res);
    });
// Instantiate the HTTPS server

// Start the HTTPS server
    httpsServer.listen(config.httpsPort, function(){
        console.log("The server is listening on port " +config.httpsPort);
    });
// Start the HTTPS server

// All the server logic for both the http and https server
    
    var unifiedServer = function(req, res){

        // Get the URL and parse it
            //second parameter set to [true] so that the query-string-model gets called
            var parsedUrl = url.parse(req.url, true) 
        // Get the URL and parse it

        // Get the path

            // [pathname] is a key on the object [parsedUrl], [path] = foo -> http://localhost3000/foo
                var path = parsedUrl.pathname;
            // [pathname] is a key on the object [parsedUrl], [path] = foo -> http://localhost3000/foo
            
            // trimming path with regex inside of the replace string method
                var trimmedPath = path.replace(/^\/+|\/+$/g,'');
            // trimming path with regex inside of the replace string method
        
        // Get the path
        
        // Get the query string as an object
            var queryStringObject = parsedUrl.query;
        // Get the query string as an object
        
        // Get the HTTP Method
            // [req] is a parameter passed to the [server] function
            var method = req.method.toLocaleLowerCase();
        // Get the HTTP Method
        
        // Get the headers as an object
            var headers = req.headers;
        // Get the headers as an object
        
        // Get the payload, if any 
            
            // decode and append incoming data to empty string
                var decoder = new StringDecoder('utf-8');
                var buffer = '';    
            // decode and append incoming data to empty string
            
            // binding to event that the [req] object emits called data
                req.on('data', function(data){
                    buffer += decoder.write(data);
                });
            // binding to event that the [req] object emits called data
            
            // [req]'s end event handler
                req.on('end', function(){
                    
                    buffer += decoder.end();            
                    //Choose the handler this request should go to. If one is not found, use the notFound handler
                        // If the path that the user is requesting exist as a key on the router call that handler, or call notFound handler
                            var chosenHandler =
                                typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound
                            ; 
                        // If the path that the user is requesting exist as a key on the router call that handler, or call notFound handler
                    //Choose the handler this request should go to. If one is not found, use the notFound handler
                    
                    // Construct the data object to send to the handler
                        var data = {
                            'trimmedPath' : trimmedPath,
                            'queryStringObject' : queryStringObject,
                            'method' : method,
                            'headers' : headers,
                            'payload' : buffer
                        };
                    // Construct the data object to send to the handler
                    
                    // Route the request to the handler specified in the router
                        chosenHandler(data, function(statusCode, payload){
                            
                            // Use the status code called back by the handler, or default to 200
                                // Set [statusCode] to incoming parameter [statusCode] only if it is of type ['number'], otherwise set statusCode to the 200
                                    statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
                                // Set [statusCode] to incoming parameter [statusCode] only if it is of type ['number'], otherwise set statusCode to the 200
                            // Use the status code called back by the handler, or default to 200
                            
                            // Use the payload called back by the handler, or default to an empty object
                                // If the typeof [buffer] is an object than set it to [payload], otherwise set [payload] to empty object 
                                    payload = typeof(payload) == 'object' ? payload : {};
                                // If the typeof [buffer] is an object than set it to [payload], otherwise set [payload] to empty object 
                            // Use the payload called back by the handler, or default to an empty object
                            
                            // Convert the payload to a string
                                var payloadString = JSON.stringify(payload);
                            // Convert the payload to a string
                            
                            // Return the response
                                res.setHeader('Content-Type', 'application/json');
                                res.writeHead(statusCode);
                                res.end(payloadString);
                            // Return the response
                            
                            // Log the request path
                                console.log('Returning this response: ', statusCode, payloadString);
                            // Log the request path
                        
                        });
                    // Route the request to the handler specified in the router
                    
                });
            // [req]'s end event handler
            
        // Get the payload, if any

    };

// All the server logic for both the http and https server

// Define the handlers

    var handlers = {};

    // Ping handler
        handlers.ping = function(data, callback){
            callback(200);
        };
    // Ping handler

    // Not found handler
        handlers.notFound = function(data, callback){
            // Callback a http status code
                callback(404);
            // Callback a http status code
        };
    // Not found handler

// Define the handlers

// Define a request router
    var router = {
        'ping': handlers.ping
    };
// Define a request router