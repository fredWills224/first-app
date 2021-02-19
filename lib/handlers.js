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
    // [users] handler
        handlers.users = function(data, callback){

            // call function with one of the [acceptableMethods] check

                var acceptableMethods = ['post', 'get', 'put', 'delete'];
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
    // [users] handler

    // Container for [handlers._users] submethods
        
        handlers._users = {};
        // [handlers._users.post]

            // Required [data]: [firstName, lastName, phone, password, tosAgreement], Optional [data]: none
                handlers._users.post = function(data,callback){

                    // Check to see if all required fields meet their own requirements
                        
                        var firstName = 
                            // must be of type string
                                typeof(data.payload.firstName) == 'string' &&
                            // must be of type string
                            // Not null
                                data.payload.firstName.trim().length > 0 ?
                            // Not null
                            // accept incoming [data] if it meets requirements or set it to false
                                data.payload.firstName.trim() : false
                            // accept incoming [data] if it meets requirements or set it to false
                        ;
                        var lastName = 
                            // must be of type string
                                typeof(data.payload.lastName) == 'string' &&
                            // must be of type string
                            // Not null
                                data.payload.lastName.trim().length > 0 ?
                            // Not null
                            // accept incoming [data] if it meets requirements or set it to false
                                data.payload.lastName.trim() : false
                            // accept incoming [data] if it meets requirements or set it to false
                        ;
                        var phone =
                            // must be of type string 
                                typeof(data.payload.phone) == 'string' &&
                            // must be of type string
                            // must be 10 digits long
                                data.payload.phone.trim().length == 10 ?
                            // must be 10 digits long
                            // accept incoming [data] if it meets requirements or set it to false
                                data.payload.phone.trim() : false
                            // accept incoming [data] if it meets requirements or set it to false
                        ;
                        var password = 
                            // must be of type string
                                typeof(data.payload.password) == 'string' &&
                            // must be of type string
                            // Not null
                                data.payload.password.trim().length > 0 ?
                            // Not null
                            // accept incoming [data] if it meets requirements or set it to false
                                data.payload.password.trim() : false
                            // accept incoming [data] if it meets requirements or set it to false
                        ;
                        var tosAgreement = 
                            // must be of type boolean
                                typeof(data.payload.tosAgreement) == 'boolean' &&
                            // must be of type boolean
                            // must be set to true
                                data.payload.tosAgreement == true ?
                            // must be set to true
                            // accept incoming [data] if it meets requirements or set it to false
                                true : false
                            // accept incoming [data] if it meets requirements or set it to false
                        ;
                    
                    // Check to see if all required fields meet their own requirements
                    if (firstName && lastName && phone && password && tosAgreement){

                        // Make sure that the user doesn't already exist
                            _data.read('users', phone, function(err, data){

                                if(err){

                                    // hash the [password] library built into node calle crypto
                                        var hashedPassword = helpers.hash(password);
                                    // hash the [password] library built into node calle crypto
                                    if(hashedPassword){

                                        // Create the [userObject]
                                            var userObject ={
                                                'firstName' : firstName,
                                                'lastName' : lastName,
                                                'phone' : phone,
                                                'hashedPassword' : hashedPassword,
                                                'tosAgreement' : true
                                            };
                                        // Create the [userObject]
                                        // Store the user with [phone] as primary key
                                            _data.create('users', phone, userObject, function(err){
                                            
                                                if(!err){
                                                    callback(200);
                                                }else{
                                                    callback(500, {'Error' : 'Could not create the new user'});
                                                }
                                            
                                            });
                                        // Store the user with [phone] as primary key

                                    }else{
                                        callback(500, {'Error' : 'Could not hash the user\'s password'});
                                    }

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
            // Required [data]: [firstName, lastName, phone, password, tosAgreement], Optional [data]: none

        // [handlers._users.post]

        // [handlers._users.get]

            // Required [data] : [phone], Optional [data] : none
                handlers._users.get = function(data ,callback){

                    // check that the [phone] number is valid
                        var phone =
                            // must be of type string
                                typeof(data.queryStringObject.phone) == 'string' &&
                            // must be of type string
                            // must be 10 digits long
                                data.queryStringObject.phone.trim().length == 10 ?
                            // must be 10 digits long
                            // accept incoming [data] as valid or set it to false
                                data.queryStringObject.phone.trim() : false
                            // accept incoming [data] as valid or set it to false
                        ;
                    // check that the [phone] number is valid
                    if(phone){

                        // Get the [token] from the [headers]
                            var token = 
                                // must have valid [token] in [headers]
                                    typeof(data.headers.token) == 'string' ?
                                // must have valid [token] in [headers]
                                // accept [token] as valid or set to false
                                    data.headers.token : false
                                // accept [token] as valid or set to false
                            ;
                        // Get the [token] from the [headers]
                        // Verify that the given [token] is valid for the [phone] number
                            handlers._tokens.verifyToken(token, phone, function(tokenIsValid){

                                if(tokenIsValid){
                                    // Look up the user
                                        _data.read('users', phone, function(err, data){
                                            
                                            if(!err && data){
                                                // Remove the [hashedPassword] from the [data] before returning it to the requester
                                                    delete data.hashedPassword;
                                                // Remove the [hashedPassword] from the [data] before returning it to the requester
                                                // send back [callback] with [statusCode] set to 200 and [data]
                                                    callback(200, data);
                                                // send back [callback] with [statusCode] set to 200 and [data]
                                            }else{
                                                // send back 404 [statusCode]
                                                    callback(404);
                                                // send back 404 [statusCode]
                                            }
                                            
                                        });
                                    // Look up the user
                                }else{
                                    callback(403, {'Error':'Missing required token in header, or token is invalid'});
                                }

                            });
                        // Verify that the given [token] is valid for the [phone] number
                        
                    }else{
                        callback(400, {'Error' : 'Missing required field'});
                    }
                    
                };
            // Required [data] : [phone], Optional [data] : none

        // [handlers._users.get]

        // [handlers._users.put]

            // Required [data] : [phone], Optional [data] : [firstName, lastName, password]-> min -> 1
                handlers._users.put = function(data,callback){
                
                    // Check for the required field
                        var phone = 
                            // must be of type string
                                typeof(data.payload.phone) == 'string' &&
                            // must be of type string
                            // must be 10 digit in length
                                data.payload.phone.trim().length == 10 ?
                            // must be 10 digit in length
                            // accept [data] as valid or set to false
                                data.payload.phone.trim() : false
                            // accept [data] as valid or set to false
                        ;
                    // Check for the required field
                    // Check for the optional fields
                        
                        var firstName =
                            // must be of type string
                                typeof(data.payload.firstName) == 'string' &&
                            // must be of type string
                            // not null
                                data.payload.firstName.trim().length > 0 ?
                            // not null
                            // accept [data] as valid or set to false
                                data.payload.firstName.trim() : false
                            // accept [data] as valid or set to false
                        ;
                        var lastName =
                            // must be of type string
                                typeof(data.payload.lastName) == 'string' &&
                            // must be of type string
                            // not null
                                data.payload.lastName.trim().length > 0 ?
                            // not null
                            // accept [data] as valid or set to false
                                data.payload.lastName.trim() : false
                            // accept [data] as valid or set to false
                        ;
                        var password =
                            // must be of type string
                                typeof(data.payload.password) == 'string' &&
                            // must be of type string
                            // not null
                                data.payload.password.trim().length > 0 ?
                            // not null
                            // accept [data] as valid or set to false
                                data.payload.password.trim() : false
                            // accept [data] as valid or set to false
                        ;

                    // Check for the optional fields
                    // Error if the phone is invalid

                        if(phone){
                            // Error if there is nothing to update

                                if(firstName || lastName || password){
                                    
                                    // Get the [token] from the [headers]
                                        var token = 
                                            // must have valid [token] in [headers]
                                                typeof(data.headers.token) == 'string' ?
                                            // must have valid [token] in [headers]
                                            // accept [token] as valid or set to false
                                                data.headers.token : false
                                            // accept [token] as valid or set to false
                                        ;
                                    // Get the [token] from the [headers]
                                    // Verify that the given [token] is valid for the [phone] number
                                        handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
                                        
                                            if(tokenIsValid){
                                                // Look up user
                                                    _data.read('users', phone, function(err, data){
                                                    
                                                        if(!err && data){
                                                            // Update the fields
                                                                if(firstName){
                                                                    data.firstName = firstName;
                                                                }
                                                                if(lastName){
                                                                    data.lastName = lastName;
                                                                }
                                                                if(password){
                                                                    data.hashedPassword = helpers.hash(password);
                                                                }
                                                            // Update the fields
                                                            // Store the new updates
                                                                _data.update('users', phone, data, function(err){

                                                                    if(!err){
                                                                        // success not sending updated [data] in callback to avoid exposing hp
                                                                            callback(200);
                                                                        // success not sending updated [data] in callback to avoid exposing hp
                                                                    }else{
                                                                        // log err for debugging
                                                                            console.log(err);
                                                                        // log err for debugging
                                                                        // request ok internal server error processing update
                                                                            callback(500, {'Error' : 'Could not update the user'});
                                                                        // request ok internal server error processing update
                                                                    }
                                                                
                                                                });
                                                            // Store the new updates
                                                        }else{
                                                            callback(400, {'Error' : 'The specified user does not exist'});
                                                        }
                                                    
                                                    });
                                                // Look up user
                                            }else{
                                                callback(403, {'Error':'Missing required token in header, or token is invalid'});
                                            }
                                        
                                        });
                                    // Verify that the given [token] is valid for the [phone] number
                                    
                                }else{
                                    callback(400, {'Error' : 'Missing fields to update'})
                                }

                            // Error if there is nothing to update
                        }else{
                            callback(400, {'Error' : 'Missing required field'});
                        }

                    // Error if the phone is invalid
                
                };
            // Required [data] : [phone], Optional [data] : [firstName, lastName, password]-> min -> 1

        // [handlers._users.put]

        // [handlers._users.delete]

            // @TODO Cleanup (delete) any other data files associated with this user
            // Required [data] : [phone]
                handlers._users.delete = function(data,callback){

                    // check that the [phone] number is valid
                        var phone =
                            // must be of type string
                                typeof(data.queryStringObject.phone) == 'string' &&
                            // must be of type string
                            // must be 10 digits long
                                data.queryStringObject.phone.trim().length == 10 ?
                            // must be 10 digits long
                            // accept incoming [data] as valid or set it to false
                                data.queryStringObject.phone.trim() : false
                            // accept incoming [data] as valid or set it to false
                        ;
                    // check that the [phone] number is valid
                    if(phone){
                        
                        // Get the [token] from the [headers]
                                var token = 
                                // must have valid [token] in [headers]
                                    typeof(data.headers.token) == 'string' ?
                                // must have valid [token] in [headers]
                                // accept [token] as valid or set to false
                                    data.headers.token : false
                                // accept [token] as valid or set to false
                            ;
                        // Get the [token] from the [headers]
                        // Verify that the given [token] is valid for the [phone] number
                            handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
                            
                                if(tokenIsValid){
                                    // Look up the user
                                        _data.read('users', phone, function(err, data){
                                        
                                            if(!err && data){
                                                // delete specified user
                                                    _data.delete('users', phone, function(err){
                                                        
                                                        if(!err){
                                                            // successfull delete send back [statusCode] 200
                                                                callback(200);
                                                            // successfull delete send back [statusCode] 200
                                                        }else{
                                                            // internal server error + error message
                                                                callback(500, {'Error' : 'Could not delete the specified user'});
                                                            // internal server error + error message
                                                        }
                                                    
                                                    });
                                                // delete specified user
                                            }else{
                                                // send back 400 [statusCode] and error meassage
                                                    callback(400, {'Error' :  'Could not find the specified user'});
                                                // send back 400 [statusCode] and error meassage
                                            }
                                        
                                        });
                                    // Look up the user
                                }else{
                                    callback(403, {'Error':'Missing required token in header, or token is invalid'});
                                }
                            
                            });
                        // Verify that the given [token] is valid for the [phone] number
                    
                    }else{
                        callback(400, {'Error' : 'Missing required field'});
                    }

                };
            // Required [data] : [phone]

        // [handlers._users.delete]

    // Container for [handlers._users] submethods

    // [handlers.tokens]
        handlers.tokens = function(data, callback){

            var acceptableMethods = ['post', 'get', 'put', 'delete'];
            if(acceptableMethods.indexOf(data.method) > -1){
                handlers._tokens[data.method](data, callback);
            }else{
                callback(405);
            }

        }
    // [handlers.tokens]

    // Container for [handlers._tokens] submethods

        handlers._tokens = {};
        // [handlers._tokens.post]

            // Required [data]:[phone, password]
                handlers._tokens.post = function(data, callback){
                    
                    var phone =
                        // must be of type string 
                            typeof(data.payload.phone) == 'string' &&
                        // must be of type string
                        // must be 10 digits long
                            data.payload.phone.trim().length == 10 ?
                        // must be 10 digits long
                        // accept incoming [data] if it meets requirements or set it to false
                            data.payload.phone.trim() : false
                        // accept incoming [data] if it meets requirements or set it to false
                    ;
                    var password = 
                        // must be of type string
                            typeof(data.payload.password) == 'string' &&
                        // must be of type string
                        // Not null
                            data.payload.password.trim().length > 0 ?
                        // Not null
                        // accept incoming [data] if it meets requirements or set it to false
                            data.payload.password.trim() : false
                        // accept incoming [data] if it meets requirements or set it to false
                    ;
                    if(phone && password){
                        // Lookup the user who matches that [phone] number
                            _data.read('users', phone, function(err, userData){

                                if(!err && userData){
                                    // Hash the sent [password], and compare it tio the [password] stored in the [userObject]
                                        
                                        var hashedPassword = helpers.hash(password);
                                        if(hashedPassword == userData.hashedPassword){
                                            // if valid, create a new token with a randome name. Set expiration date to 1 hour in the future 
                                                var tokenId = helpers.createRandomString(20);
                                                var expires = Date.now() +100 * 60 *60;
                                                var tokenObject = {
                                                    'phone':phone,
                                                    'id':tokenId,
                                                    'expires':expires
                                                }
                                            // if valid, create a new token with a randome name. Set expiration date to 1 hour in the future 
                                            // store the token
                                                _data.create('tokens', tokenId, tokenObject, function(err){

                                                    if(!err){
                                                        callback(200, tokenObject);
                                                    }else{
                                                        callback(500, {'Error':'Could not creat the new token'});
                                                    }

                                                });
                                            // store the token
                                        }else{
                                            callback(400, {'Error': 'Password did not match the specified users\'s stored password'});
                                        }

                                    // Hash the sent [password], and compare it tio the [password] stored in the [userObject]
                                }else{
                                    callback(400, {'Error':'Could not find the user specified user'});
                                }

                            });
                        // Lookup the user who matches that [phone] number
                    }else{
                        callback(400, {'Error':'Missing required fields'});
                    }

                }
            // Required [data]:[phone, password]
        
        // [handlers._tokens.post]

        // [handlers._tokens.get]
            
            // Required [data] : [id], Optional [data] : none
                handlers._tokens.get = function(data, callback){
                    
                    // check that the [id] number is valid
                        var id =
                            // must be of type string
                                typeof(data.queryStringObject.id) == 'string' &&
                            // must be of type string
                            // must be 20 digits long
                                data.queryStringObject.id.trim().length == 20 ?
                            // must be 20 digits long
                            // accept incoming [data] as valid or set it to false
                                data.queryStringObject.id.trim() : false
                            // accept incoming [data] as valid or set it to false
                        ;
                    // check that the [id] number is valid
                    if(id){
                    
                        // Look up the token
                            _data.read('tokens', id, function(err, tokenData){
                                
                                if(!err && tokenData){
                                    // send back [callback] with [statusCode] set to 200 and [tokenData]
                                        callback(200, tokenData);
                                    // send back [callback] with [statusCode] set to 200 and [tokenData]
                                }else{
                                    // send back 404 [statusCode]
                                        callback(404);
                                    // send back 404 [statusCode]
                                }
                                
                            });
                        // Look up the token
                        
                    }else{
                        callback(400, {'Error' : 'Missing required field'});
                    }

                }
            // Required [data] : [id], Optional [data] : none

        // [handlers._tokens.get]

        // [handlers._tokens.put]
            // Required [data] : [id, extend], Optional [data] : none
                handlers._tokens.put = function(data, callback){
                    var id =
                        // must be of type string 
                            typeof(data.payload.id) == 'string' &&
                        // must be of type string
                        // must be 20 digits long
                            data.payload.id.trim().length == 20 ?
                        // must be 20 digits long
                        // accept incoming [data] if it meets requirements or set it to false
                            data.payload.id.trim() : false
                        // accept incoming [data] if it meets requirements or set it to false
                    ;    
                    var extend =
                        // must be of type string 
                            typeof(data.payload.extend) == 'boolean' &&
                        // must be of type string
                        // must be true
                            data.payload.extend == true ?
                        // must be true
                        // accept incoming [data] if it meets requirements or set it to false
                            true : false
                        // accept incoming [data] if it meets requirements or set it to false
                    ;
                    if(id && extend){
                        // Look up the token
                            _data.read('tokens', id, function(err, tokenData){

                                if(!err && tokenData){

                                    // Make sure the token isn't already expired
                                        if(tokenData.expires > Date.now()){
                                            // Set [expires] to an hour from now
                                                tokenData.expires = Date.now() + 1000 * 60 * 60;
                                            // Set [expires] to an hour from now
                                            // Stor the new update
                                                _data.update('tokens', id, tokenData, function(err){

                                                    if(!err){
                                                        callback(200);
                                                    }else{
                                                        callback(500, {'Error':'Could not update the token\'s expiration'});
                                                    }

                                                });
                                            // Stor the new update
                                        }else{
                                            callback(400, {'Error':'The token has already expired, and can\'t be extended'});
                                        }
                                    // Make sure the token isn't already expired

                                }else{
                                    callback(400, {'Error': 'Specified token doesn\'t exist'});
                                }

                            });
                        // Look up the token
                    }else{
                        callback(400, {'Error':'Missing required field(s) or field(s) are invalid'});
                    }

                }
            // Required [data] : [id, extend], Optional [data] : none
        // [handlers._tokens.put]

        // [handlers._tokens.delete]
            // Required [data] : [id], Optional : none
                handlers._tokens.delete = function(data, callback){
                    
                    // check that the [id] is valid
                        var id =
                            // must be of type string
                                typeof(data.queryStringObject.id) == 'string' &&
                            // must be of type string
                            // must be 20 digits long
                                data.queryStringObject.id.trim().length == 20 ?
                            // must be 20 digits long
                            // accept incoming [data] as valid or set it to false
                                data.queryStringObject.id.trim() : false
                            // accept incoming [data] as valid or set it to false
                        ;
                    // check that the [id] valid
                    if(id){

                        // Look up the token
                            _data.read('tokens', id, function(err, data){
                            
                                if(!err && data){
                                    // delete specified token
                                        _data.delete('tokens', id, function(err){

                                            if(!err){
                                                // successfull delete send back [statusCode] 200
                                                    callback(200);
                                                // successfull delete send back [statusCode] 200
                                            }else{
                                                // internal server error + error message
                                                    callback(500, {'Error' : 'Could not delete the specified token'});
                                                // internal server error + error message
                                            }
                                        
                                        });
                                    // delete specified token
                                }else{
                                    // send back 400 [statusCode] and error meassage
                                        callback(400, {'Error' :  'Could not find the specified token'});
                                    // send back 400 [statusCode] and error meassage
                                }
                            
                            });
                        // Look up the token
                        
                    }else{
                        callback(400, {'Error' : 'Missing required field'});
                    }

                }
            // Required [data] : [id], Optional : none
        // [handlers._tokens.delete]
        
        // Verify given [id] is currently valid for a given user
            handlers._tokens.verifyToken = function(id, phone, callback){
                
                // Look up the token
                    _data.read('tokens', id, function(err, tokenData){

                        if(!err && tokenData){
                            //Check that the token is for the given user and has not expired

                                if(tokenData.phone == phone && tokenData.expires > Date.now()){
                                    callback(true)
                                }else{
                                    callback(false)
                                }
                            
                            //Check that the token is for the given user and has not expired
                        }else{
                            callback(false);
                        }

                    });
                // Look up the token
            
            };
        // Verify given [id] is currently valid for a given user

    // Container for [handlers._tokens] submethods
    
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
