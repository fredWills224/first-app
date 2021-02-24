/*
* Create and export configuration variables
*
*/

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
            'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
            'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
            'fromPhone' : '+15005550006'
        }
    };
// Staging (default) environment

/* 
    statusCode : 400
    'accountSid' : 'ACbaf34253a6ef08f876b6439eaa5d70a0',
    'authToken' : '0d085ca80d130fd3ccddd12c33c41762',
    'fromPhone' : '+15135403117'
*/

// Production environment
    environments.production = {
        'httpPort' : 5000,
        'httpsPort' : 5001,
        'envName' : 'production',
        'hashingSecret' : 'thisIsAlsoASecret',
        'maxChecks' : 5,
        'twilio' : {
            'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
            'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
            'fromPhone' : '+15005550006'
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