/*
* Helpers for various tasks
*
*/

// Dependencies
    var crypto = require('crypto');
    var config = require('./config');
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

// Container for all the [helpers]

// Export the module
    module.exports = helpers;
// Export the module