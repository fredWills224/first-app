/*
* Worker-related tasks
* 
*/

// Dependencies
   var path = require('path');
   var fs = require('fs');
   var _data = require('./data');
   var https = require('https');
   var http = require('http');
   var helpers = require('./helpers');
   var url = require('url'); 
   var _logs = require('./logs');
// Dependencies

// Instantiate the [workers] object
    var workers = {};
// Instantiate the [workers] object

// Lookup all [checks], get their [originalCheckData], and send to [validateCheckData]
    workers.gatherAllChecks = function(){
        // get all the [checks]
            _data.list('checks', function(err, checks){

                if(!err && checks && checks.length > 0){
                    checks.forEach(function(check){
                        // Read in the [check]'s [originalCheckData]
                            _data.read('checks', check, function(err, originalCheckData){

                                if(!err && originalCheckData){
                                    // Pass it to [validateCheckData], and let that function continue or log errors as needed
                                        workers.validateCheckData(originalCheckData);
                                    // Pass it to [validateCheckData], and let that function continue or log errors as needed
                                }else{
                                    console.log("Error reading one of the check's data");
                                }

                            });
                        // Read in the [check]'s [originalCheckData]
                    });
                }else{
                    console.log("Error: Could not find any cheks to process");
                }

            });
        // get all the [checks]
    };
// Lookup all [checks], get their [originalCheckData], and send to [validateCheckData]

// Sanity-check the [originalCheckData]
    workers.validateCheckData = function(originalCheckData){
        
        originalCheckData =
            // must be of type object
                typeof(originalCheckData) == 'object' &&
            // must be of type object
            // must not be null
                originalCheckData !== null ?
            // must not be null
            // accept [originalCheckData] as valid or set to empty object
                originalCheckData : {}
            // accept [originalCheckData] as valid or set to empty object
        ;
        originalCheckData.id = 
            typeof(originalCheckData.id) == 'string' &&
            originalCheckData.id.trim().length == 20 ?
            originalCheckData.id.trim() : false
        ;
        originalCheckData.userPhone = 
            typeof(originalCheckData.userPhone) == 'string' &&
            originalCheckData.userPhone.trim().length == 10 ?
            originalCheckData.userPhone.trim() : false
        ;
        originalCheckData.protocol = 
            typeof(originalCheckData.protocol) == 'string' &&
            ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ?
            originalCheckData.protocol : false
        ;
        originalCheckData.url = 
            typeof(originalCheckData.url) == 'string' &&
            originalCheckData.url.trim().length > 0 ?
            originalCheckData.url.trim() : false
        ;
        originalCheckData.method = 
            typeof(originalCheckData.method) == 'string' &&
            ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ?
            originalCheckData.method : false
        ;
        originalCheckData.successCodes = 
            typeof(originalCheckData.successCodes) == 'object' &&
            originalCheckData.successCodes instanceof Array &&
            originalCheckData.successCodes.length > 0 ?
            originalCheckData.successCodes : false
        ;
        originalCheckData.timeoutSeconds = 
            typeof(originalCheckData.timeoutSeconds) == 'number' &&
            originalCheckData.timeoutSeconds % 1 === 0 &&
            originalCheckData.timeoutSeconds >= 1 &&
            originalCheckData.timeoutSeconds <= 5 ?
            originalCheckData.timeoutSeconds : false
        ;
        // Set the keys that may not be set (if the [workers] have never seen this [check] before)
            originalCheckData.state = 
                typeof(originalCheckData.state) == 'string' &&
                ['up', 'down'].indexOf(originalCheckData.state) > -1 ?
                // accept [state] as valid or set to 'down'
                    // assume [state] is down if [originalCheckData.url] has never been check
                        originalCheckData.state : 'down'
                    // assume [state] is down if [originalCheckData.url] has never been check
                // accept [state] as valid or set to 'down'
            ;
            originalCheckData.lastChecked = 
                typeof(originalCheckData.lastChecked) == 'number' &&
                originalCheckData.lastChecked > 0 ?
                originalCheckData.lastChecked : false
            ;
        // Set the keys that may not be set (if the [workers] have never seen this [check] before)
        // If all the [checks] pass, send the [originalCheckData] along to the next step in the process

            if(
                originalCheckData.id &&
                originalCheckData.userPhone &&
                originalCheckData.protocol &&
                originalCheckData.url &&
                originalCheckData.method &&
                originalCheckData.successCodes &&
                originalCheckData.timeoutSeconds
            ){
                workers.performCheck(originalCheckData);
            }else{
                console.log("Error : One of the checks is not properly formatted. Skipping it." + 
                originalCheckData.protocol);
            }

        // If all the [checks] pass, send the [originalCheckData] along to the next step in the process

    };
