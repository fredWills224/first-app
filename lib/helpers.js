/*
* Helpers for various tasks
*
*/

// Dependencies
    var crypto = require('crypto');
    var config = require('./config');
    var https = require('https');
    var querystring = require('querystring');
// Dependencies

// Container for all the [helpers]

    var helpers = {};
    // [helpers.hash] helper handler with SHA256 -> built into node
        helpers.hash = function(str){
            
            if(typeof(str) == 'string' && str.length > 0){
                var hash = 
                    crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
                ;
                return hash;
            }else{
                return false;
            }

        }; 
    // [helpers.hash] helper handler with SHA256 -> built into node
    
    // [helpers.parseJsonToObject] helper handler
        helpers.parseJsonToObject = function(str){

            // parse string into json

                try{
                    var obj = JSON.parse(str);
                    return obj;
                }catch(e){
                    return {};
                }
                
            // parse string into json

        };
    // [helpers.parseJsonToObject] helper handler

    // [helpers.createRandomString]
        // Create a string of random alphanumeric characters, of a given length
            helpers.createRandomString = function(strLength){
                
                strLength = 
                    typeof(strLength) == 'number' && strLength > 0 ? strLength : false
                ;
                if(strLength){
                    
                    // define all the possible characters that could go into a string
                        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
                    // define all the possible characters that could go into a string
                    // init the final string
                        var str = '';
                    // init the final string
                    for(i = 1; i<= strLength; i++){
                        // get a random character from the [possibleCharacters] string
                            var randomCharacter = 
                                possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
                            ;
                        // get a random character from the [possibleCharacters] string
                        // append this character to final string
                            str += randomCharacter;
                        // append this character to final string
                    }
                    // return final [str]
                    return str;
                    // return final [str]

                }else{
                    return false;
                }

            }
        // Create a string of random alphanumeric characters, of a given length
    // [helpers.createRandomString]

    // Send a SMS message via Twilo
        helpers.sendTwilioSms = function(phone, msg, callback){

            // Validate parameters
                phone = 
                    // must be of type string
                        typeof(phone) == 'string' && 
                    // must be of type string
                    // must be 10 digits long
                        phone.trim().length == 10 ?
                    // must be 10 digits long
                    // accept [phone] as valid or default to false
                        phone.trim() : false
                    // accept [phone] as valid or default to false
                ;
                msg = 
                    // must be of type string
                    typeof(msg) == 'string' && 
                    // must be of type string
                    // must not be null
                        msg.trim().length > 0 &&
                    // must not be null
                    // must be less than or equal max characters
                        msg.trim().length <= 1600 ?
                    // must be less than or equal max characters
                    // accept [msg] as valid or default to false
                        msg.trim() : false
                    // accept [msg] as valid or default to false
                ;
            // Validate parameters
            if(phone && msg){
                // Configure the request payload being sent to twilo
                    var payload = {
                        'From' : config.twilio.fromPhone,
                        'To' : '+1' + phone,
                        'Body' : msg
                    };
                // Configure the request payload being sent to twilo
                // Stringify the payload with [querystring] module instead of [JSON] module
                    var stringPayload = querystring.stringify(payload);
                // Stringify the payload with [querystring] module instead of [JSON] module
                // Configure the request details
                    var requestDetails = {
                        'protocol' : 'https:',
                        'hostname' : 'api.twilio.com',
                        'method' : 'POST',
                        'path' : '/2010-04-01/Accounts/' +config.twilio.accountSid+ '/Messages.json',
                        'auth' : config.twilio.accountSid+ ':' +config.twilio.authToken,
                        'headers' : {
                            'Content-Type' : 'application/x-www-form-urlencoded',
                            'Content-Length' : Buffer.byteLength(stringPayload)
                        }
                    };
                // Configure the request details
                // Instantiate the request object
                    var req = https.request(requestDetails, function(res){
                        // Grab the status of the sent request
                            var status = res.statusCode;
                        // Grab the status of the sent request
                        // Callback successfully if the request went through
                            
                            if(status == 200 || status == 201){
                                // Send back false because there is no err. -> error back pattern
                                    callback(false);
                                // Send back false because there is no err. -> error back pattern
                            }else{
                                callback('Status code returned was ' + status);
                            }

                        // Callback successfully if the request went through
                    });
                // Instantiate the request object
                // Bind to the error event so it doesn't get thrown (and kill the thread)
                    // If [req] emits an error call this function and pass error in it as [e]
                        req.on('error', function(e){
                            callback(e);
                        });
                    // If [req] emits an error call this function and pass error in it as [e]
                // Bind to the error event so it doesn't get thrown (and kill the thread)
                // Add the payload
                    req.write(stringPayload);
                // Add the payload
                // End the request
                    req.end();
                // End the request
            }else{
                callback('Given parameters were missing or invalid');
            }

        };
    // Send a SMS message via Twilo

// Container for all the [helpers]

// Export the module
    module.exports = helpers;
// Export the module