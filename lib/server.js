/*
* Server-related tasks
* 
*/

// Dependencies
    var http = require('http');
    var https = require('https');
    var url = require('url');
    var StringDecoder = require('string_decoder').StringDecoder;
    var config = require('./config');
    var fs = require('fs');
    var handlers = require('./handlers');
    var helpers = require('./helpers');
    var path = require('path');
    var util = require('util');
    var debug = util.debuglog('server');
    // lib test dependency
        //var _data = require('./data');
    // lib test dependency
// Dependencies

// Testing lib manually

    // Create test
        // _data.create('test', 'newFile',{'foo' : 'bar'}, function(err){
        //     debug('this was the error', err);
        // });
    // Create test
    // Read test
        // _data.read('test', 'newFile', function(err, data){
        //     debug('this was the error', err, 'and this was the data', data);
        // });
    // Read test
    // Update test
        // _data.update('test', 'newFile', {'fizz' : 'buzz'}, function(err){
        //     debug('this was the error', err);
        // });
    // Update test
    // Delete test
        // _data.delete('test', 'newFile', function(err){
        //     debug('this was the error', err);
        // });
    // Delete test

// Testing lib manually

// Instantiate the [server] module object
    var server = {};
// Instantiate the [server] module object

// Instantiate the [httpServer]
    server.httpServer = http.createServer(function(req, res){
        server.unifiedServer(req,res);
    });
// Instantiate the [httpServer]

// Instantiate the [httpServer]
    server.httpsServerOptions = {
        'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
        'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
    };
    server.httpsServer = https.createServer(server.httpsServerOptions,function(req, res){
        server.unifiedServer(req, res);
    });
// Instantiate the [httpServer]

// [unifiedServer] logic

    server.unifiedServer = function(req, res){
    
        // Get the [url] and parse it
            //second parameter set to true so that the query-string-module gets called
                var parsedUrl = url.parse(req.url, true);
            //second parameter set to true so that the query-string-module gets called
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
                        // If the [path] that the user is requesting exist as a key on the [server.router] call that handler, or call [notFound] handler
                            var chosenHandler =
                                typeof(server.router[trimmedPath]) !== 'undefined' ?
                                server.router[trimmedPath] : handlers.notFound
                            ; 
                        // If the [path] that the user is requesting exist as a key on the [server.router] call that handler, or call [notFound] handler
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
                    
                    // Route the request to the handler specified in [server.router]
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
                            
                            // If the response is 200, print green otherwise print red
                            
                                if(statusCode == 200){
                                    debug('\x1b[32m%s\x1b[0m', method.toUpperCase() +' /'+ trimmedPath +' '+ statusCode);
                                }else{
                                    debug('\x1b[31m%s\x1b[0m', method.toUpperCase() +' /'+ trimmedPath +' '+ statusCode);
                                }

                            // If the response is 200, print green otherwise print red
                            
                        });
                    // Route the request to the handler specified in [server.router]
                    
                });
            // [req]'s end event handler
            
        // Get the [payload], if any
            
        // Define a request [server.router]
            server.router = {
                'ping' : handlers.ping,
                'users' : handlers.users,
                'tokens' : handlers.tokens,
                'checks' : handlers.checks
            };
        // Define a request [server.router]
        
    };

    // Init script
        server.init = function(){

            // Start the [httpServer]
                server.httpServer.listen(config.httpPort, function(){
                    console.log('\x1b[36m%s\x1b[0m', 'The server is listening on port ' +config.httpPort);
                });
            // Start the [httpServer]

            // Start the [httpsServer]
                server.httpsServer.listen(config.httpsPort, function(){
                    console.log('\x1b[35m%s\x1b[0m', 'The server is listening on port ' +config.httpsPort);
                });
            // Start the [httpsServer]

        }
    // Init script

// [unifiedServer] logic

// Export the module
    module.exports = server;
// Export the module