// Sanity-check the [originalCheckData]

// [performCheck], send the [originalCheckData] and the [checkOutcome], to the next step
    workers.performCheck = function(originalCheckData){
        
        // Prepare the initial [checkOutcome]
            var checkOutcome = {
                'error' : false,
                'responseCode' : false
            };
        // Prepare the initial [checkOutcome]
        // Mark that the [checkOutcome] has not been sent yet
            var outcomeSent = false;
        // Mark that the [checkOutcome] has not been sent yet
        // Parse the [hostName] and the [path] out of the [originalCheckData.url]
            var parsedUrl = url.parse(originalCheckData.protocol +'://'+ originalCheckData.url, true);
            var hostName = parsedUrl.hostname;
            var path = parsedUrl.path; // Using [path] and not [pathname] because we want full [queryStringObject]
        // Parse the [hostName] and the [path] out of the [originalCheckData.url]
        // Construct the [requestDetails]
            var requestDetails = {
                'protocol' : originalCheckData.protocol +':',
                'hostname' : hostName,
                'method' : originalCheckData.method.toUpperCase(),
                'path' : path,
                'timeout' : originalCheckData.timeoutSeconds * 1000
            };
        // Construct the [requestDetails]
        // Instantiate the [req]uest object (using either the [http] or [https] module)
        
            var _moduleToUse = 
                originalCheckData.protocol == 'http' ?
                http : https
            ;
            var req = _moduleToUse.request(requestDetails, function(res){
                
                // Grab the [status] of the sent [req]uest
                    var status = res.statusCode;
                // Grab the [status] of the sent [req]uest
                // Update the [checkOutcome] and pass the [originalCheckData] along

                    checkOutcome.responseCode = status;
                    if(!outcomeSent){
                        workers.processCheckOutcome(originalCheckData, checkOutcome);
                        outcomeSent = true;
                    }

                // Update the [checkOutcome] and pass the [originalCheckData] along

            });
        // Instantiate the [req]uest object (using either the [http] or [https] module)
        // Bind to the [error] event so it doesn't get thrown
            req.on('error', function(e){
                // Update the [checkOutcome] and pass the [originalCheckData] along
            
                    checkOutcome.error = {
                        'error' : true,
                        'value' : e
                    };
                    if(!outcomeSent){
                        workers.processCheckOutcome(originalCheckData, checkOutcome);
                        outcomeSent = true;
                    }
                
                // Update the [checkOutcome] and pass the [originalCheckData] along
            });
        // Bind to the [error] event so it doesn't get thrown
        // Bind to the timeout event
            req.on('timeout', function(e){
                // Update the [checkOutcome] and pass the [originalCheckData] along
            
                    checkOutcome.error = {
                        'error' : true,
                        'value' : 'timeout'
                    };
                    if(!outcomeSent){
                        workers.processCheckOutcome(originalCheckData, checkOutcome);
                        outcomeSent = true;
                    }
                
                // Update the [checkOutcome] and pass the [originalCheckData] along
            });
        // Bind to the timeout event
        // Send the [req]uest
            req.end();
        // Send the [req]uest

    };
// [performCheck], send the [originalCheckData] and the [checkOutcome], to the next step

// Process the [checkOutcome], update the [originalCheckData] as needed, trigger an alert if needed

    // Special logic for accomodating a [check] that has never been tested before (don't alert on that one)
        workers.processCheckOutcome = function(originalCheckData, checkOutcome){

            // Decide if the [check]'s [state] is considered up or down
                var state = 
                    !checkOutcome.error && 
                    checkOutcome.responseCode &&
                    originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ?
                    'up' : 'down'
                ;
            // Decide if the [check]'s [state] is considered up or down
            
            // Decide if there is an [alertWarranted]
                var alertWarranted = 
                    originalCheckData.lastChecked && 
                    originalCheckData.state !== state ?
                    true : false
                ;
            // Decide if there is an [alertWarranted]

            // Log the [checkOutcome]
                var timeOfCheck = Date.now();
                workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);
            // Log the [checkOutcome]

            // Update to the [newCheckData]
                var newCheckData = originalCheckData;
                newCheckData.state = state;
                newCheckData.lastChecked = timeOfCheck;
            // Update to the [newCheckData]

            // Save the updates as [newCheckData]
                _data.update('checks', newCheckData.id, newCheckData, function(err){

                    if(!err){
                        // Send the [newCheckData] to the next phase in the process if needed
                            
                            if(alertWarranted){
                                workers.alertUserToStatusChange(newCheckData);
                            }else{
                                console.log('Check outcome has not changed, no alert needed');
                            }
                            
                        // Send the [newCheckData] to the next phase in the process if needed
                    }else{
                        console.log("Error trying to save updates to one of the checks");
                    }

                });
            // Save the updates as [newCheckData]

        };
    // Special logic for accomodating a [check] that has never been tested before (don't alert on that one)
    
