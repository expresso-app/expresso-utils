const AppError = require('./error-handling/app-error');
const globalErrorHandler = require('./error-handling/global-error-handler');
const catchAsync = require('./catch-async');
const helpers = require('./helpers');

module.exports = {
    catchAsync,
    helpers,
    errorHandling: {
        AppError,
        globalErrorHandler
    },
};