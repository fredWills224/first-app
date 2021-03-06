/*
* Request handlers
*  
*/

// Dependencies
    var _data = require('./data');
    var helpers = require('./helpers');
    var config = require('./config');
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

            // Required [data] : [headers.token, phone], Optional [data] : none
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
            // Required [data] : [headers.token, phone], Optional [data] : none

        // [handlers._users.get]

        // [handlers._users.put]

            // Required [data] : [headers.token, phone], Optional [data] : [firstName, lastName, password]-> min -> 1
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
            // Required [data] : [headers.token, phone], Optional [data] : [firstName, lastName, password]-> min -> 1

        // [handlers._users.put]

        // [handlers._users.delete]

            // Required [data] : [headers.token, phone]
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
                                        _data.read('users', phone, function(err, userData){
                                        
                                            if(!err && userData){
                                                // delete specified user
                                                    _data.delete('users', phone, function(err){
                                                        
                                                        if(!err){
                                                            // delete each of the checks associated with the user
                                                                
                                                                // validate [userChecks]
                                                                    var userChecks = 
                                                                        // must be of type object
                                                                            typeof(userData.checks) == 'object' &&
                                                                        // must be of type object
                                                                        // must be an instance of an array
                                                                            userData.checks instanceof Array ?
                                                                        // must be an instance of an array
                                                                        // accept [checks] as valid array or set to empty array
                                                                            userData.checks : []
                                                                        // accept [checks] as valid array or set to empty array
                                                                    ;
                                                                // validate [userChecks]
                                                                var checksToDelete = userChecks.length;
                                                                if(checksToDelete > 0){
                                                                    var checksDeleted = 0;
                                                                    var deletionErrors = false;
                                                                    // loop through the checks
                                                                        userChecks.forEach(function(checkId){
                                                                            
                                                                            // Delete the check
                                                                                _data.delete('checks', checkId, function(err){

                                                                                    if(err){
                                                                                        deletionErrors = true;
                                                                                    }
                                                                                    checksDeleted ++;
                                                                                    if(checksDeleted == checksToDelete){
                                                                                        
                                                                                        if(!deletionErrors){
                                                                                            callback(200);
                                                                                        }else{
                                                                                            callback(500, {'Error' : 'Errors encountered while attempting to delete all of the user\'s checks. All checks may not have been deleted from the system successfully.'});
                                                                                        }
    
                                                                                    }

                                                                                });
                                                                            // Delete the check

                                                                        });
                                                                    // loop through the checks
                                                                }else{
                                                                    callback(200);
                                                                }

                                                            // delete each of the checks associated with the user
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
            // Required [data] : [headers.token, phone]

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

            // Required [data]:[phone, password], Optional [data] : none
                handlers._tokens.post = function(data, callback){
                    
                    var phone =
                        // must be of type string 
                            typeof(data.payload.phone) == 'string' &&
                        // must be of type string
                        // must be 10 digits long
                            data.payload.phone.trim().length == 10 ?
                        // must be 10 digits long
                        // accept incoming [phone] as valid or set it to false
                            data.payload.phone.trim() : false
                        // accept incoming [phone] as valid or set it to false
                    ;
                    var password = 
                        // must be of type string
                            typeof(data.payload.password) == 'string' &&
                        // must be of type string
                        // Not null
                            data.payload.password.trim().length > 0 ?
                        // Not null
                        // accept incoming [password] as valid or set it to false
                            data.payload.password.trim() : false
                        // accept incoming [password] as valid or set it to false
                    ;
                    if(phone && password){
                        // Lookup the [userData] that matches the [phone] number
                            _data.read('users', phone, function(err, userData){

                                if(!err && userData){
                                    // Hash the sent [password], and compare it to the [password] stored in the [userData]
                                        
                                        var hashedPassword = helpers.hash(password);
                                        if(hashedPassword == userData.hashedPassword){
                                            // if valid, create a new [tokenObject] with a random [tokenId]. Set expiration date [expires] to 1 hour in the future 
                                                var tokenId = helpers.createRandomString(20);
                                                var expires = Date.now() +100 * 60 *60;
                                                var tokenObject = {
                                                    'phone':phone,
                                                    'id':tokenId,
                                                    'expires':expires
                                                }
                                            // if valid, create a new [tokenObject] with a random [tokenId]. Set expiration date [expires] to 1 hour in the future 
                                            // store the [tokenObject]
                                                _data.create('tokens', tokenId, tokenObject, function(err){

                                                    if(!err){
                                                        callback(200, tokenObject);
                                                    }else{
                                                        callback(500, {'Error':'Could not creat the new token'});
                                                    }

                                                });
                                            // store the [tokenObject]
                                        }else{
                                            callback(400, {'Error': 'Password did not match the specified users\'s stored password'});
                                        }

                                    // Hash the sent [password], and compare it to the [password] stored in the [userData]
                                }else{
                                    callback(400, {'Error':'Could not find the user specified user'});
                                }

                            });
                        // Lookup the [userData] that matches the [phone] number
                    }else{
                        callback(400, {'Error':'Missing required fields'});
                    }

                }
            // Required [data]:[phone, password], Optional [data] : none
        
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
                            // accept incoming [id] as valid or set it to false
                                data.queryStringObject.id.trim() : false
                            // accept incoming [id] as valid or set it to false
                        ;
                    // check that the [id] number is valid
                    if(id){
                    
                        // Look up the [tokenData]
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
                        // Look up the [tokenData]
                        
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
                        // accept incoming [id] as valid or set it to false
                            data.payload.id.trim() : false
                        // accept incoming [id] as valid or set it to false
                    ;    
                    var extend =
                        // must be of type string 
                            typeof(data.payload.extend) == 'boolean' &&
                        // must be of type string
                        // must be true
                            data.payload.extend == true ?
                        // must be true
                        // accept incoming [extend] status as valid or set it to false
                            true : false
                        // accept incoming [extend] status as valid or set it to false
                    ;
                    if(id && extend){
                        // Look up the [tokenData]
                            _data.read('tokens', id, function(err, tokenData){

                                if(!err && tokenData){

                                    // Make sure the [tokenData.expires] isn't already expired
                                        if(tokenData.expires > Date.now()){
                                            // Set [expires] to an hour from now
                                                tokenData.expires = Date.now() + 1000 * 60 * 60;
                                            // Set [expires] to an hour from now
                                            // Stor the new updated [tokenData]
                                                _data.update('tokens', id, tokenData, function(err){

                                                    if(!err){
                                                        callback(200);
                                                    }else{
                                                        callback(500, {'Error':'Could not update the token\'s expiration'});
                                                    }

                                                });
                                            // Stor the new updated [tokenData]
                                        }else{
                                            callback(400, {'Error':'The token has already expired, and can\'t be extended'});
                                        }
                                    // Make sure the [tokenData.expires] isn't already expired

                                }else{
                                    callback(400, {'Error': 'Specified token doesn\'t exist'});
                                }

                            });
                        // Look up the [tokenData]
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
                            // accept incoming [id] as valid or set it to false
                                data.queryStringObject.id.trim() : false
                            // accept incoming [id] as valid or set it to false
                        ;
                    // check that the [id] valid
                    if(id){

                        // Look up the [tokenData]
                            _data.read('tokens', id, function(err, tokenData){
                            
                                if(!err && tokenData){
                                    // delete specified [tokenData]
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
                                    // delete specified [tokenData]
                                }else{
                                    // send back 400 [statusCode] and error meassage
                                        callback(400, {'Error' :  'Could not find the specified token'});
                                    // send back 400 [statusCode] and error meassage
                                }
                            
                            });
                        // Look up the [tokenData]
                        
                    }else{
                        callback(400, {'Error' : 'Missing required field'});
                    }

                }
            // Required [data] : [id], Optional : none

        // [handlers._tokens.delete]
        
        // Verify given [id] is currently valid for a given user's [phone]
            handlers._tokens.verifyToken = function(id, phone, callback){
                
                // Look up the [tokenData]
                    _data.read('tokens', id, function(err, tokenData){

                        if(!err && tokenData){
                            //Check that the [tokenData.expires] is for the given user and has not expired

                                if(tokenData.phone == phone && tokenData.expires > Date.now()){
                                    callback(true)
                                }else{
                                    callback(false)
                                }
                            
                            //Check that the [tokenData.expires] is for the given user and has not expired
                        }else{
                            callback(false);
                        }

                    });
                // Look up the [tokenData]
            
            };
        // Verify given [id] is currently valid for a given user's [phone]

    // Container for [handlers._tokens] submethods
    
    // [handlers.checks]
        handlers.checks = function(data, callback){

            var acceptableMethods = ['post', 'get', 'put', 'delete'];
            if(acceptableMethods.indexOf(data.method) > -1){
                handlers._checks[data.method](data, callback);
            }else{
                callback(405);
            }

        };
    // [handlers.checks]

    // container for all the [handlers.checks]'s submethods
        
        handlers._checks = {};
        // [handlers._checks.post]

            // Required [data] : [headers.token, protocol, url, method, successCodes, timeoutSeconds], Optional [data] : none
                handlers._checks.post = function(data, callback){

                    // Validate inputs
                        var protocol =
                            // must be of type string 
                                typeof(data.payload.protocol) == 'string' &&
                            // must be of type string
                            // should match a string in allowed [protocol] array
                                ['https', 'http'].indexOf(data.payload.protocol) > -1 ?
                            // should match a string in allowed [protocol] array
                            // accept incoming [protocol] as valid or set to false
                                data.payload.protocol : false
                            // accept incoming [protocol] as valid or set to false
                        ;
                        var url =
                            // must be of type string 
                                typeof(data.payload.url) == 'string' &&
                            // must be of type string
                            // should not be null
                                data.payload.url.trim().length > 0 ?
                            // should not be null
                            // accept incoming [url] as valid or set it to false
                                data.payload.url.trim() : false
                            // accept incoming [url] as valid or set it to false
                        ;
                        var method =
                            // must be of type string 
                                typeof(data.payload.method) == 'string' &&
                            // must be of type string
                            // should match a string in allowed [method]'s array 
                                ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ?
                            // should match a string in allowed [method]'s array 
                            // accept incoming [method] as valid or set it to false
                                data.payload.method : false
                            // accept incoming [method] as valid or set it to false
                        ;
                        var successCodes =
                            // must be of type string 
                                typeof(data.payload.successCodes) == 'object' &&
                            // must be of type string
                            // must be an instance of an array 
                                data.payload.successCodes instanceof Array &&
                            // must be an instance of an array
                            // must not be null
                                data.payload.successCodes.length > 0 ?
                            // must not be null
                            // accept incoming [successCodes] as valid or set it to false
                                data.payload.successCodes : false
                            // accept incoming [successCodes] as valid or set it to false
                        ;
                        var timeoutSeconds =
                            // must be of type number
                                typeof(data.payload.timeoutSeconds) == 'number' &&
                            // must be of type number
                            // must be a whole number
                                data.payload.timeoutSeconds % 1 === 0 &&
                            // must be a whole number
                            // must be greater or equal to 1
                                data.payload.timeoutSeconds >= 1 &&
                            // must be greater or equal to 1
                            // must be less than or equal to 5
                                data.payload.timeoutSeconds <= 5 ?
                            // must be less than or equal to 5
                            // accept incoming [timeoutSeconds] as valid or set it to false
                                data.payload.timeoutSeconds : false
                            // accept incoming [timeoutSeconds] as valid or set it to false
                        ;
                    // Validate inputs
                    if(protocol && url && method && successCodes && timeoutSeconds){

                        // Get the [token] from the [headers]
                            var token = 
                                // must have valid [token] in [headers]
                                    typeof(data.headers.token) == 'string' ?
                                // must have valid [token] in [headers]
                                // accept incoming [token] valid or set it to false
                                    data.headers.token : false
                                // accept incoming [token] valid or set it to false
                            ;
                        // Get the [token] from the [headers]
                        // Lookup the [userData] by reading [phone] attribute of [token]
                            _data.read('tokens', token, function(err, tokenData){
                                
                                if(!err && tokenData){

                                    var userPhone = tokenData.phone;
                                    // Lookup the [userData]
                                        _data.read('users', userPhone, function(err, userData){

                                            if(!err && userData){
                                                
                                                var userChecks = 
                                                    // must be of type object
                                                        typeof(userData.checks) == 'object' &&
                                                    // must be of type object
                                                    // must be an instance of an array
                                                        userData.checks instanceof Array ?
                                                    // must be an instance of an array
                                                    // accept [checks] as valid array or set to empty array
                                                        userData.checks : []
                                                    // accept [checks] as valid array or set to empty array
                                                ;
                                                // verify that the [userData] has less than the number of [maxChecks]
                                                    
                                                    if(userChecks.length < config.maxChecks){

                                                        // Create a random number for [checkId]
                                                            var checkId = helpers.createRandomString(20); 
                                                        // Create a random number for [checkId] 
                                                        // Create [checkObject], and include the [userPhone]
                                                            var checkObject = {
                                                                'id': checkId,
                                                                'userPhone': userPhone,
                                                                'protocol': protocol,
                                                                'url': url,
                                                                'method': method,
                                                                'successCodes': successCodes,
                                                                'timeoutSeconds': timeoutSeconds
                                                            };
                                                        // Create [checkObject], and include the [userPhone]
                                                        // Save the [checkObject]
                                                            _data.create('checks', checkId, checkObject, function(err){

                                                                if(!err){
                                                                    // accept [checks] as a list of valid [userChecks]
                                                                        userData.checks = userChecks;
                                                                    // accept [checks] as a list of valid [userChecks]
                                                                    // update [userData]'s [checks] list with new [checkId] 
                                                                        userData.checks.push(checkId);
                                                                    // update [userData]'s [checks] list with new [checkId] 
                                                                    // Save [userData] with user's new check list [checks]
                                                                        _data.update('users', userPhone, userData, function(err){

                                                                            if(!err){
                                                                                // Return the data about the new [checkObject]
                                                                                    callback(200, checkObject);
                                                                                // Return the data about the new [checkObject]
                                                                            }else{
                                                                                callback(500, {'Error':'Could not update the user with the new check'});
                                                                            }

                                                                        });    
                                                                    // Save [userData] with user's new check list [checks]
                                                                }else{
                                                                    callback(500, {'Error':'Could not create the new check'});
                                                                }

                                                            });
                                                        // Save the [checkObject]
                                                    
                                                    }else{
                                                        callback(400, {'Error' : 'The user already has the maximum number of checks ('+config.maxChecks+')'});
                                                    }

                                                // verify that the [userData] has less than the number of [maxChecks]
                                            
                                            }else{
                                                // send back [statusCode] for unauthorized
                                                    callback(403);
                                                // send back [statusCode] for unauthorized
                                            }

                                        });
                                    // Lookup the [userData]

                                }else{
                                    // send back [statusCode] for unauthorized
                                        callback(403);
                                    // send back [statusCode] for unauthorized
                                }

                            });
                        // Lookup the [userData] by reading [phone] attribute of [token]

                    }else{
                        callback(400, {'Error' : 'Missing required inputs, or inputs are invalid'});
                    }

                };
            // Required [data] : [headers.token, protocol, url, method, successCodes, timeoutSeconds], Optional [data] : none

        // [handlers._checks.post]

        // [handlers._checks.get]
        
            // Required [data] : [headers.token, id], Optional [data] : none
                handlers._checks.get = function(data ,callback){

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

                        // Look up the [checkData]
                            _data.read('checks', id, function(err, checkData){

                                if(!err && checkData){

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
                                    // Verify that the given [token] is valid for [checkData.userPhone]
                                        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
                                        
                                            if(tokenIsValid){
                                                // Return the [checkData]
                                                    callback(200, checkData);
                                                // Return the [checkData]
                                            }else{
                                                callback(403);
                                            }
                                        
                                        });
                                    // Verify that the given [token] is valid for [checkData.userPhone]

                                }else{
                                    // not found [statusCode]
                                        callback(404);
                                    // not found [statusCode]
                                }

                            });
                        // Look up the [checkData]
                        
                    }else{
                        callback(400, {'Error' : 'Missing required field'});
                    }
                    
                };
            // Required [data] : [headers.token, id], Optional [data] : none

        // [handlers._checks.get]

        // [handlers._checks.put]
        
            // Required [data] : [headers.token, id], Optional [data] : [protocol, url, method, successCode, timeoutSeconds] (one must be sent)
                handlers._checks.put = function(data, callback){

                    // Validate the required [data]
                        var id = 
                            // must be of type string
                                typeof(data.payload.id) == 'string' &&
                            // must be of type string
                            // must be 20 digit in length
                                data.payload.id.trim().length == 20 ?
                            // must be 20 digit in length
                            // accept [data] as valid or set to false
                                data.payload.id.trim() : false
                            // accept [data] as valid or set to false
                        ;
                    // Validate the required [data]
                    // Validate optional [data]
                        var protocol =
                            // must be of type string 
                                typeof(data.payload.protocol) == 'string' &&
                            // must be of type string
                            // should match a string in allowed [protocol] array
                                ['https', 'http'].indexOf(data.payload.protocol) > -1 ?
                            // should match a string in allowed [protocol] array
                            // accept incoming [protocol] as valid or set to false
                                data.payload.protocol : false
                            // accept incoming [protocol] as valid or set to false
                        ;
                        var url =
                            // must be of type string 
                                typeof(data.payload.url) == 'string' &&
                            // must be of type string
                            // should not be null
                                data.payload.url.trim().length > 0 ?
                            // should not be null
                            // accept incoming [url] as valid or set it to false
                                data.payload.url.trim() : false
                            // accept incoming [url] as valid or set it to false
                        ;
                        var method =
                            // must be of type string 
                                typeof(data.payload.method) == 'string' &&
                            // must be of type string
                            // should match a string in allowed [method]'s array 
                                ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ?
                            // should match a string in allowed [method]'s array 
                            // accept incoming [method] as valid or set it to false
                                data.payload.method : false
                            // accept incoming [method] as valid or set it to false
                        ;
                        var successCodes =
                            // must be of type string 
                                typeof(data.payload.successCodes) == 'object' &&
                            // must be of type string
                            // must be an instance of an array 
                                data.payload.successCodes instanceof Array &&
                            // must be an instance of an array
                            // must not be null
                                data.payload.successCodes.length > 0 ?
                            // must not be null
                            // accept incoming [successCodes] as valid or set it to false
                                data.payload.successCodes : false
                            // accept incoming [successCodes] as valid or set it to false
                        ;
                        var timeoutSeconds =
                            // must be of type number
                                typeof(data.payload.timeoutSeconds) == 'number' &&
                            // must be of type number
                            // must be a whole number
                                data.payload.timeoutSeconds % 1 === 0 &&
                            // must be a whole number
                            // must be greater or equal to 1
                                data.payload.timeoutSeconds >= 1 &&
                            // must be greater or equal to 1
                            // must be less than or equal to 5
                                data.payload.timeoutSeconds <= 5 ?
                            // must be less than or equal to 5
                            // accept incoming [timeoutSeconds] as valid or set it to false
                                data.payload.timeoutSeconds : false
                            // accept incoming [timeoutSeconds] as valid or set it to false
                        ;
                    // Validate optional [data]
                    // Continue if the [id] is valid
                        if(id){

                            // Continue if one or more of the optional fields has been sent
                                if(protocol || url || method || successCodes || timeoutSeconds){
                                    // Look up the check
                                        _data.read('checks', id, function(err, checkData){

                                            if(!err && checkData){
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
                                                // Verify that the given [token] is valid for [checkData.userPhone]
                                                    handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
                                                    
                                                        if(tokenIsValid){
                                                            // Update the [checkData] where necessary

                                                                if(protocol){
                                                                    checkData.protocol = protocol;
                                                                }
                                                                if(url){
                                                                    checkData.url = url;
                                                                }
                                                                if(method){
                                                                    checkData.method = method;
                                                                }
                                                                if(successCodes){
                                                                    checkData.successCodes = successCodes;
                                                                }
                                                                if(timeoutSeconds){
                                                                    checkData.timeoutSeconds = timeoutSeconds;
                                                                }

                                                            // Update the [checkData] where necessary
                                                            // Store [checkData] with the new updates
                                                                _data.update('checks', id, checkData, function(err){

                                                                    if(!err){
                                                                        callback(200);
                                                                    }else{
                                                                        callback(500, {'Error': 'Could not update the check'});
                                                                    }

                                                                });
                                                            // Store [checkData] with the new updates
                                                        }else{
                                                            callback(403);
                                                        }
                                                    
                                                    });
                                                // Verify that the given [token] is valid for [checkData.userPhone]
                                            }else{
                                                callback(400, {'Error' : 'Check ID did not exist'});
                                            }

                                        });
                                    // Look up the check
                                }else{
                                    callback(400, {'Error' : 'Missing optional fields to update'});
                                }
                            // Continue if one or more of the optional fields has been sent     
                            
                        }else{
                            callback(400, {'Error' : 'Missing required field'});
                        }
                    // Continue if the [id] is valid

                };
            // Required [data] : [headers.token, id], Optional [data] : [protocol, url, method, successCode, timeoutSeconds] (one must be sent)
                
        // [handlers._checks.put]

        // [handlers._checks.delete]
        
            // Required [data] : [headers.token, id], Optional [data]: none
                handlers._checks.delete = function(data,callback){

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

                        // Look up the [checkData]
                            _data.read('checks', id, function(err, checkData){

                                if(!err && checkData){

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
                                    // Verify that the given [token] is valid for the [checkData.userPhone] number
                                        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid){
                                        
                                            if(tokenIsValid){

                                                // Delete the [checkData] from [userData]
                                                    _data.delete('checks', id, function(err){

                                                        if(!err){

                                                            // Look up the [userData] by [checkData.userPhone]
                                                                _data.read('users', checkData.userPhone, function(err, userData){
                                                                
                                                                    if(!err && userData){

                                                                        var userChecks = 
                                                                            // must be of type object
                                                                                typeof(userData.checks) == 'object' &&
                                                                            // must be of type object
                                                                            // must be an instance of an array
                                                                                userData.checks instanceof Array ?
                                                                            // must be an instance of an array
                                                                            // accept [checks] as valid array or set to empty array
                                                                                userData.checks : []
                                                                            // accept [checks] as valid array or set to empty array
                                                                        ;
                                                                        // Remove the deleted [checkData] from their list of checks [userChecks]
                                                                            
                                                                            var checkPosition = userChecks.indexOf(id);
                                                                            if(checkPosition > -1){
                                                                                userChecks.splice(checkPosition, 1);
                                                                                // Re-save the [userData]
                                                                                                                                                                    
                                                                                    _data.update('users', checkData.userPhone, userData, function(err){
                                                                                    
                                                                                        if(!err){
                                                                                            // successfull delete send back [statusCode] 200
                                                                                                callback(200);
                                                                                            // successfull delete send back [statusCode] 200
                                                                                        }else{
                                                                                            // internal server error + error message
                                                                                                callback(500, {'Error' : 'Could not update the user'});
                                                                                            // internal server error + error message
                                                                                        }
                                                                                    
                                                                                    });

                                                                                // Re-save the [userData]
                                                                            }else{
                                                                                callback(500, {'Error' : 'Could not find the check on the users object, so could not remove it'});
                                                                            }

                                                                        // Remove the deleted [checkData] from their list of checks [userChecks]
                                                                        
                                                                    }else{
                                                                        // send back 500 [statusCode] and error meassage
                                                                            callback(500, {'Error' :  'Could not find the user who created the check, so could not remove the check from the list of checks on the user object'});
                                                                        // send back 500 [statusCode] and error meassage
                                                                    }
                                                                
                                                                });
                                                            // Look up the [userData] by [checkData.userPhone]
                                                            
                                                        }else{
                                                            callback(500, {'Error' : 'Could not delete the check data'});
                                                        }

                                                    });
                                                // Delete the [checkData] from [userData]

                                            }else{
                                                callback(403);
                                            }
                                        
                                        });
                                    // Verify that the given [token] is valid for the [checkData.userPhone] number

                                }else{
                                    callback(400, {'Error' : 'The specified check ID does not exist'});
                                }

                            });
                        // Look up the [checkData]
                        
                    }else{
                        callback(400, {'Error' : 'Missing required field'});
                    }

                };
            // Required [data] : [headers.token, id], Optional [data]: none

        // [handlers._checks.delete]

    // container for all the [handlers.checks]'s submethods

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
