/*
* Request handlers
*  
*/

// Dependencies
    var _data = require('./data');
    var helpers = require('./helpers');
    // Dependencies

// Define [handlers]

    var handlers = {};
    // Users
        handlers.users = function(data, callback){

            // call function with one of the [acceptableMethods] check

                var acceptableMethods = ['post', 'get,', 'put', 'delete'];
                if(acceptableMethods.indexOf(data.method) > -1){
                    // call private method for [handlers.users]
                        handlers._users[data.method](data, callback);
                    // call private method for [handlers.users]
                }else{
                    // method not allowed status code
                        callback(405);
                    // method not allowed status code
                }

            // call function with one of the [acceptableMethods] check

        };
    // Users

    // Container for [handlers.users] submethods
        
        handlers._users = {};
        // Users - post

            // Required data: firstName, lastName, phone, password, tosAgreement Optional data: none
                handlers._users.post = function(data,callback){

                    // Check to see if all required fields meet their own requirements
                        
                        var firstName = 
                            // must be of type string
                                typeof(data.payload.firstName) == 'string' &&
                            // must be of type string
                            // Not null
                                data.payload.firstName.trim().length > 0 ?
                            // Not null
                            // accept incoming data if it meets requirements or set it to false
                                data.payload.firstName.trim() : false
                            // accept incoming data if it meets requirements or set it to false
                        ;
                        var lastName = 
                            // must be of type string
                                typeof(data.payload.lastName) == 'string' &&
                            // must be of type string
                            // Not null
                                data.payload.lastName.trim().length > 0 ?
                            // Not null
                            // accept incoming data if it meets requirements or set it to false
                                data.payload.lastName.trim() : false
                            // accept incoming data if it meets requirements or set it to false
                        ;
                        var phone =
                            // must be of type string 
                                typeof(data.payload.phone) == 'string' &&
                            // must be of type string
                            // must be 10 digits long
                                data.payload.phone.trim().length == 10 ?
                            // must be 10 digits long
                            // accept incoming data if it meets requirements or set it to false
                                data.payload.phone.trim() : false
                            // accept incoming data if it meets requirements or set it to false
                        ;
                        var password = 
                            // must be of type string
                                typeof(data.payload.password) == 'string' &&
                            // must be of type string
                            // Not null
                                data.payload.password.trim().length > 0 ?
                            // Not null
                            // accept incoming data if it meets requirements or set it to false
                                data.payload.password.trim() : false
                            // accept incoming data if it meets requirements or set it to false
                        ;
                        var tosAgreement = 
                            // must be of type boolean
                                typeof(data.payload.tosAgreement) == 'boolean' &&
                            // must be of type boolean
                            // must be set to true
                                data.payload.tosAgreement == true ?
                            // must be set to true
                            // accept incoming data if it meets requirements or set it to false
                                true : false
                            // accept incoming data if it meets requirements or set it to false
                        ;
                    
                    // Check to see if all required fields meet their own requirements
                    if (firstName && lastName && phone && password && tosAgreement){

                        // Make sure that the user doesn't already exist
                            _data.read('users', phone, function(err, data){

                                if(err){
                                    // hash the password library built into node calle crypto
                                        var hashedPassword = helpers.hash(password);
                                    // hash the password library built into node calle crypto
                                }else{
                                    // user already exists
                                        callback(400, {'Error': 'A user with that phone number already exists'});
                                    // user already exists
                                }

                            });
                        // Make sure that the user doesn't already exist

                    }else{
                        callback(400, {'Error' : 'Missing required fields'});
                    }

                };
            // Required data: firstName, lastName, phone, password, tosAgreement Optional data: none

        // Users - post
        // Users - get
            handlers._users.get = function(data,callback){

            };
        // Users - get
        // Users - put
            handlers._users.put = function(data,callback){

            };
        // Users - put
        // Users - delete
            handlers._users.delete = function(data,callback){

            };
        // Users - delete

    // Container for [handlers.users] submethods

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

// Define [handlers]

// Export the module
    module.exports = handlers;
// Export the module
