/*
* Primary file for the API
* es5
*/

// Dependencies
    var http = require('http');
    var url = require('url');
    var StringDecoder = require('string_decoder').StringDecoder;
// Dependencies


// The server should respond to all requests with astring

    var server = http.createServer(function(req, res){
        
        // Get the URL and parse it
            //second parameter set to [true] so that the query-string-model gets called
            var parsedUrl = url.parse(req.url, true) 
        // Get the URL and parse it

        // Get the path
            
            // [pathname] is a key on the object [parsedUrl] 
            // [path] = foo -> http://localhost3000/foo
            var path = parsedUrl.pathname;
            // trimming path with regex inside of the replace string method
            var trimmedPath = path.replace(/^\/+|\/+$/g,'');
        
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
                // binding to event that the [req] object emits called data
                    req.on('data', function(data){
                        buffer += decoder.write(data);
                    });
                // binding to event that the [req] object emits called data
            
            // decode and append incoming data to empty string

            // [req]'s end event handler

                req.on('end', function(){

                    buffer += decoder.end();
                    // Send the response
                        res.end('\nHello World\n');
                    // Send the response

                    // Log the request path
                        console.log('Request recieved with this payload: ', buffer);
                    // Log the request path
                
                });

            // [req]'s end event handler
            
        // Get the payload, if any
        
    });
    
// The server should respond to all requests with astring


// Start the server, and have it listen on port 3000
    server.listen(3000, function(){
        console.log("The server is listening on port 3000 now");
    });
// Start the server, and have it listen on port 3000