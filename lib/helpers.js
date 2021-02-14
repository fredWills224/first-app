/*
* Helpers for various tasks
*
*/

// Dependencies
    var crypto = require('crypto');
    var config = require('../config');
// Dependencies

// Container for all the [helpers]

    var helpers = {};
    // Create a hash with SHA256 -> built into node
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
    // Create a hash with SHA256 -> built into node 

// Container for all the [helpers]

// Export the module
    module.exports = helpers;
// Export the module