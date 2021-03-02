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
// Dependencies

// Instantiate the [workers] object
    var workers = {};
// Instantiate the [workers] object

// Lookup all [checks], get their [data], and send to validator
    workers.gatherAllChecks = function(){
        // get all the [checks]
            _data.list('checks', function(err, checks){

                if(!err && checks && checks.length > 0){
                    checks.forEach(function(check){
                        // Read in the [check] data
                            _data.read('checks', check, function(err, originalCheckData){

                                if(!err && originalCheckData){
                                    // Pass it to the check validator, and let that function continue or log errors as needed
                                        workers.validateCheckData(originalCheckData);
                                    // Pass it to the check validator, and let that function continue or log errors as needed
                                }else{
                                    console.log("Error reading one of the check's data");
                                }

                            });
                        // Read in the [check] data
                    });
                }else{
                    console.log("Error: Could not find any cheks to process");
                }

            });
        // get all the [checks]
    };
// Lookup all [checks], get their [data], and send to validator

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
        // Set the keys that may not be set (if the workers have never seen this check before)
            originalCheckData.state = 
                typeof(originalCheckData.state) == 'string' &&
                ['up', 'down'].indexOf(originalCheckData.state) > -1 ?
                // accept [state] as valid or set to 'down'
                    // assume [url] is down if it has never been check
                        originalCheckData.state : 'down'
                    // assume [url] is down if it has never been check
                // accept [state] as valid or set to 'down'
            ;
            originalCheckData.lastChecked = 
                typeof(originalCheckData.lastChecked) == 'number' &&
                originalCheckData.lastChecked > 0 ?
                originalCheckData.lastChecked : false
            ;
        // Set the keys that may not be set (if the workers have never seen this check before)
        // If all the checks pass, send the data along to the next step in the process

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

        // If all the checks pass, send the data along to the next step in the process

    };
// Sanity-check the [originalCheckData]

// Perform the check, send the originalCheckData and the outcome of the check process, to the next step
    workers.performCheck = function(originalCheckData){
        
        // Prepare the initial check outcome
            var checkOutcome = {
                'error' : false,
                'responseCode' : false
            };
        // Prepare the initial check outcome
        // Mark that the outcome has not been sent yet
            var outcomeSent = false;
        // Mark that the outcome has not been sent yet
        // Parse the [hostName] and the [path] out of the [originalCheckData]
            var parsedUrl = url.parse(originalCheckData.protocol +'://'+ originalCheckData.url, true);
            var hostName = parsedUrl.hostname;
            var path = parsedUrl.path; // Using [path] and not [pathname] because we want full [queryStringObject]
        // Parse the [hostName] and the [path] out of the [originalCheckData]
        // Construct the request
            var requestDetails = {
                'protocol' : originalCheckData.protocol +':',
                'hostname' : hostName,
                'method' : originalCheckData.method.toUpperCase(),
                'path' : path,
                'timeout' : originalCheckData.timeoutSeconds * 1000
            };
        // Construct the request
        // Instantiate the request object (using either the http or https module)
        
            var _moduleToUse = 
                originalCheckData.protocol == 'http' ?
                http : https
            ;
            var req = _moduleToUse.request(requestDetails, function(res){
                
                // Grab the status of the sent request
                    var status = res.statusCode;
                // Grab the status of the sent request
                // Update the checkOutcome and pass the data along

                    checkOutcome.responseCode = status;
                    if(!outcomeSent){
                        workers.processCheckOutcome(originalCheckData, checkOutcome);
                        outcomeSent = true;
                    }

                // Update the checkOutcome and pass the data along

            });
        // Instantiate the request object (using either the http or https module)
        // Bind to the error event so it doesn't get thrown
            req.on('error', function(e){
                // Update the checkOutcome and pass the data along
            
                    checkOutcome.error = {
                        'error' : true,
                        'value' : e
                    };
                    if(!outcomeSent){
                        workers.processCheckOutcome(originalCheckData, checkOutcome);
                        outcomeSent = true;
                    }
                
                // Update the checkOutcome and pass the data along
            });
        // Bind to the error event so it doesn't get thrown
        // Bind to the timeout event
            req.on('timeout', function(e){
                // Update the checkOutcome and pass the data along
            
                    checkOutcome.error = {
                        'error' : true,
                        'value' : 'timeout'
                    };
                    if(!outcomeSent){
                        workers.processCheckOutcome(originalCheckData, checkOutcome);
                        outcomeSent = true;
                    }
                
                // Update the checkOutcome and pass the data along
            });
        // Bind to the timeout event
        // Send the request
            req.end();
        // Send the request

    };
// Perform the check, send the originalCheckData and the outcome of the check process, to the next step

// Process the check outcome, update the check data as needed, trigger an alert if needed

    // Special logic for accomodating a check that has never been tested before (don't alert on that one)
        workers.processCheckOutcome = function(originalCheckData, checkOutcome){

            // Decide if the check is considered up or down
                var state = 
                    !checkOutcome.error && 
                    checkOutcome.responseCode &&
                    originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ?
                    'up' : 'down'
                ;
            // Decide if the check is considered up or down
            // Decide if an alert is warranted
                var alertWarranted = 
                    originalCheckData.lastChecked && 
                    originalCheckData.state !== state ?
                    true : false
                ;
            // Decide if an alert is warranted
            // Update the check data
                var newCheckData = originalCheckData;
                newCheckData.state = state;
                newCheckData.lastChecked = Date.now();
            // Update the check data
            // Save the updates
                _data.update('checks', newCheckData.id, newCheckData, function(err){

                    if(!err){
                        // Send the new check data to the next phase in the process if needed
                            
                            if(alertWarranted){
                                workers.alertUserToStatusChange(newCheckData);
                            }else{
                                console.log('Check outcome has not changed, no alert needed');
                            }
                            
                        // Send the new check data to the next phase in the process if needed
                    }else{
                        console.log("Error trying to save updates to one of the checks");
                    }

                });
            // Save the updates

        };
    // Special logic for accomodating a check that has never been tested before (don't alert on that one)
    
// Process the check outcome, update the check data as needed, trigger an alert if needed

// Alert the user as to a change in their check status
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
// Alert the user as to a change in their check status

// Timer to execute the worker-process once per minute 
    workers.loop = function(){
        setInterval(function(){
            workers.gatherAllChecks();
        }, 1000 * 60)
    };
// Timer to execute the worker-process once per minute

// Init script
    workers.init = function(){
        // Execute all the checks immediately (first check won't begin until after [setTimeout])
            workers.gatherAllChecks();
        // Execute all the checks immediately (first check won't begin until after [setTimeout])
        // Call the loop so the checks will execute later on
            workers.loop();
        // Call the loop so the checks will execute later on
    };
// Init script

// Export the [module]
    module.exports = workers;
// Export the [module]