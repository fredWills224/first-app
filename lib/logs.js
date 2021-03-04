/*
* Library for storing and rotating logs
* 
*/

// Dependencies
    var fs = require('fs');
    var path = require('path');
    var zlib = require('zlib');
// Dependencies

// Container for the [module]
    var lib = {};
// Container for the [module]

// [lib.baseDir] -> base directory of the logs folder
    lib.baseDir = path.join(__dirname, '/../.logs/');
// [lib.baseDir] -> base directory of the logs folder

// [lib.append] -> Append a [str]ing to a [file]. Create the [file] if it does not exist
    lib.append = function(file, str, callback){
        // Open the [file] for [append]ing using the ['a'] switch
            fs.open(lib.baseDir +file+ '.log', 'a', function(err, fileDescriptor){

                if(!err && fileDescriptor){
                    // [fs.appendFile] -> Append to the [file] using [fileDescriptor] and close it
                        fs.appendFile(fileDescriptor, str +'\n', function(err){

                            if(!err){
                                // Close the [file] using [fileDescriptor]
                                    fs.close(fileDescriptor, function(err){

                                        if(!err){
                                            callback(false);
                                        }else{
                                            callback('Error closing file that was being appended');
                                        }

                                    });
                                // Close the [file] using [fileDescriptor]
                            }else{
                                callback('Error appending to file');
                            }

                        });
                    // [fs.appendFile] -> Append to the [file] using [fileDescriptor] and close it
                }else{
                    callback('Could not open file for appending');
                }

            });
        // Open the [file] for [append]ing using the ['a'] switch
    };
// [lib.append] -> Append a [str]ing to a [file]. Create the [file] if it does not exist

// List all the [logs], and optionally include the compressed [logs]
    lib.list = function(includeCompressedLogs, callback){
        fs.readdir(lib.baseDir, function(err, data){

            if(!err && data && data.length > 0){
                
                // [data.fileName] - ['.log'] list
                    var trimmedFileNames = [];
                // [data.fileName] - ['.log'] list
                data.forEach(function(fileName){

                    // Add the ['.log'] files
                        if(fileName.indexOf('.log') > -1){
                            trimmedFileNames.push(fileName.replace('.log', ''));
                        }
                    // Add the ['.log'] files
                    // Add on the compressed files with extention .gz (+ .b64 also base64 encoded so can be read easly later)
                        if(fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs){
                            trimmedFileNames.push(fileName.replace('.gz.b64', ''));
                        }
                    // Add on the compressed files with extention '.gz' (+ '.b64' also base64 encoded so can be read easly later)

                });
                callback(false, trimmedFileNames);

            }else{
                callback(err, data);
            }

        });
    };
// List all the [logs], and optionally include the compressed [logs]

// Compress the contents of one ['.log'] [file] into a ['.gz.b64'] [file] within the same directory
    lib.compress = function(logId, newFileId, callback){
        
        var sourceFile = logId + '.log';
        var destFile = newFileId + '.gz.b64';
        // Read the source file
            fs.readFile(lib.baseDir + sourceFile, 'utf8', function(err, inputString){

                if(!err && inputString){
                    // Compress the data using [gzip] from [zlib]
                        zlib.gzip(inputString, function(err, buffer){

                            if(!err && buffer){
                                // Send the data to the [destFile] using ['wx'] flag for writing
                                    fs.open(lib.baseDir +destFile, 'wx', function(err, fileDescriptor){

                                        if(!err && fileDescriptor){
                                            // Write to the [destFile] using [fileDescriptor] and built-in [toString] function to pass in encoded string
                                                fs.writeFile(fileDescriptor, buffer.toString('base64'), function(err){

                                                    if(!err){
                                                        // Close the [destFile]
                                                            fs.close(fileDescriptor, function(err){

                                                                if(!err){
                                                                    callback(false);
                                                                }else{
                                                                    callback(err);
                                                                }

                                                            });
                                                        // Close the [destFile]
                                                    }else{
                                                        callback(err);
                                                    }

                                                });
                                            // Write to the [destFile] using [fileDescriptor] and built-in [toString] function to pass in encoded string
                                        }else{
                                            callback(err);
                                        }

                                    });
                                // Send the data to the [destFile] using ['wx'] flag for writing
                            }else{
                                callback(err);
                            }

                        });
                    // Compress the data using [gzip] from [zlib]
                }else{
                    callback(err);
                }

            });
        // Read the source [file]

    };
// Compress the contents of one ['.log'] [file] into a ['.gz.b64'] [file] within the same directory

// [lib.decompress] -> Decompress the contents of a ['.gz.b64'] [file] into a [str]ing variable
    lib.decompress = function(fileId, callback){

        var fileName = fileId + '.gz.b64';
        fs.readFile(lib.baseDir + fileName, 'utf8', function(err, str){

            if(!err && str){
                // Decompress the data (base64 encoded string), into a buffer, unzip buffer into a plain string
                    var inputBuffer = Buffer.from(str, 'base64');
                    zlib.unzip(inputBuffer, function(err, outputBuffer){

                        if(!err && outputBuffer){
                            // Callback
                                var str = outputBuffer.toString();
                                callback(false, str);
                            // Callback
                        }else{
                            callback(err);
                        }

                    });
                // Decompress the data (base64 encoded string), into a buffer, unzip buffer into a plain string
            }else{
                callback(err);
            }

        });

    };
// [lib.decompress] -> Decompress the contents of a ['.gz.b64'] [file] into a [str]ing variable

// [lib.truncate] -> Truncate a log [file] using [logId]
    lib.truncate = function(logId, callback){
        fs.truncate(lib.baseDir +logId+ '.log', 0, function(err){

            if(!err){
                callback(false);
            }else{
                callback(err);
            }

        });
    };
// [lib.truncate] -> Truncate a log [file] using [logId]

// Export the [module]
    module.exports = lib;
// Export the [module]