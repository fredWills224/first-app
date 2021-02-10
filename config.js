/*
* Create and export configuration variables
*
*/

// Container for all the environments
    var environments = {};
// Container for all the environments

// Staging (default) environment
    environments.staging = {
        'port' : 3000,
        'envName' : 'staging'
    };
// Staging (default) environment

// Production environment
    environments.production = {
        'port' : 5000,
        'envName' : 'production'
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