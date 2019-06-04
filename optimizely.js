const optimizelySDK = require('@optimizely/optimizely-sdk');
var defaultErrorHandler = require("@optimizely/optimizely-sdk").errorHandler;

optimizelySDK.setLogLevel('info');
optimizelySDK.setLogger(optimizelySDK.logging.createLogger())

const optimizelyClientInstance = optimizelySDK.createInstance({
  sdkKey: 'Tt1jyfxqcZbFmtyLf9E4Je',
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 1000,  // 1 second in milliseconds
  },errorHandler: defaultErrorHandler
});


module.exports = optimizelyClientInstance;