// Process the [checkOutcome], update the [originalCheckData] as needed, trigger an alert if needed

// Alert [newCheckData.userPhone] as to a change in their [check]'s [state]
    workers.alertUserToStatusChange = function(newCheckData){
        var msg = 
            'Alert: Your check for ' +newCheckData.method.toUpperCase()+ 
            ' ' +newCheckData.protocol+ '://' +newCheckData.url+
            ' is currently ' +newCheckData.state
        ;
        helpers.sendTwilioSms(newCheckData.userPhone, msg, function(err){
            
            if(!err){
                console.log(
                    "Success: User was alerted to a status change in their check, via sms: ", msg
                );
            }else{
                console.log(
                    "Error: Could not send sms alert to user who had a state change in their check" +
                    err
                );
            }

        });
    };
// Alert [newCheckData.userPhone] as to a change in their [check]'s [state]

// [workers.log]
    workers.log = function(// private function only used here not much sanity checking required
            originalCheckData, checkOutcome, 
            state, alertWarranted, timeOfCheck
        ){

        // Form the log data
            var logData = {
                'check' : originalCheckData,
                'outcome' : checkOutcome,
                'state' : state,
                'alert' : alertWarranted,
                'time' : timeOfCheck
            };
        // Form the log data
        // Convert data to a string
            var logString = JSON.stringify(logData);
        // Convert data to a string
        // Determine the name of the log file
            var logFileName = originalCheckData.id;
        // Determine the name of the log file
        // Append the log string to the file
            _logs.append(logFileName, logString, function(err){

                if(!err){
                    console.log("Logging to file succeeded");
                }else{
                    console.log("Logging to file failed");
                }

            });
        // Append the log string to the file

    };
// [workers.log]

// Timer to execute the worker-process once per minute 
    workers.loop = function(){
        setInterval(function(){
            workers.gatherAllChecks();
        }, 1000 * 60);
    };
// Timer to execute the worker-process once per minute

// Rotate (compress) the log files
    workers.rotateLogs = function(){
        // List all the (non compressed) log files
            // [_logs.list].firstParameter -> boolean -> shouldIncludeCompressedFilesInList
                _logs.list(false, function(err, logs){

                    if(!err && logs && logs.length > 0){

                        logs.forEach(function(logName){
                            // Compress the data to a different file
                                
                                // [logId] = [logName] - ['.log']
                                    var logId = logName.replace('.log', '');
                                // [logId] = [logName] - ['.log']
                                // [newFileId] = [logId] + date of compression
                                    var newFileId = logId +'-'+ Date.now();
                                // [newFileId] = [logId] + date of compression
                                _logs.compress(logId, newFileId, function(err){

                                    if(!err){
                                        // Truncate the log -> remove the uncompressed copy of files that have been compressed.
                                            _logs.truncate(logId, function(err){

                                                if(!err){
                                                    console.log("Success truncating logFile");
                                                }else{
                                                    console.log("Error truncating logFile");
                                                }

                                            });
                                        // Truncate the log -> remove the uncompressed copy of files that have been compressed. 
                                    }else{
                                        console.log("Error compressing one of the log files", err);
                                    }

                                });

                            // Compress the data to a different file
                        });

                    }else{
                        console.log("Error : could not find any logs to rotate");
                    }

                });
            // [_logs.list].firstParameter -> boolean -> shouldIncludeCompressedFilesInList
        // List all the (non compressed) log files
    };
// Rotate (compress) the log files

// Timer to execute the log-rotation process once per day
    workers.logRotationLoop = function(){
        setInterval(function(){
            workers.rotateLogs();
        }, 1000 * 60 * 60 * 24);
    };
// Timer to execute the log-rotation process once per day

// Init script
    workers.init = function(){
        // Execute all the [checks] immediately (first [check] won't begin until after [setTimeout])
            workers.gatherAllChecks();
        // Execute all the [checks] immediately (first [check] won't begin until after [setTimeout])
        // Call the loop so the [checks] will execute later on
            workers.loop();
        // Call the loop so the [checks] will execute later on
        // Compress all the logs immediately
            workers.rotateLogs();
        // Compress all the logs immediately
        // Call the compression loop so logs will be compressed later on
            workers.logRotationLoop();
        // Call the compression loop so logs will be compressed later on
    };
// Init script

// Export the [module]
    module.exports = workers;
// Export the [module]