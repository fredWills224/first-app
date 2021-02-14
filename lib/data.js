/*
* Library for storing and editing data  
*
*/

//Dependncies
    var fs = require('fs');
    var path = require('path');
//Dependncies

// Container for the module (to be exported)
    
    var lib = {};
    // Base directory of the data folder
        // [__dirname] -> current directory, available in all node apps
        lib.baseDir = path.join(__dirname,'/../.data/');
    // Base directory of the data folder

    // Write data to a file

        // dir -> model, file -> instance, data -> payload, callback
        lib.create = function(dir, file, data, callback){
            
            // Open the file for writing
                fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
                    
                    if(!err && fileDescriptor){

                        // Convert data to a string
                            var stringData = JSON.stringify(data);
                        // Convert data to a string
                        // Write to a file and close it
                            fs.writeFile(fileDescriptor, stringData, function(err){
                                
                                if(!err){

                                    // Close file
                                        fs.close(fileDescriptor, function(err){
                                            
                                            if(!err){
                                                // error set to false
                                                    callback(false);
                                                // error set to false
                                            }else{
                                                callback('Error closing new file');
                                            }

                                        });
                                    // Close file

                                }else{
                                    callback('Error writing to new file');
                                }

                            });
                        // Write to a file and close it
                    
                    }else{
                        callback('Could not create new file, it may already exist');
                    }

                });
            // Open the file for writing

        };

    // Write data to a file

    // Read data from a file

        // dir -> model, file(without [.json] extension) -> instance, callback
        lib.read = function(dir, file, callback){
            fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err, data){
                callback(err, data);
            });
        };

    // Read data from a file

    // Update data inside a file
        lib.update = function(dir,file,data,callback){
            
            // Open the file for writing
                fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err,fileDescriptor){

                    if(!err && fileDescriptor){
                        
                        //Convert data to a string
                            var stringData = JSON.stringify(data);
                        //Convert data to a string
                        // Truncate the file
                            fs.ftruncate(fileDescriptor, function(err){

                                if(!err){

                                    // Write the file
                                        fs.writeFile(fileDescriptor, stringData, function(err)
                                        {
                                            if(!err){
                                                // Close file
                                                    fs.close(fileDescriptor, function(err){

                                                        if(!err){
                                                            callback(false);
                                                        }else{
                                                            callback('Error closing existing file');
                                                        }

                                                    });
                                                // Close file
                                            }else{
                                                callback('Error writing to existing file');
                                            }
                                        
                                        });
                                    // Write the file

                                }else{
                                    callback('Error truncating file');
                                }

                            });
                        // Truncate the file
 
                    }else{
                        callback('Could not open the file for updating, it may not exist yet');
                    }

                });
            // Open the file for writing
        
        };
    // Update data inside a file

    // Delete a file
        lib.delete = function(dir, file, callback){

            // Unlink the file
                fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
                    if(!err){
                        callback(false);
                    }else{
                        callback('Error deleting file');
                    }
                });
            // Unlink the file

        };
    // Delete a file

// Container for the module (to be exported)

// Export the module
    module.exports = lib;
// Export the module