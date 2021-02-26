/*
* Create and export configuration variables
*
*/

// Dependencies
    var auth = require('../.twilio/auth');
// Dependencies

// Container for all the environments
    var environments = {};
// Container for all the environments

// Staging (default) environment
    environments.staging = {
        'httpPort' : 3000,
        'httpsPort' : 3001,
        'envName' : 'staging',
        'hashingSecret' : 'thisIsASecret',
        'maxChecks' : 5,
        'twilio' : {
            'accountSid' : auth.myFirstTwilioAccountSID,
            'authToken' : auth.myFirstTwilioAccountAuthToken,
            'fromPhone' : auth.myFirstTwilioAccountFromPhone
        }
    };
// Staging (default) environment

// Production environment
    environments.production = {
        'httpPort' : 5000,
        'httpsPort' : 5001,
        'envName' : 'production',
        'hashingSecret' : 'thisIsAlsoASecret',
        'maxChecks' : 5,
        'twilio' : {
            'accountSid' : auth.myInstructorsSID,
            'authToken' : auth.myInstructorsAuthToken,
            'fromPhone' : auth.myInstructorsFromPhone
        }
    };
// Production environment

// Determine which environment was passed as a command-line argument
    var currentEnvironment = 
        typeof(process.env.NODE_ENV) == 'string' ? 
        process.env.NODE_ENV.toLocaleLowerCase() : ''
    ;
// Determine which environment was passed as a command-line argument

// Check that the current environment is one of the environments above, if not, default to staging
    var environmentToExport = 
        typeof(environments[currentEnvironment]) == 'object' ?
        environments[currentEnvironment] : environments.staging
    ;
// Check that the current environment is one of the environments above, if not, default to staging

// Export the module
    module.exports = environmentToExport;
// Export the module