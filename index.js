/*
* Primary file for the API
* es5
*/

// Dependencies
    var http = require('http');
    var url = require('url');
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

        // Send the response
            res.end('\nHello World\n');
        // Send the response

        // Log the request path
            console.log('Request received on path: ' +trimmedPath);
        // Log the request path
    });
    
// The server should respond to all requests with astring


// Start the server, and have it listen on port 3000
    server.listen(3000, function(){
        console.log("The server is listening on port 3000 now");
    });
// Start the server, and have it listen on port 3000