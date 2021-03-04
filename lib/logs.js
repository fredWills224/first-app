/*
* Library for storing and rotating logs
* 
*/

// Dependencies
    var fs = require('fs');
    var path = require('path');
    var zlib = require('zlib');
// Dependencies

// Container for the module
    var lib = {};
// Container for the module

// Base directory of the logs folder
    lib.baseDir = path.join(__dirname, '/../.logs/');
// Base directory of the logs folder

// Append a string to a file. Create the file if it does not exist
    lib.append = function(file, str, callback){
        // Open the file for appending using the ['a'] switch
            fs.open(lib.baseDir +file+ '.log', 'a', function(err, fileDescriptor){

                if(!err && fileDescriptor){
                    // Append to the file and close it
                        fs.appendFile(fileDescriptor, str +'\n', function(err){

                            if(!err){
                                // Close the file
                                    fs.close(fileDescriptor, function(err){

                                        if(!err){
                                            callback(false);
                                        }else{
                                            callback('Error closing file that was being appended');
                                        }

                                    });
                                // Close the file
                            }else{
                                callback('Error appending to file');
                            }

                        });
                    // Append to the file and close it
                }else{
                    callback('Could not open file for appending');
                }

            });
        // Open the file for appending using the ['a'] switch
    };
// Append a string to a file. Create the file if it does not exist

// Export the module
    module.exports = lib;
// Export the module