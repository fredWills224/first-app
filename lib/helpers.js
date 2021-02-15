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

// Container for all the [helpers]

// Export the module
    module.exports = helpers;
// Export the module